// import application from '@ijstech/application';
import {Container, customElements, isObservable, ContainerElement, Observe, Control, I18n} from '@ijstech/base';
import { Checkbox } from '@ijstech/checkbox';
import { ComboBox } from '@ijstech/combo-box';
import { IconElement } from '@ijstech/icon';
import { Input } from '@ijstech/input';
import { Modal, ModalElement } from '@ijstech/modal';
import { RadioGroup } from '@ijstech/radio';
import { Switch } from '@ijstech/switch';
import { Upload } from '@ijstech/upload';
import { IModule} from '@ijstech/types';
import { Application } from '@ijstech/application';
import { Datepicker } from '@ijstech/datepicker';
function ProxySetter(obj: any, prop: string, value: any){
    obj['__target'][prop] = value;
    return true
}
function ProxyGetter(target: any, prop: any): any{
    if (typeof(target.__target[prop]) == 'function') {
        return target.__target[prop].bind(target.__target);
    }
    if (prop == '__target')
        return target['__target']
    else if (prop == '__path')
        return target['__path'];    
    else if (prop == '$renderElms' && target.__target)
        return target.__target['$renderElms'];
    // else if ((!target.__target['$observableProps'] || !target.__target['$observableProps'][prop]) && (!target['__path'] || target['__path'].length == 0)){
    //     return target.__target[prop];
    // }
    let path;
    if (target.__root)
        path = []
    else
        path = target.__path || [];

    path.push(prop);

    return ProxyObject({
        __target: target.__target,
        __path: path
    })
}
function ProxyObject(target: any, root?: boolean){
    if (target.__root)
        root = true;
    let path;
    if (root)
        path = []
    else
        path = target.__path || [];
    if (target.__target)
        target = target.__target;
    return new Proxy({__root: root,__target: target, __path: path}, {
        get: ProxyGetter,
        set: ProxySetter
    })
}
function getObservable(target: any, paths: string[]): any{
    if (isObservable(target))
        return target;
    if (target === undefined || target === null) return
    let path = paths.shift();
    if (paths.length == 0){
        if (typeof(target['observables']) == 'function')
            return target['observables'](path)
        else if (path && typeof(target) == 'object')
            return target[path]
    }
    else
        return getObservable(target[(<any>path)], paths);
}
export interface ModuleElement extends ContainerElement{
    caption?: string;
}
declare global {
    var Render: any;
    namespace JSX {
        interface IntrinsicElements {
            ['i-module']: ModuleElement
        }
    }
}

function bindObservable(elm: any, prop: string): any {
    const fn = function (changes: any) {
        const changeData = changes[0];
        const type = changeData.type;

        if (Array.isArray(changeData.object)) {
            if (type === 'shuffle' || type === 'reverse' || changeData.path?.length > 1) {
                elm[prop] = changeData.object;
            } else if (changeData.path?.length) {
                let newArray = [...elm[prop]];
                if (type === 'delete') {
                    newArray[changeData.path[0]] = undefined;
                    newArray = newArray.filter((item) => item !== undefined);
                } else if (type === 'insert' || type === 'update') {
                    newArray[changeData.path[0]] = changeData.value;
                }
                elm[prop] = newArray;
            }
        } else {
            if ('value' in changeData) {
                elm[prop] = changeData.value;
            } else {
                console.warn('Unhandled change type or missing value:', changeData);
            }
        }
    };

    return fn;
}

export interface IOpenModalOptions{
    title?: string;
    showBackdrop?: boolean;
    closeIcon?: IconElement;
    width?: number|string;
    zIndex?: number;
}

@customElements('i-module')
export class Module extends Container implements IModule{
    private $renderElms: any[] = [];
    private $render: any;
    private modulesUrlRegex: string[];
    private static _modalMap: Record<string, Modal> = {};
    // private static _modules: Record<string, Module> = {};
    public currentModuleDir: string;
    private _i18n: I18n;
    public isModule: boolean = true;
    // static updateLocale(): void {
    //     for (let key in Module._modules){
    //         Module._modules[key].updateLocale();
    //     };
    // };
    static async create(options?: ModuleElement, parent?: Container, defaults?: ModuleElement): Promise<Module>{
        let self = new this(parent, options, defaults);
        await self.ready();
        return self;
    };

