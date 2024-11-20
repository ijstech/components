import { Control, customElements, ControlElement, observable, notifyEventCallback, IBorder, Border, IBackground, Background, IFont } from '@ijstech/base';
import { Checkbox, CheckboxElement } from "@ijstech/checkbox";
import { ComboBox, ComboBoxElement } from "@ijstech/combo-box";
import { Datepicker, DatepickerElement } from '@ijstech/datepicker';
import { Range, RangeElement } from '@ijstech/range';
import { Radio, RadioElement } from '@ijstech/radio';
import { ColorPicker } from '@ijstech/color';
import { Icon } from '@ijstech/icon';
import './style/input.css'
import { Theme } from '@ijstech/style';
import { GroupType } from '@ijstech/types';

export type InputType = 'checkbox'|'radio'|'range'|'date'|'time'|'dateTime'|'password'|'combobox'|'number'|'textarea'|'text'|'color';
type InputControlType = Checkbox | ComboBox | Datepicker | Range | Radio | ColorPicker;
type actionCallback = (target: Input) => void;
type ResizeType = "none"|"auto"|"both"|"horizontal"|"vertical"|"initial"|"inherit"|"auto-grow";
type EnterKeyHintType = "enter"|"done"|"go"|"next"|"previous"|"search"|"send";

export interface InputElement extends ControlElement, CheckboxElement, ComboBoxElement, DatepickerElement, RangeElement, RadioElement{
    caption?: string;
    captionWidth?: number | string;
    inputType?: InputType;
    value?: any;
    placeholder?: string;
    readOnly?: boolean;
    showClearButton?: boolean;
    rows?: number;
    multiline?: boolean;
    resize?: ResizeType;
    maxLength?: number;
    enterKeyHint?: EnterKeyHintType;
    onChanged?: notifyEventCallback;
    onKeyDown?: notifyEventCallback;
    onKeyUp?: notifyEventCallback;
    onBlur?: actionCallback;
    onFocus?: actionCallback;
    onClearClick?: actionCallback;
    onClosed?: () => void;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {            
            ['i-input']: InputElement
        }
    }
}

const defaultRows = 4;
const CLEAR_BTN_WIDTH = 16;

const DEFAULT_VALUES = {
    captionWidth: 0,
    inputType: 'text',
    readOnly: false,
    showClearButton: false,
    multiline: false,
    resize: 'none'
}

@customElements('i-input', {
    icon: 'edit',
    group: GroupType.FIELDS,
    className: 'Input',
    props: {
        caption: {
            type: 'string',
            default: ''
        },
        captionWidth: {
            type: 'number',
            default: DEFAULT_VALUES.captionWidth
        },
        inputType: {
            type: 'string',
            default: DEFAULT_VALUES.inputType
        },
        value: {
            type: 'string',
            default: ''
        },
        placeholder: {
            type: 'string',
            default: ''
        },
        readOnly: {
            type: 'boolean',
            default: DEFAULT_VALUES.readOnly
        },
        showClearButton: {
            type: 'boolean',
            default: DEFAULT_VALUES.showClearButton
        },
        rows: {
            type: 'number'
        },
        multiline: {
            type: 'boolean',
            default: DEFAULT_VALUES.multiline
        },
        resize: {
            type: 'string',
            default: DEFAULT_VALUES.resize
        },
        maxLength: {
            type: 'number'
        },
        enterKeyHint: {
            type: 'string'
        }
    },
    events: {
        onChanged: [
            {name: 'target', type: 'Control', isControl: true},
            {name: 'event', type: 'Event'}
        ],
        onClosed: [],
        onBlur: [
            {name: 'target', type: 'Input', isControl: true}
        ],
        onFocus: [
            {name: 'target', type: 'Input', isControl: true}
        ],
        onClearClick: [
            {name: 'target', type: 'Input', isControl: true}
        ]
    },
    dataSchema: {
        type: 'object',
        properties: {
            caption: {
                type: 'string'
            },
            inputType: {
                type: 'string',
                enum: ['password', 'number', 'textarea', 'text'],
                default: DEFAULT_VALUES.inputType
            },
            value: {
                type: 'string'
            },
            placeholder: {
                type: 'string'
            },
            readOnly: {
                type: 'boolean',
                default: DEFAULT_VALUES.readOnly
            },
            showClearButton: {
                type: 'boolean',
                default: DEFAULT_VALUES.showClearButton
            },
            rows: {
                type: 'number'
            },
            multiline: {
                type: 'boolean',
                default: DEFAULT_VALUES.multiline
            },
            resize: {
                type: 'string',
                enum: ['none', 'auto', 'both', 'horizontal', 'vertical', 'initial', 'inherit', 'auto-grow'],
                default: DEFAULT_VALUES.resize
            }
        }
    }
})
export class Input extends Control {
    @observable('value')
    private _value: any;
    private _caption: string;
    private _captionWidth: number | string;
    private _inputType: InputType;
    private _placeholder: string;
    private _readOnly: boolean;
    private _showClearButton: boolean;
    private _clearBtnWidth: number;
    private _rows: number;
    private _multiline: boolean;
    private _resize: ResizeType;
    private _maxLength: number;
    private _enterKeyHint: EnterKeyHintType;
    
