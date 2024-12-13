import {Control, customElements, ControlElement} from '@ijstech/base';
import { GroupType } from '@ijstech/types';
import "./style/iframe.css";

export interface IframeElement extends ControlElement{
    url?: string;
    allowFullscreen?: boolean;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-iframe']: IframeElement
        }
    }
}

@customElements('i-iframe', {
    icon: 'border-all',
    group: GroupType.BASIC,
    className: 'Iframe',
    props: {
        url: {type: 'string', default: ''},
        allowFullscreen: {type: 'boolean', default: false}
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            url: {
                type: 'string'
            },
            allowFullscreen: {
                type: 'boolean',
                default: false
            }
        }
    }
})
export class Iframe extends Control {
    private _url: string;
    private allowFullscreen: boolean;

    private iframeElm: HTMLIFrameElement|undefined;
    private overlayElm: HTMLElement;

    constructor(parent?: Control, options?: any) {        
        super(parent, options, {
            // width: 800,
            // height: 600,
        });
        window.addEventListener('mousedown', ()=>{
            if (this.iframeElm)
                this.iframeElm.style.pointerEvents = 'none'
        })
        window.addEventListener('mouseup', ()=>{
            if (this.iframeElm)
                this.iframeElm.style.pointerEvents = 'auto'
        })
    };
    reload(): Promise<void>{
        let iframe = this.iframeElm;
        return new Promise((resolve)=>{
            if (iframe) {
                iframe.src = this.url;
                iframe.onload = function(){
                    resolve();
                    iframe && (iframe.onload = null);
                };
            }
        });
    };
    clear() {
        if (this.iframeElm) {
            this.unload();
            this.iframeElm.onload = null;
            this.iframeElm.onerror = null;
            this.iframeElm.parentNode?.removeChild(this.iframeElm);
            this.iframeElm.remove();
            this.iframeElm = undefined;
        }
    }
    unload() {
        if (this.iframeElm) {
            this.iframeElm.src = '';
            if (this.iframeElm && this.iframeElm.contentWindow){
                // this.iframeElm.contentWindow.document.write('');
                this.iframeElm.contentWindow.close();
            }
        }
    }
    postMessage(msg: string){
        if (this.iframeElm && this.iframeElm.contentWindow){
            this.iframeElm.contentWindow.postMessage(msg, '*');
        };
    };
    get url(): string{
        return this._url;
    };
    set url(value: string){
        this._url = value;
        if (!this.iframeElm)
            this.iframeElm = <HTMLIFrameElement>this.createElement('iframe', this);
        if (this.allowFullscreen) this.iframeElm.allowFullscreen = true;
        if (value !== undefined) {
            this.iframeElm.src = value || '';
            this.iframeElm.width = '100%';
            this.iframeElm.height = '100%';
            this.iframeElm.setAttribute('frameBorder', '0');
        }
    }
    set designMode(value: boolean) {
        this._designMode = value;
        if (this.overlayElm) {
          this.overlayElm.style.height = value ? '100%' : '0px';
          this.overlayElm.style.display = value ? 'block' : 'none';
        }
    }
    protected init() {
        super.init();
        this.overlayElm = this.createElement("div", this);
        this.overlayElm.classList.add('overlay');
        this.overlayElm.style.height = this._designMode ? '100%' : '0px';
        this.overlayElm.style.display = this._designMode ? 'block' : 'none';
        this.allowFullscreen = this.getAttribute('allowFullscreen', true);
        const url = this.getAttribute('url', true);
        if (url !== undefined) this.url = url;
    };    
    static async create(options?: IframeElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    };
}