    constructor(parent?: Container, options?: any, defaults?: any) {
        super(parent, options, defaults);
        let proxy = ProxyObject(this, true);
        this.$render = this._render.bind(proxy);
    }
    get i18n(): I18n {
        if (!this._i18n)
            this._i18n = new I18n();
        return this._i18n;
    };
    updateLocale(): void {
        if (this._i18n)
            super.updateLocale(this._i18n);
    };
    init(){
        super.init();
        this.$renderElms = [];
        let proxy = ProxyObject(this, true);
        let render = this.render.bind(proxy);
        let r = window['Render'];
        window['Render'] = this._render.bind(proxy);
        render();
        for (let i = 0; i < this.$renderElms.length; i++){
            let elm = this.$renderElms[i].elm;
            let options = this.$renderElms[i].options;
            for (let prop in options){
                let value = options[prop];  
                if (value?.__target){
                    let target = value.__target;
                    let paths = value.__path;
                    let targetValue = this.getAttributeValue(target, paths)                    
                    let observable = getObservable(target, paths);
                    if (isObservable(observable)){
                        if (paths.length > 0) {
                            Observe(observable, bindObservable(elm, prop), {path: paths.join('.')})
                            const onObserverChanged = elm['onObserverChanged'];
                            elm.onObserverChanged = (target: any, event: Event) => {
                                const observables = proxy?.__target?.['$observables'];
                                for (const prop in observables){
                                    const observable = observables[prop];
                                    let target = observable;
                                    for (let i = 0; i < paths.length - 1; i++) {
                                        target = target?.[paths[i]];
                                    }
                                    if (target) {
                                        const lastProp = paths[paths.length - 1];
                                        target[lastProp] = this._getValueByControl(elm);
                                    }
                                }
                                if (typeof onObserverChanged === 'function') {
                                    onObserverChanged(target, event);
                                }
                            }
                        }
                        else{
                            Observe(observable, bindObservable(elm, prop));
                            const observables = proxy?.__target?.['$observables'];
                            let updatedProp = '';
                            for (const p in observables) {
                                if (observables[p] === observable) {
                                    updatedProp = p;
                                    break;
                                }
                            }
                            const onObserverChanged = elm['onObserverChanged'];
                            elm.onObserverChanged = (target: any, event: Event) => {
                                if (updatedProp && updatedProp !== prop) {
                                    const newValue = this._getValueByControl(elm);
                                    ProxySetter(proxy, updatedProp, newValue);
                                }
                                if (typeof onObserverChanged === 'function') {
                                    onObserverChanged(target, event);
                                }
                            }
                        }
                    }
                    elm[prop] = targetValue;
                }
            }
        }
        this.$renderElms = [];
        window['Render'] = r;
    }
    _getValueByControl(elm: Control) {
        if (elm instanceof RadioGroup) {
            return elm.selectedValue;
        }
        else if (elm instanceof Switch || elm instanceof Checkbox || (elm instanceof Input && elm.inputType === 'checkbox')) {
            return (elm as Checkbox).checked;
        }
        else if (elm instanceof Upload) {
            return elm.fileList;
        }
        else if (elm instanceof ComboBox || (elm instanceof Input && elm.inputType === 'combobox')) {
            return (elm as ComboBox).value;
        } else if (elm instanceof Datepicker) {
            return (elm as Datepicker).valueFormat;
        }
        else {
            return (elm as any).value;
        }
    }
    flattenArray(arr: any[]) {
        return arr.reduce((result, item) => {
            if (Array.isArray(item)) {
                const temp = this.flattenArray(item);
                result = result.concat(temp);
            } else {
                result.push(item);
            }
            return result;
        }, []);
    };
    _render(...params: any[]) {
        let tag = params[0]
        let options = params[1]
        let elm = this.createElement(tag);
        if (options){
            this.$renderElms.push({
                elm: elm,
                options: options
            });
            (<any>elm).attrs = options;
            for (let v in options){
                if (v == 'id'){
                    (<any>this)[options[v]] = elm;
                    elm.id = options[v]
                }
                else if (typeof(options[v]) == 'function')
                    (<any>elm)[v] = options[v].bind(this)
                else if (typeof(options[v]) != 'object')
                    elm.setAttribute(v, options[v])
            }
        }
        const newParams = this.flattenArray(params);
        for (let i = 2; i < newParams.length; i++){
            if (typeof newParams[i] == 'string') {
                elm.textContent = newParams[i];
            }
            else 
                elm.appendChild(newParams[i])
        }
        this.appendChild(elm);
        return elm;
    }
    render(){
    };
    onLoad() {
    };
    onShow(options?: any) {
    };
    onHide() {
    };
    connectedCallback(): void {
        Application.registerModule(this.uuid, this);// _modules[this.uuid] = this;
        super.connectedCallback();
    };
    disconnectedCallback() {
        delete Module._modalMap[this.uuid];
        // delete Module._modules[this.uuid];
        Application.unregisterModule(this.uuid);
        super.disconnectedCallback();
    };
    openModal(options?: ModalElement) {
        let modal = Module._modalMap[this.uuid];
        if (modal){
            modal.title = options?.title || '';
            modal.zIndex = options?.zIndex || 10;
            if (options?.linkTo) modal.linkTo = options.linkTo;
            modal.showBackdrop = options?.showBackdrop ?? true;
            modal.visible = true;
            document.body.appendChild(modal);
            Module._modalMap[this.uuid] = modal;
            return modal;
        }
        const showBackdrop = options?.showBackdrop ?? true;
        const modalOptions =  {
            border: { radius: 10 },
            closeIcon: showBackdrop ? { name: 'times' } : null,
            ...options
        }
        modal = new Modal(undefined, {
            ...modalOptions,
        });
        document.body.appendChild(modal);
        Module._modalMap[this.uuid] = modal;
        modal.body = this;
        modal.zIndex = options?.zIndex || 10;
        if (options?.linkTo) modal.linkTo = options.linkTo;
        modal.showBackdrop = options?.showBackdrop ?? true;
        modal.visible = true;
        return modal;
    }
    closeModal() {
        let modal = Module._modalMap[this.uuid];
        if (modal) {
            modal.visible = false;
        }
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }
}