import {initObservables} from './observable';
import {getCustomElementProperties} from './utils';
import {IdUtils} from './utils';
import {ICustomProperties, IComponent, ComponentProperty} from './types';

export class Component extends HTMLElement implements IComponent{    
    protected connected: boolean;
    protected _parent: Component|undefined;
    protected _height: number|string;
    protected _top: number|string;
    protected _width: number|string;
    protected _left: number|string;
    protected _bottom: number|string;

    protected options: any;
    protected defaults: any;
    protected deferReadyCallback: boolean = false;
    protected _readyCallback: any[] = [];
    public initializing: boolean = false;   
    public initialized: boolean = false;    
    protected attrs: any = {};
    protected _designProps: {[prop: string]: string|number|boolean|object};
    private _propInfo: ICustomProperties;
    protected _uuid: string;
    constructor(parent?: Component, options?: any, defaults?: any) {
        super();
        // this._parent = parent;
        this._uuid = IdUtils.generateUUID();
        this.options = options || {};
        this.defaults = defaults || {};
        initObservables(this);
    }
    connectedCallback(){
        if (this.connected)
            return;
        this.connected = true;
        if (!this.initializing && !this.initialized) {
            this.init();
        }
    }
    disconnectedCallback(){
        this.connected = false;
    }
    protected parseDesignPropValue(value: string): any {
        if (value.startsWith('{') && value.endsWith('}')) {
            value = value.substring(1, value.length - 1);
            if (value.startsWith('{') && value.endsWith('}'))
                return JSON.parse(value)
        }
        else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
        }
        else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.substring(1, value.length - 1);
        }
        return value;
    };
    _getDesignPropValue(prop: string): string|number|boolean|object|any[]{
        return this._designProps && this._designProps[prop];
    };
    _setDesignPropValue(prop: string, value: string|number|boolean|object, breakpointProp?: any){
        this._designProps = this._designProps || {};
        this._designProps[prop] = value;
        if (ComponentProperty.props[prop] && prop !== 'mediaQueries') {
            (this as any)[prop] = breakpointProp ?? value;
        }
        else {
            let propInfo = this._propInfo || getCustomElementProperties(this.tagName);
            this._propInfo = propInfo;
            if (propInfo && propInfo.props[prop] && prop !== 'mediaQueries') {
                if (!['link', 'icon', 'image', 'rightIcon', 'closeIcon'].includes(prop)) {
                    (this as any)[prop] = breakpointProp ?? value;
                }
            };
        };
    };
    _setDesignProps(props: {[prop: string]: string}, breakpoint: {[prop: string]: string} = {}){
        if (breakpoint) {
            for (let prop in breakpoint) {
                if (!Object.hasOwnProperty.call(props, prop))
                    props[prop] = this._designProps?.[prop] as any;
            }
        }
        for (let prop in props) {
            const hasQuery = Object.hasOwnProperty.call(breakpoint, prop);
            this._setDesignPropValue(prop, props[prop], hasQuery ? breakpoint[prop] : undefined);
        }
    };
    _getDesignProps(): {[prop: string]: string|number|boolean|object}{
        return this._designProps;
    };
    createElement(tagName: string, parentElm?: HTMLElement): HTMLElement{
        let result = document.createElement(tagName);
        if (parentElm)
            parentElm.appendChild(result)
        // else
        //     this.appendChild(result);
        return result;
    };
    getAttributeValue(target: any, paths: string[], idx?: number): any{
        idx = idx || 0;
        let path = <string>paths[idx];
        let value = target[path];
        idx ++;
        if (paths.length > idx)
            try {
                return this.getAttributeValue(value, paths, idx);
            } catch (error) {
                return value;
            }
        else
            return value;
    };
    getAttribute(name: string, removeAfter?: boolean, defaultValue?: any): any{            
        if (this.options[name] != null)
            return this.options[name]
        else if (this.attrs[name] != null && this.attrs[name] != undefined) {
            if (removeAfter)
                this.removeAttribute(name)
            if (this.attrs[name].__target)
                return this.getAttributeValue(this.attrs[name].__target, this.attrs[name].__path);
            else
                return this.attrs[name]
        }
        else{
            let value = <any>super.getAttribute(name);            
            if (value && value.__target)
                return
            else if (value != null){
                if (value == 'false' || value == 'true')
                    value = JSON.parse(value)                
                this.options[name] = value;
                if (removeAfter)
                    this.removeAttribute(name)
                return value
            }
            else if (this.defaults[name] != null)
                return this.defaults[name]
        };
        return defaultValue;
    };
    getPositionAttribute(name: string, removeAfter?: boolean, defaultValue?: any): number{            
        let result = parseFloat(this.getAttribute(name, removeAfter, defaultValue));
        if (removeAfter && result)
            (<any>this.style)[name] = result + 'px';
        return result;
    };
    getStyleAttribute(name: string, removeAfter?: boolean, defaultValue?: any): string{            
        let result = this.getAttribute(name, removeAfter, defaultValue);
        if (removeAfter && result)
            (<any>this.style)[name] = result;
        return result;
    };
    get uuid(): string{
        return this._uuid;
    }
    get id(): string{
        return this.getAttribute('id')
    };
    set id(value: string){
        this.options.id = value;
        this.setAttribute('id', value);
    }
    async ready(): Promise<void>{
        if (this.initialized)
            return;
        return new Promise((resolve)=>{
            if (this.initialized)
                return resolve();
            this._readyCallback.push(resolve);
            if (!this.initializing && !this.initialized) {
                this.init();
            }
        });
    };
    protected executeReadyCallback() {
        if (this.initialized) return;
        this.initialized = true;
        this.initializing = false;
        let callbacks = this._readyCallback;
        for (let i = 0; i < callbacks.length; i ++){
           callbacks[i]();
        };
        this._readyCallback = [];
    };
    protected init(){
        if (!this.initializing && !this.initialized) {
            this.initializing = true;
            if (this.options['class']) {
                this.setAttribute('class', this.options['class']);
            }
            if (!this.deferReadyCallback) {
                this.executeReadyCallback();
            };
        };
    };
}