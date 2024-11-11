import {Control, customElements, ControlElement, observable, notifyEventCallback, setAttributeToProperty, IFont, FontStyle, TextTransform} from '@ijstech/base';
import { Theme } from '@ijstech/style';
import {captionStyle} from './radio.css';
import { GroupType } from '@ijstech/types';

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

@customElements('i-radio')
export class Radio extends Control {
    @observable('value')
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
    get caption(): string {
        return this._caption;
    }
    set caption(value: string) {
        this._caption = value;
        if (!value)
            this.captionSpanElm.style.display = 'none';
        else
            this.captionSpanElm.style.display = '';
            this.captionSpanElm
                && (this.captionSpanElm.textContent = value);
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
        if (!this.initialized) {
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
        this.clearInnerHTML();
        this._group= [];
        this.name = new Date().getTime().toString();
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
        const elm = new Radio(this, options);
        this.appendItem(elm);
        // this.selectedValue = elm.value;
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
            // this.classList.add('i-radio-group');
            this.setAttribute('role', 'radiogroup');

            if (this.options?.onChanged)
                this.onChanged = this.options.onChanged;

            setAttributeToProperty(this, 'radioItems');
            setAttributeToProperty(this, 'selectedValue');
            setAttributeToProperty(this, 'layout', 'vertical');

            super.init();
        }
    }

    static async create(options?: RadioGroupElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }      
}
