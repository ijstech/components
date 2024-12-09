import {Control, customElements, I18n} from '@ijstech/base';
import {Link, LinkElement} from '@ijstech/link';
import {Text, TextElement} from '@ijstech/text';
import './style/label.css';
import { GroupType } from '@ijstech/types';
import { textDataSchema, textPropsConfig } from '@ijstech/text';
import { application } from '@ijstech/application';

type TextDecorationType = 'none'|'underline'|'overline'|'line-through';

export interface LabelElement extends TextElement {
    caption?: string;
    link?: LinkElement;
    textDecoration?: TextDecorationType;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-label']: LabelElement
        }
    }
}

const DEFAULT_VALUES = {
    target: '_blank',
    textDecoration: 'none'
}

@customElements('i-label', {
    icon: 'heading',
    group: GroupType.BASIC,
    className: 'Label',
    props: {
        caption: {
            type: 'string',
            default: ''
        },
        textDecoration: {
            type: 'string',
            default: DEFAULT_VALUES.textDecoration
        },
        ...(textPropsConfig as any),
        link: {
            type: 'object',
            default: {
                target: DEFAULT_VALUES.target
            }
        }
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            caption: {
                type: 'string',
                required: true
            },
            textDecoration: {
                type: 'string',
                enum: ['none', 'underline', 'overline', 'line-through'],
                default: DEFAULT_VALUES.textDecoration
            },
            ...(textDataSchema as any),
            link: {
                type: 'object',
                properties: {
                    href: {
                        type: 'string'
                    },
                    target: {
                        type: 'string',
                        enum: ['_blank', '_self', '_parent', '_top'],
                        default: DEFAULT_VALUES.target
                    }
                }
            }
        }
    }
})
export class Label extends Text {
    private captionSpan: HTMLElement;
    private _link: Link;
    private _caption: string;

    constructor(parent?: Control, options?: any) {        
        super(parent, options);
    }
    updateLocale(i18n: I18n): void {
        super.updateLocale(i18n);
        if (this.captionSpan && this._caption?.startsWith('$'))
            this.captionSpan.textContent = i18n.get(this._caption) || '';
    }
    get caption(): string {
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
    set caption(value: string) {
        if (typeof value !== 'string') value = String(value || '');
        this._caption = value;
        if (!this.captionSpan) return;
        this.captionSpan.textContent = this.caption;
    }

    get link(): Link {
        if (!this._link) {
            this._link = new Link(this, {
                href: '#',
                target: '_blank',
                font: this.font,
                designMode: this._designMode
            });
            this._link.append(this.captionSpan);
            this.appendChild(this._link);
        }
        return this._link;
    }
    set link(value: Link) {
        if (this._link) {
            this._link.prepend(this.captionSpan);
            this._link.remove();
        }
        this._link = value;
        if (this._link) {
            this._link.append(this.captionSpan);
            this.appendChild(this._link);
        } else {
            this.appendChild(this.captionSpan);
        }
    }

    set height(value: number){
        this.setPosition('height', value);
        if (this.captionSpan)
            this.captionSpan.style.height = value + 'px';
    }

    set width(value: number){
        this.setPosition('width', value);
        if (this.captionSpan)
            this.captionSpan.style.width = value + 'px';
    }

    get textDecoration() {
        return this.style.textDecoration as TextDecorationType;
    }
    set textDecoration(value: TextDecorationType) {
        this.style.textDecoration = value;
    }

    protected init() {       
        if (!this.captionSpan){
            let childNodes = [];
            for (let i = 0; i < this.childNodes.length; i++) {
                childNodes.push(this.childNodes[i]);
            }
            this.captionSpan = this.createElement('span', this);
            this.caption = this.getAttribute('caption', true) || '';
            if (childNodes && childNodes.length) {
                for (let i = 0; i < childNodes.length; i++) {
                    this.captionSpan.appendChild(childNodes[i]);
                }
            }
            const linkAttr = this.getAttribute('link', true);
            const designMode = this.getAttribute('designMode', true);
            if (linkAttr?.href) {
                const link = new Link(this, {
                    ...linkAttr,
                    font: this.font,
                    designMode
                });
                this.link = link;
            }
            const textDecoration = this.getAttribute('textDecoration', true);
            if (textDecoration) this.textDecoration = textDecoration;

            super.init();
        }
    }

    static async create(options?: LabelElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }     
}