    private captionSpanElm: HTMLElement;
    private labelElm: HTMLLabelElement;
    private inputElm: HTMLInputElement|HTMLTextAreaElement;
    private _inputControl: InputControlType;
    private clearIconElm: HTMLElement;
    private _onClosed: () => void;

    public onKeyDown: notifyEventCallback;
    public onKeyUp: notifyEventCallback;
    public onChanged: notifyEventCallback;
    public onBlur: actionCallback;
    public onFocus: actionCallback;
    public onClearClick: actionCallback;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {});
    }

    set onObserverChanged(callback: (target: Control, event?: Event)=>void) {
        super.onObserverChanged = callback;
        if (this._inputControl) {
            this._inputControl.onObserverChanged = callback;
        }
    }
    get onObserverChanged(): (target: Control, event?: Event)=>void {
        return super.onObserverChanged;
    };

    set checked(value: boolean) {
        if (this._inputControl) {
            (this._inputControl as Checkbox).checked = value;
        }
    }
    get checked() {
        if (this._inputControl) {
            return (this._inputControl as Checkbox).checked;
        }
        return false;
    }

    set valueFormat(value: string) {
        if (this._inputControl) {
            (this._inputControl as Datepicker).valueFormat = value;
        }
    }
    get valueFormat() {
        if (this._inputControl) {
            return (this._inputControl as Datepicker).valueFormat;
        }
        return '';
    }

    get caption(): string{
        if (this._inputControl){
            return this._inputControl.caption;
        }
        return this._caption;
    }
    set caption(value: string){
        if (this._inputControl){
            this._inputControl.caption = value;
        } else {
            this._caption = value || '';
            this.labelElm.innerHTML = this._caption;
            this.captionSpanElm.style.display = value ? 'inline-block' : 'none';
        }
    }
    get captionWidth(): number | string {
        if (this._inputControl) {
            return this._inputControl.captionWidth
        }
        return this._captionWidth;
    }
    set captionWidth(value: number | string){
        if (this._inputControl){
            this._inputControl.captionWidth = value;
        } else {
            value = value ?? 'auto';
            this._captionWidth = value;
            this.labelElm.style.width = value + 'px';
        }
    }
    get height(): number{
        return this.offsetHeight;
    }
    set height(value: number | string){
        this.setPosition('height', value);
        if (this._inputControl) {
            this._inputControl.height = value;
        } else {
            this.inputElm.style.height = typeof value === 'string' ? value : `${value}px`;
        }
    }    
    get value(): any{
        if (this._inputControl){
            return this._inputControl.value;
        }
        return this._value
    }
    set value(value: any){ 
        if (this._inputControl){
            this._inputControl.value = value;
        } else {
            if (value == null)       
                value = '';
            this._value = value;
            if (this.inputElm) this.inputElm.value = value;
            if (this.clearIconElm) {
                if (this._showClearButton && value) {
                    this.clearIconElm.classList.add('active');
                } else {
                    this.clearIconElm.classList.remove('active')
                }
            }
            if (this.inputType === 'textarea' && (this.resize === 'auto' || this.resize === 'auto-grow')) {
                this.inputElm.style.height = 'auto';
                this.inputElm.style.height = (this.inputElm.scrollHeight + 2) + 'px';
            }
        }

        if (typeof this.onObserverChanged === 'function')
            this.onObserverChanged(this);
    }
    get width(): number|string{
        return this.offsetWidth
    }
    set width(value: number|string){
        this._width = value;
        const clearBtnWidth = this._showClearButton ? this._clearBtnWidth : 0;
        const captionWidth = typeof this._captionWidth === 'string' ? this._captionWidth : `${this._captionWidth}px`;
        this.setPosition('width', value);
        if (this.inputElm) {
            if (captionWidth === 'auto') {
                this.inputElm.style.width = `calc(100% - ${clearBtnWidth}px)`;
            }
            else {
                this.inputElm.style.width = `calc(100% - ${captionWidth} - ${clearBtnWidth}px)`;
            }
        }
    }
    get readOnly(): boolean {
        return this._readOnly
    }
    set readOnly(value: boolean) {
        this._readOnly = value;
        if (this.inputElm) this.inputElm.readOnly = value || this._designMode
    }
    get inputType(): InputType {
        return this._inputType
    }
    set inputType(type: InputType) {
        const isChanged = this._inputType !== type;
        this._inputType = type;
        if (isChanged) this._createInputElement(type);
    }
    get inputControl(): InputControlType {
        return this._inputControl
    }
    get enabled(): boolean {
        return super.enabled;
    }
    set enabled(value: boolean) {
        super.enabled = value;
        if (this._inputControl){
            this._inputControl.enabled = value;
        } else if (this.inputElm) {
            this.inputElm.disabled = !value;
        }
    }
    set placeholder(value: string) {
        this.inputElm.placeholder = value;
    }
    get rows(): number {
        return this._rows;
    }
    set rows(value: number) {
        if (this.inputType !== 'textarea') return;
        this._rows = value;
        (this.inputElm as HTMLTextAreaElement).rows = value;
    }
    get multiline():boolean {
        return this._multiline;
    }
    set multiline(value: boolean) {
        this._multiline = value;
        if (value && this.inputType !== 'textarea') {
            this.inputType = 'textarea';
        }
    }
    get resize(): ResizeType {
        return this._resize;
    }
    set resize(value: ResizeType) {
        this._resize = value;
        if (this.inputType === 'textarea' && value && this.inputElm) {
            this.inputElm.style.resize = value === 'auto-grow' ? 'none' : value;
            if (value === 'auto' || value === 'auto-grow') {
                this.inputElm.style.height = 'auto';
                this.inputElm.style.height = (this.inputElm.scrollHeight + 2) + 'px';
            }
        }
    }
    set border(value: IBorder) {
        super.border = value;
        const inputTypes = ['text', 'number', 'textarea', 'password'];
        if (!this.inputType || inputTypes.includes(this.inputType)) {
            if (this.border.width !== undefined)
                this.inputElm.style.borderWidth = this.border.width;
            if (this.border.style)
                this.inputElm.style.borderStyle = this.border.style;
            if (this.border.color)
                this.inputElm.style.borderColor = this.border.color;
            if (this.border.bottom || this.border.top || this.border.left || this.border.right)
                this.inputElm.style.borderStyle = 'none';
        }
    }
    get border(): Border {
        return super.border;
    }
    set maxLength(value: number) {
        this._maxLength = value;
        if (this.inputElm) {
            if (value) this.inputElm.maxLength = value;
            else this.inputElm.removeAttribute('maxLength');
        }
    }
    get maxLength(): number {
        return this._maxLength;
    }

    set enterKeyHint(value: EnterKeyHintType) {
        this._enterKeyHint = value;
        if (this.inputElm) {
            this.inputElm.setAttribute('enterKeyHint', value);
        }
    }
    get enterKeyHint(): EnterKeyHintType {
        return this._enterKeyHint;
    }

    get background(): Background {
        return this._background;
    }
    set background(value: IBackground) {
        super.background = value;
        if (value && value.color !== undefined) {
            this.style.setProperty('--input-background', value.color);
        } else {
            this.style.removeProperty('--input-background');
        }
    }

    get font(): IFont {
        return this._font;
    }
    set font(value: IFont) {
        super.font = value;
        if (value && value.color !== undefined) {
            this.style.setProperty('--input-font_color', value.color);
        } else {
            this.style.removeProperty('--input-font_color');
        }
    }

    set onClosed(callback: () => void) {
        this._onClosed = callback;
        if (!this._inputControl || this.inputType !== 'color') return;
        (this._inputControl as ColorPicker).onClosed = callback;
    }
    get onClosed() {
        return this._onClosed;
    }
    private _createInputElement(type: InputType){
        this.clearInnerHTML();
        const value = this.getAttribute('value');
        const width = this.getAttribute('width', true);
        const height = this.getAttribute('height', true);
        const checked = this.getAttribute('checked', true);
        const enabled = this.getAttribute('enabled', true);
        const background = this.getAttribute('background', true);
        const designMode = this.getAttribute('designMode', true);
        const caption = this._caption;
        this._clearBtnWidth = height - 2 || CLEAR_BTN_WIDTH;
        let cursor = 'text';
        switch (type) {
            case "checkbox":
                this._inputControl = new Checkbox(this, {
                    value,
                    checked,
                    enabled,
                    caption,
                    designMode,
                    indeterminate: this.getAttribute('indeterminate', true)
                });
                if (typeof this.onChanged === 'function') this._inputControl.onChanged = this.onChanged;
                this.appendChild(this._inputControl);
                this.inputElm = <HTMLInputElement>this._inputControl.querySelector('input[type="checkbox"]');
                cursor = 'pointer';
                break;
            case "combobox":
                this._inputControl = new ComboBox(this, {
                    selectedItem: this.getAttribute('selectedItem', true),
                    selectedItems: this.getAttribute('selectedItems', true),
                    value: this.getAttribute('value', true),
                    items: this.getAttribute('items', true),
                    width,
                    height,
                    enabled,
                    designMode,
                    icon: this.getAttribute('icon', true),
                    mode: this.getAttribute('mode', true),
                    placeholder: this.getAttribute('placeholder', true),
                    parentCallback: this._inputCallback,
                });
                if (typeof this.onChanged === 'function') this._inputControl.onChanged = this.onChanged;
                this.appendChild(this._inputControl);
                this.inputElm = <HTMLInputElement>this._inputControl.querySelector('input');
                break;
            case "date":
            case "dateTime":
            case "time":
                this._inputControl = new Datepicker(this, {
                    caption,
                    value,
                    placeholder: this._placeholder,
                    type: type,
                    valueFormat: this.getAttribute('valueFormat', true),
                    dateTimeFormat: this.getAttribute('dateTimeFormat', true),
                    width,
                    height,
                    designMode,
                    enabled,
                    parentCallback: this._inputCallback
                });
                if (typeof this.onChanged === 'function') this._inputControl.onChanged = this.onChanged;
                this.appendChild(this._inputControl);
                this.inputElm = <HTMLInputElement>this._inputControl.querySelector('input[type="text"]');
                break;
            case "range":
                this._inputControl = new Range(this, {
                    value,
                    caption,
                    width,
                    height,
                    enabled,
                    designMode,
                    min: this.getAttribute("min", true),
                    max: this.getAttribute("max", true),
                    step: this.getAttribute("step", true), 
                    // labels: this.getAttribute("labels", true),
                    stepDots: this.getAttribute("stepDots", true),
                    tooltipFormatter: this.getAttribute("tooltipFormatter", true),
                    tooltipVisible: this.getAttribute("tooltipVisible", true),
                    trackColor: this.getAttribute("trackColor", true),
                    parentCallback: this._inputCallback
                })
                this._inputControl.onChanged = this.onChanged
                this._inputControl.onMouseUp = this.onMouseUp;
                this._inputControl.onKeyUp = this.onKeyUp;
                this.appendChild(this._inputControl);
                this.inputElm = <HTMLInputElement>this._inputControl.querySelector('input[type="range"]');
                cursor = 'pointer';
                break;
            case "radio":
                const id = this.getAttribute("id") || '';
                this._inputControl = new Radio(this, {
                    value, 
                    checked,
                    enabled,
                    caption,
                    designMode,
                    id: id + '_radio'
                })
                this.appendChild(this._inputControl);
                this.inputElm = <HTMLInputElement>this._inputControl.querySelector('input[type="radio"]');
                cursor = 'pointer';
                break;
            case "textarea":
                this.captionSpanElm = this.createElement('span', this);
                this.labelElm = <HTMLLabelElement>this.createElement('label', this.captionSpanElm);
                this.inputElm = <HTMLTextAreaElement>this.createElement('textarea', this);     
                this.inputElm.style.height = 'auto';
                const rows = this.getAttribute('rows', true) || defaultRows;
                this.rows = rows;
                if (this._placeholder) {
                    this.inputElm.placeholder = this._placeholder;
                }
                this.inputElm.style.resize = value === 'auto-grow' ? 'none' : value;
                this.inputElm.disabled = enabled === false;
                this.inputElm.addEventListener('input', this._handleChange.bind(this));
                this.inputElm.addEventListener('keydown', this._handleInputKeyDown.bind(this));
                this.inputElm.addEventListener('keyup', this._handleInputKeyUp.bind(this));
                this.inputElm.addEventListener('focus', this._handleOnFocus.bind(this));
                if (caption) this.caption = caption;
                break;
            case "color":
                this._inputControl = new ColorPicker(this, {
                    value,
                    enabled,
                    caption,
                    width,
                    height
                });
                if (typeof this.onChanged === 'function') this._inputControl.onChanged = this.onChanged;
                if (!this.onClosed) {
                    const onClosed = this.getAttribute('onClosed', true);
                    this._inputControl.onClosed = onClosed;
                } else {
                    this._inputControl.onClosed = this.onClosed;
                }
                this.appendChild(this._inputControl);
                this.inputElm = this._inputControl.querySelector('.input-span') as any;
                cursor = 'default';
                break;
            default:
                const inputType = type == 'password' ? type : 'text';
                this.captionSpanElm = this.createElement('span', this);
                this.labelElm = <HTMLLabelElement>this.createElement('label', this.captionSpanElm);
                this.inputElm = <HTMLInputElement>this.createElement('input', this);
                this.inputElm.setAttribute('autocomplete', 'disabled');        
                this.inputElm.style.height = this.height + 'px';
                this.inputElm.type = inputType;
                if (this._placeholder)
                    this.inputElm.placeholder = this._placeholder;

                this.inputElm.disabled = enabled === false;
                this.inputElm.addEventListener('input', this._handleChange.bind(this));
                this.inputElm.addEventListener('keydown', this._handleInputKeyDown.bind(this));
                this.inputElm.addEventListener('keyup', this._handleInputKeyUp.bind(this));
                this.inputElm.addEventListener('focus', this._handleOnFocus.bind(this));
                this._showClearButton = this.getAttribute('showClearButton', true);
                if (this._showClearButton) {
                    this.clearIconElm = this.createElement("span", this);
                    this.clearIconElm.classList.add('clear-btn');
                    this.clearIconElm.style.width = this._clearBtnWidth + "px";
                    // this.clearIconElm.style.height = this._clearBtnWidth + "px";
                    this.clearIconElm.addEventListener("click", () => {
                      if (!this._enabled) return false;
                      this._clearValue();
                    });
                    const clearIcon = new Icon(this, { name: 'times', width: 12, height: 12, fill: Theme.ThemeVars.text.primary });
                    this.clearIconElm.appendChild(clearIcon);
                }
                if (caption) this.caption = caption;
                break
        }
        if (this.inputElm) {
            this.inputElm.readOnly = designMode || this.readOnly;
            this.inputElm.style.cursor = designMode ? 'pointer' : cursor;
        }
        if (background && this._inputControl)
            this._inputControl.background = background;
    }
    private _inputCallback = (value: any) => {
        this._value = value
    }
    private _handleChange(event: Event){
        if (this.inputType === 'number' && !/^-?\d*[.]?\d*$/.test(this.inputElm.value)) {
            this.inputElm.value = this._value;
            return;
        }
        if (this.inputType === 'textarea' && (this.resize === 'auto' || this.resize === 'auto-grow')) {
            this.inputElm.style.height = 'auto';
            this.inputElm.style.height = (this.inputElm.scrollHeight + 2) + 'px';
        }
        this._value = this.inputElm.value;
        if (typeof this.onObserverChanged === 'function')
            this.onObserverChanged(this, event);
        if (typeof this.onChanged === 'function')
            this.onChanged(this, event);
    }
    private _handleInputKeyDown(event: Event | KeyboardEvent){
        if (typeof this.onKeyDown === 'function')
            this.onKeyDown(this, event);
    }
    private _handleInputKeyUp(event: Event | KeyboardEvent){
        if (typeof this.onKeyUp === 'function')
            this.onKeyUp(this, event);
        if (this.clearIconElm) {
            if (this.value) {
                this.clearIconElm.classList.add('active');
            } else {
                this.clearIconElm.classList.remove('active')
            }
        }
    }
	protected _handleBlur(event: Event, stopPropagation?: boolean): boolean {
        if (typeof this.onBlur === 'function'){
            event.preventDefault();
            this.onBlur(this)
        }
		return true;
	};
    private _handleOnFocus(event: Event) {
        if (typeof this.onFocus === 'function'){
            event.preventDefault();
            this.onFocus(this);
        }
    }
    private _clearValue() {
        this.value = '';
        this.clearIconElm.classList.remove('active');
        if (typeof this.onClearClick === 'function') this.onClearClick(this);
    }
    public focus() {
        this.inputElm.focus();
    }
    protected init() {
        if (!this.inputType) {
            this._placeholder = this.getAttribute('placeholder', true);
            this._caption = this.getAttribute('caption', true);
            this.inputType = this.getAttribute('inputType', true, DEFAULT_VALUES.inputType);
            this.multiline = this.getAttribute('multiline', true);
            this.captionWidth = this.getAttribute('captionWidth', true);
            this.value = this.getAttribute('value', true);
            this._designMode = this.getAttribute('designMode', true, false);
            this.readOnly = this.getAttribute('readOnly', true, DEFAULT_VALUES.readOnly);
            this.resize = this.getAttribute('resize', true, DEFAULT_VALUES.resize);
            this.maxLength = this.getAttribute('maxLength', true);
            this.enterKeyHint = this.getAttribute('enterKeyHint', true);
            if (this.value && this.clearIconElm) this.clearIconElm.classList.add('active');
            super.init();
            if (this.inputType === 'textarea' && this.maxHeight != null) {
                if (!isNaN(Number(this.maxHeight))) {
                    this.inputElm.style.maxHeight = this.maxHeight + 'px';
                }
                else {
                    this.inputElm.style.maxHeight = this.maxHeight + "";
                }
            }
        }             
    }

    static async create(options?: InputElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }      
}