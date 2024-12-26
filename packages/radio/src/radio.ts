import {Control, customElements, ControlElement, observable, notifyEventCallback, setAttributeToProperty, IFont, FontStyle, TextTransform, I18n} from '@ijstech/base';
import { Theme } from '@ijstech/style';
import {captionStyle} from './radio.css';
import { GroupType } from '@ijstech/types';
import { application } from '@ijstech/application';

export interface RadioElement extends ControlElement{
    caption?: string;
    captionWidth?: number | string;
    value?: string;
}

export type RadioGroupLayout = 'vertical' | 'horizontal';
export interface RadioGroupElement extends ControlElement{
    layout?: RadioGroupLayout;
    selectedValue?: string;
    radioItems?: RadioElement[];
    onChanged?: notifyEventCallback;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-radio-group']: RadioGroupElement,
            ['i-radio']: RadioElement
        }
    }
}

@customElements('i-radio', {
    icon: 'check-circle',
    className: 'Radio',
    group: GroupType.FIELDS,
    props: {
        value: {
            type: 'string',
            default: ''
        },
    },
    events: {},
    dataSchema: {
        type: 'object',
        properties: {
            value: {
                type: 'string'
            }
        }
    }
})
export class Radio extends Control {
    private _value: string;
    private _caption: string;
    private _captionWidth: number | string;

    private labelElm: HTMLLabelElement;
    private inputElm: HTMLInputElement;
    private captionSpanElm: HTMLElement;

    constructor(parent?: Control, options?: any) {
        super(parent, options);
    }
    get value(): string {
        return this._value
    }
    set value(value: string) {
        this._value = value || '';
        this.inputElm.value = value;
    }
    updateLocale(i18n: I18n): void {
        super.updateLocale(i18n);
        if (this.captionSpanElm && this._caption?.startsWith('$'))
            this.captionSpanElm.textContent = i18n.get(this._caption) || '';
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
    set caption(value: string) {
        if (typeof value !== 'string') value = String(value);
        this._caption = value || '';
        if (!this.captionSpanElm) return;
        this.captionSpanElm.textContent = this.caption;
    }
    get captionWidth(): number | string {
      return this._captionWidth;
    }
    set captionWidth(value: number | string) {
      this._captionWidth = value;
      this.setElementPosition(this.captionSpanElm, 'width', value);
    }

    set font(value: IFont) {
        if (!this.captionSpanElm) return;
        this.captionSpanElm.style.color = value.color || '';
        this.captionSpanElm.style.fontSize = value.size || '';
        this.captionSpanElm.style.fontFamily = value.name || '';
        this.captionSpanElm.style.fontStyle = value.style || '';
        this.captionSpanElm.style.textTransform = value.transform || 'none';
        this.captionSpanElm.style.fontWeight = value.bold ? 'bold' : `${value.weight || ''}`;
        this.captionSpanElm.style.textShadow = value.shadow || 'none';
    }
    get font(): IFont{
        if (!this.captionSpanElm) return {};
        return {
            color: this.captionSpanElm.style.color,
            name: this.captionSpanElm.style.fontFamily,
            size: this.captionSpanElm.style.fontSize,
            bold: this.captionSpanElm.style.fontStyle.indexOf('bold') >= 0,
            style: this.captionSpanElm.style.fontStyle as FontStyle,
            transform: this.captionSpanElm.style.textTransform as TextTransform,
            weight: this.captionSpanElm.style.fontWeight,
            shadow: this.captionSpanElm.style.textShadow
        }
    }

    add(item: Control) {
        item.parent = this.labelElm as any;
        this.labelElm.appendChild(item);
        return item;
    }

    _handleClick(event: MouseEvent): boolean {
        if (this._designMode) {
            event.preventDefault();
            return false;
        }
        if (event.target !== this.inputElm) return true;
        const checked = this.inputElm.checked || false;
        if (checked)
            this.classList.add('is-checked')
        else
            this.classList.remove('is-checked');
        return super._handleClick(event);
    }
   
    protected init() {
        if (!this.labelElm) {
            const items = [];
            if (this.children.length > 0) {
                for (const child of this.children) {
                    if (child instanceof Control) {
                        items.push(child);
                    }
                }
            }
            super.init();
            this.classList.add(captionStyle);

            this.labelElm = <HTMLLabelElement>this.createElement('label', this);
            this.labelElm.classList.add('radio-wrapper');

            this.inputElm = <HTMLInputElement>this.createElement('input', this.labelElm);
            this.inputElm.type = 'radio';

            const disabled = this.getAttribute('enabled') === false;
            this.inputElm.disabled = disabled;
            this.value = this.getAttribute('value');

            this.captionSpanElm = this.createElement('span', this.labelElm);
            this.captionSpanElm.classList.add('i-radio_label');

            this.caption = this.getAttribute('caption', true, '');
            this.captionWidth = this.getAttribute('captionWidth', true);
            const font = this.getAttribute('font', true)
            if (font) this.font = font;
            else this.labelElm.style.color = Theme.ThemeVars.text.primary;

            if (items.length) {
                for (const child of items) {
                   this.labelElm.appendChild(child);
                }
            }
        }
    }

    static async create(options?: RadioElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }    
}

@customElements("i-radio-group", {
    icon: 'check-circle',
    className: 'RadioGroup',
    group: GroupType.FIELDS,
    props: {
        layout: {
            type: 'string',
            default: 'vertical',
        },
        selectedValue: {type: 'string', default: ''},
        radioItems: {type: 'array', default: []},
    },
    events: {
        onChanged: [
            {name: 'target', type: 'Control', isControl: true},
            {name: 'event', type: 'Event'}
        ]
    },
    dataSchema: {
        type: 'object',
        properties: {
            layout: {
                type: 'string',
                enum: ['vertical', 'horizontal'],
                default: 'vertical'
            },
            radioItems: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        caption: {type: 'string'},
                        value: {type: 'string'}
                    }
                }
            },
        }
    }
})
export class RadioGroup extends Control {
    @observable('selectedValue')
    private _selectedValue: string;
    private _radioItems: RadioElement[] = [];
    private _layout: RadioGroupLayout;
    private _group: Radio[] = [];
    private name: string;

