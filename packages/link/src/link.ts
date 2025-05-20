import {Control, customElements, ControlElement, IFont, notifyMouseEventCallback} from '@ijstech/base';
import './style/link.css';

type TagertType = '_self' | '_blank' | '_parent' | '_top';

export interface LinkElement extends ControlElement{
    href?: string;
    target?: TagertType;
    onOpenLink?: notifyMouseEventCallback;
}

@customElements('i-link')
export class Link extends Control {    
    private _href: string;
    private _target: TagertType;
    private _linkElm: HTMLAnchorElement;
    public onOpenLink: notifyMouseEventCallback;

    constructor(parent?: Control, options?: any) {        
        super(parent, options, {
            target: '_blank'
        });
    }

    get href(): string{
        return this._href;
    }
    set href(value: string){
        this._href = typeof value === 'string' ? value : '';
        if (this._linkElm)
            this._linkElm.href = this._href;
    }
    
    get target(): TagertType{
        return this._target;
    }
    set target(value: TagertType){
        this._target = value;
        if (this._linkElm)
            this._linkElm.target = value;
    }

    append(children: Control | HTMLElement) {
        if (!this._linkElm) {
            this._linkElm = <HTMLAnchorElement>this.createElement('a', this);
        }
        this._linkElm.appendChild(children);
    }
    _handleClick(event: MouseEvent, stopPropagation?: boolean): boolean {
        event.preventDefault();
        if (this._designMode) return false;
        if (this.onOpenLink) {
            this.onOpenLink(this, event);
        } else {
            window.open(this._linkElm.href, this._linkElm.target);
        }
        return super._handleClick(event);
    }
    protected addChildControl(control: Control) {
      if (this._linkElm)
        this._linkElm.appendChild(control)
    }
    protected removeChildControl(control: Control) {
      if (this._linkElm && this._linkElm.contains(control))
        this._linkElm.removeChild(control)
    }
    protected init() {
        if (!this.initialized) {
            super.init();
            if (!this._linkElm)
                this._linkElm = <HTMLAnchorElement>this.createElement('a', this);
            this.classList.add('i-link');

            const hrefAttr = this.getAttribute('href', true);
            hrefAttr && (this.href = hrefAttr);

            const targetAttr = this.getAttribute('target', true);
            targetAttr && (this.target = targetAttr);

            this.onOpenLink = this.getAttribute('onOpenLink', true) || this.onOpenLink;
        }
    }

    static async create(options?: LinkElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }    
}