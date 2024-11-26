import {Control, Container, customElements, ControlElement, I18n} from '@ijstech/base';
import {Icon, IconElement} from '@ijstech/icon';
import { Theme } from '@ijstech/style';
import './style/button.css';
import { GroupType } from '@ijstech/types';
import { application } from '@ijstech/application';

export interface ButtonElement extends ControlElement{
    caption?: string;    
    icon?: IconElement;
    rightIcon?: IconElement;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-button']: ButtonElement
        }
    }
}
const defaultIcon = {
    width: 16,
    height: 16,
    fill: Theme.ThemeVars.text.primary
};

@customElements('i-button', {
    icon: 'closed-captioning',
    className: 'Button',
    props: {
        caption: {
            type: 'string',
            default: ''
        },
        icon: {
            type: 'object',
            default: {}
        },
        rightIcon: {
            type: 'object',
            default: {}
        },
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            caption: {
                type: 'string',
                title: 'Caption'
            },
            icon: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    },
                    fill: {
                        type: 'string',
                        format: 'color'
                    },
                    width: {
                        type: 'number'
                    },
                    height: {
                        type: 'number'
                    },
                    image: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string'
                            }
                        }
                    }
                }
            },
            rightIcon: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    },
                    fill: {
                        type: 'string',
                        format: 'color'
                    },
                    width: {
                        type: 'number'
                    },
                    height: {
                        type: 'number'
                    },
                    image: {
                        type: 'object',
                        properties: {
                            url: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        }
    },
    group: GroupType.BASIC
})
export class Button extends Control {
    private captionElm: HTMLElement;
    private _icon: Icon;
    private _rightIcon: Icon;
    private _caption: string;

    static async create(options?: ButtonElement, parent?: Container){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }
    constructor(parent?: Control, options?: ButtonElement) {        
        super(parent, options);        
    }
    updateLocale(i18n: I18n): void {
        super.updateLocale(i18n);
        if (this.captionElm && this._caption?.startsWith('$'))
            this.captionElm.innerHTML = i18n.get(this._caption) || '';
    }

    get caption(): string{
        const value = this._caption || '';
        if (value?.startsWith('$')) {
            const translated =
                this.parentModule?.i18n?.get(this._caption) ||
                application.i18n?.get(this._caption) ||
                '';
            return translated;
        }
        return value;
    }
    set caption(value: string){
        if (typeof value !== 'string') value = String(value || '');
        this._caption = value;
        if (!this.captionElm) return;
        this.captionElm.innerHTML = this.caption;
        this.captionElm.style.display = value ? "" : "none";
    }
    get icon(): Icon{
        if (!this._icon) {
            let iconAttr = this.getAttribute('icon', true);
            iconAttr = { ...defaultIcon, ...iconAttr };
            this._icon = new Icon(this, iconAttr);
            this.prependIcon(this._icon);
        }
        return this._icon;
    }
    set icon(value: Icon){
        if (this._icon && this.contains(this._icon))
            this.removeChild(this._icon);
        this._icon = value;
        this.prependIcon(this._icon);
    }
    get rightIcon(): Icon{
        if (!this._rightIcon) {
            let rightIconAttr = this.getAttribute('rightIcon', true);
            this._rightIcon = new Icon(this, {
                ...defaultIcon,
                name: 'spinner',
                ...rightIconAttr
            });
            this.appendIcon(this._rightIcon);
        }
        return this._rightIcon;
    }
    set rightIcon(value: Icon) {
        if (this._rightIcon && this.contains(this._rightIcon))
            this.removeChild(this._rightIcon);
        this._rightIcon = value;
        this.appendIcon(this._rightIcon);
    }
    get enabled(): boolean {
        return super.enabled;
    }
    set enabled(value: boolean) {
        super.enabled = value;
        if (!value && this._background) {
            let bg = '';
            this._background?.image && (bg += `url(${this._background?.image})`);
            this._background?.color && (bg += `${this._background?.color}`);
            this.style.background = bg;
        }
    }

    private get isSpinning(): boolean {
        return (this._icon && this._icon.spin && this._icon.visible) ||
        (this._rightIcon && this._rightIcon.spin && this._rightIcon.visible);
    }
    private prependIcon(icon: Icon) {
        if (!icon) return;
        this.appendChild(icon);
        this.captionElm &&
            this.insertBefore(icon, this.captionElm);
    }
    private appendIcon(icon: Icon) {
        if (!icon) return;
        this.appendChild(icon);
        this.captionElm &&
            this.insertBefore(this.captionElm, icon);
    }
    private updateButton() {
        if (this.isSpinning)
            this.classList.add('is-spinning')
        else
            this.classList.remove('is-spinning')

        if (!this.enabled && this._background) {
            let bg = '';
            this._background?.image && (bg += `url(${this._background?.image})`);
            this._background?.color && (bg += `${this._background?.color}`);
            this.style.background = bg;
        }
        if (this._caption)
            this.classList.add('has-caption');
        else
            this.classList.remove('has-caption');
    }
   
    _handleClick(event: MouseEvent): boolean{
        if (this.isSpinning || !this.enabled || this._designMode) return false;
        return super._handleClick(event);
    }
    refresh(): void {
        super.refresh();
        this.updateButton();
    }
    protected init() {
        if (!this.captionElm){
            super.init();
            this.onClick = this.getAttribute('onClick', true) || this.onClick;
            this.captionElm = this.createElement('span', this);
            let caption = this.getAttribute('caption', true, '');
            this.caption = caption;

            // if (this.height)
            //     defaultIcon.width = defaultIcon.height = Math.floor(+this.height / 2)

            let iconAttr = this.getAttribute('icon', true);
            if (iconAttr?.name || iconAttr?.image?.url) {
                iconAttr = { ...defaultIcon, ...iconAttr };
                const icon = new Icon(this, iconAttr);
                this.icon = icon;
            }

            let rightIconAttr = this.getAttribute('rightIcon', true);
            if (rightIconAttr?.name || rightIconAttr?.image?.url) {
                rightIconAttr = { ...defaultIcon, name: 'spinner', ...rightIconAttr };
                const icon = new Icon(this, rightIconAttr);
                this.rightIcon = icon;
            }
        }
    }
}