    public onChanged: notifyEventCallback;

    constructor(parent?: Control, options?: any) {        
        super(parent, options);
    }

    get selectedValue(): string {
        return this._selectedValue;
    }

    set selectedValue(value: string) {
        this._selectedValue = value;
        this._group.forEach((item: Radio) => {
            const inputElm = item.querySelector('input');
            if (inputElm) inputElm.checked = item.value === value;
            if (item.value === value) {
                item.classList.add('is-checked');
            } else {
                item.classList.remove('is-checked');
            }
        })
    }

    get radioItems(): RadioElement[] {
        return this._radioItems;
    }
    set radioItems(value: RadioElement[]) {
        this._radioItems = value;
        this.renderUI();
    }

    get layout(): RadioGroupLayout {
        return this._layout || 'vertical';
    }
    set layout(value: RadioGroupLayout) {
        this._layout = value || 'vertical';
        if (value === 'horizontal') {
            this.style.flexDirection = 'row';
        }
        else {
            this.style.flexDirection = 'column';
        }
    }

    private renderUI() {
        const newGroup: Radio[] = [];
        for (const radio of this._group) {
            if (radio.tag === 'added') {
                newGroup.push(radio);
            } else {
                radio.remove();
            }
        }
        this._group= newGroup;
        if (!this.name) this.name = new Date().getTime().toString();
        this.radioItems.forEach((item: RadioElement) => {
            const elm = new Radio(this, item);
            this.appendItem(elm);
        })
    }

    private appendItem(elm: Radio) {
        this.appendChild(elm)
        elm.onClick = this._handleChange.bind(this);
        const inputElm = elm.getElementsByTagName('input')[0];
        inputElm && inputElm.setAttribute('name', this.name);
        if (this.selectedValue && elm.value === this.selectedValue)
            inputElm.checked = true
        this._group.push(elm);
    }

    private _handleChange(source: Control, event: Event) {
        if (this._designMode) {
            event.preventDefault();
            return true;
        }
        event.stopPropagation();
        const selectedValue = this.selectedValue;
        const value = (source as Radio).value;
        this._selectedValue = value;

        this._group.forEach(item => item.classList.remove('is-checked'));
        source.classList.add('is-checked');
        if (selectedValue !== value) {
            if (typeof this.onChanged === 'function')
                this.onChanged(this, event);
            if (typeof this.onObserverChanged === 'function')
                this.onObserverChanged(this, event);
        }
    }

    add(options: RadioElement): Radio {
        if (!this.name) {
            this.name = new Date().getTime().toString();
        }
        const elm = new Radio(this, options);
        elm.tag = 'added';
        options.tag = 'added';
        this.appendItem(elm);
        this._radioItems.push(options);
        return elm;
    }

    delete(index: number) {
        if (index >= 0) {
            const radio = this._group[index];
            if (radio) {
                this._group.splice(index, 1);
                this._radioItems.splice(index, 1);
                radio.remove();
            }
        }
    }

    protected init() {
        if (!this.initialized) {
            const radios: Radio[] = [];
            if (this.children.length > 0) {
                for (const child of this.children) {
                    if (child instanceof Radio) {
                        radios.push(child);
                    }
                }
            }
            this.setAttribute('role', 'radiogroup');

            if (this.options?.onChanged)
                this.onChanged = this.options.onChanged;
            setAttributeToProperty(this, 'selectedValue');
            setAttributeToProperty(this, 'layout', 'vertical');
            
            if (radios.length) {
                this.clearInnerHTML();
                this._group = [];
                this._radioItems = [];
                for (const radio of radios) {
                    this._radioItems.push({
                        caption: radio.caption,
                        value: radio.value
                    });
                    if (!this.name) this.name = new Date().getTime().toString();
                    this.appendItem(radio);
                }

            } else {
                setAttributeToProperty(this, 'radioItems');
            }
            super.init();
        }
    }

    static async create(options?: RadioGroupElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }      
}
