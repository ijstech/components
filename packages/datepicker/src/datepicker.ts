import { customElements, ControlElement, Control, RequireJS, LibPath, notifyEventCallback, IBorder, Border, observable } from '@ijstech/base';
import { Icon } from '@ijstech/icon';
import './style/datepicker.css';
import {moment, Moment} from '@ijstech/moment';
import { Theme } from '@ijstech/style';
import { GroupType } from '@ijstech/types';

type actionCallback = (target: Datepicker) => void;
type dateType = 'date' | 'dateTime' | 'time';
export interface DatepickerElement extends ControlElement {
    caption?: string;
    captionWidth?: number | string;
    value?: Moment;
    minDate?: Moment;
    placeholder?: string;
    type?: dateType;
    dateTimeFormat?: string;
    onChanged?: notifyEventCallback;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-datepicker']: DatepickerElement
        }
    }
}

const defaultCaptionWidth = 40;
const DEFAULT_VALUES = {
    type: 'date',
    captionWidth: 0
}

@customElements('i-datepicker', {
    icon: 'calendar',
    group: GroupType.FIELDS,
    className: 'Datepicker',
    props: {
        caption: { type: 'string',  default: '' },
        captionWidth: { type: 'number', default: DEFAULT_VALUES.captionWidth },
        value: { type: 'object' },
        placeholder: { type: 'string', default: '' },
        type: {  type: 'string', default: DEFAULT_VALUES.type },
        dateTimeFormat: { type: 'string', default: '' }
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
            type: {
                type: 'string',
                enum: ['date', 'dateTime', 'time'],
                default: DEFAULT_VALUES.type
            },
            placeholder: {
                type: 'string'
            },
            caption: {
                type: 'string'
            },
            dateTimeFormat: {
                type: 'string'
            }
        }
    }
})
export class Datepicker extends Control {
    private _value?: Moment;
    private _caption: string;
    private _captionWidth: number | string;
    private _iconWidth: number;
    private _dateTimeFormat: string;
    private _type: dateType;
    private _placeholder: string;
    private _minDate: string;
    private callback: (value: any) => void;

    private captionSpanElm: HTMLElement;
    private labelElm: HTMLLabelElement;
    private inputElm: HTMLInputElement;
    private toggleElm: HTMLElement;
    private toggleIconElm: Icon;
    private datepickerElm: HTMLInputElement;

    public onChanged: notifyEventCallback;
    public onBlur: actionCallback;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {
            height: 25,
            width: 100
        });
    }

    _handleClick(event: MouseEvent): boolean {
        return super._handleClick(event, true)
    }

    get caption(): string {
        return this._caption;
    }
    set caption(value: string) {
        this._caption = value;
        this.labelElm.textContent = this._caption || '';
        if (!value)
            this.labelElm.style.display = 'none'
        else
            this.labelElm.style.display = '';
    }
    get captionWidth(): number {
        return this.labelElm.offsetWidth;
    }
    set captionWidth(value: number | string) {
        this._captionWidth = value;
        this.setElementPosition(this.labelElm, 'width', value);
        const width = this.width - this.captionWidth - (this._iconWidth || 0);
        this.inputElm.style.width = `${width}px`;
    }
    get height(): number {
        return this.offsetHeight;
    }
    set height(value: number | string) {
        this.setPosition('height', value);
        // this.inputElm.style.height = typeof value === 'string' ? value : `${value}px`;
    }
    get width(): number {
        return this.offsetWidth
    }
    set width(value: number | string) {
        this.setPosition('width', value);
        const width = typeof this._width === 'string' ? this._width : `${this._width}px`;
        let captionWidth = typeof this._captionWidth === 'string' ? this._captionWidth : `${this._captionWidth}px`;
        if (!this._caption) captionWidth = '0px';
        const iconWidth = `${this._iconWidth || 0}px`;
        this.inputElm.style.width = `calc(${width} - ${captionWidth} - ${iconWidth} - ${this.border.width || '0px'})`;
    }
    set border(value: IBorder) {
        super.border = value;
        if (this.border.width !== undefined)
            this.width = this._width;
        const hasBorderSide = this.border.bottom || this.border.top || this.border.left || this.border.right;
        if (hasBorderSide || this.border.style) {
            this.toggleElm && (this.toggleElm.style.borderStyle = 'none');
            this.inputElm && (this.inputElm.style.borderStyle = 'none');
        }

    }
    get border(): Border {
        return super.border;
    }
    get value(): Moment | undefined {
        return this._value;
    }
    set value(value: Moment | undefined) {
        if (value)
            this.updateValue(value);
        else
            this.clear();
    }
    set minDate(value: Moment | undefined) {
        if (!value) {
            this._minDate = "";
        } else {
            this._minDate = value.format("YYYY-MM-DDTHH:mm");
        }
        if (this.datepickerElm) this.datepickerElm.min = this._minDate;
    }
    get defaultDateTimeFormat(): string {
        switch (this._type) {
            case 'date':
                return 'DD/MM/YYYY'
            case 'dateTime':
                return 'DD/MM/YYYY HH:mm'
            case 'time':
                return 'HH:mm'
        }
    }
    get dateTimeFormat(): string {
        return this._dateTimeFormat ?? '';
    }
    set dateTimeFormat(format: string) {
        this._dateTimeFormat = format ?? '';
    }
    get datepickerFormat(): string {
        switch (this._type) {
            case 'date':
                return 'YYYY-MM-DD'
            case 'dateTime':
                return 'YYYY-MM-DD\THH:mm:ss'
            case 'time':
                return 'HH:mm:ss'
        }
    }
    get maxLength(): number {
        switch (this._type) {
            case 'date':
                return 10
            case 'dateTime':
                return 16
            case 'time':
                return 5
        }
    }
    get enabled(): boolean {
        return super.enabled;
    }
    set enabled(value: boolean) {
        super.enabled = value;
        this.inputElm.disabled = !value;
        this.datepickerElm.disabled = !value;
    }
    get placeholder(): string {
        return this._placeholder ?? '';
    }
    set placeholder(value: string) {
        this._placeholder = value ?? '';
        if (this.inputElm)
            this.inputElm.placeholder = this._placeholder;
    }

    get type() {
        return this._type;
    }
    set type(value: dateType) {
        this._type = value;
        if (this.toggleIconElm) {
            this.toggleIconElm.name = this._type === 'time' ? 'clock' : 'calendar';
        }
        if (this.datepickerElm) {
            const inputType = this._type === 'dateTime' ? 'datetime-local' : this._type;
            this.datepickerElm.setAttribute('type', inputType);
        }
    }
    set designMode(value: boolean) {
        this._designMode = value;
        if (this.inputElm) {
            this.inputElm.readOnly = value;
        }
        if (this.datepickerElm) {
            this.datepickerElm.readOnly = value;
        }
    }

    private get formatString() {
        return this.dateTimeFormat || this.defaultDateTimeFormat;
    }

    private emitChange(event: Event) {
        if (typeof this.onObserverChanged === 'function')
            this.onObserverChanged(this, event);
        if (typeof this.onChanged === 'function')
            this.onChanged(this, event);
    }

    private _onDatePickerChange = (event: Event) => {
        const pickerValue: string = this.datepickerElm.value;
        if (!pickerValue) {
            this.inputElm.placeholder = this._placeholder || '';
            this.inputElm.value = '';
            this.emitChange(event);
            return;
        }
        // RequireJS.require(['@moment'], (moment: Moment) => {
            let _moment = this._type === 'time' ? moment(pickerValue, 'HH:mm:ss') : moment(pickerValue);
            this.updateValue(_moment);
            this.emitChange(event);
        // })
    }

    // private _dateInputMask = (event: KeyboardEvent) => {
    //     const key: string = event.key;
    //     const isNumeric = key != ' ' && !isNaN(Number(key));
    //     const separator = this._type === 'time' ? ':' : '/';
    //     if (!isNumeric) {
    //         event.preventDefault();
    //     }

    //     var len: number = this.inputElm.value.length;

    //     if (len === 2) {
    //         this.inputElm.value += separator;
    //     }

    //     if (this._type !== 'time' && len === 5) {
    //         this.inputElm.value += separator;
    //     }

    //     if (this._type === 'dateTime') {
    //         if (len === 10) {
    //             this.inputElm.value += ' ';
    //         }

    //         if (len === 13) {
    //             this.inputElm.value += ':';
    //         }
    //     }
    // }

    // private _onFocus = () => {
    //     this.inputElm.placeholder = this.formatString;
    //     if (!this.inputElm.value) return;

    //     if (this.value) {
    //         // For checking isValid
    //         this.inputElm.value = this.value.format(this.defaultDateTimeFormat);
    //     }
    // }

    private _onBlur = (event: Event): void => {
        if (this.onBlur){
            this.onBlur(this)
        }
        if (!this.inputElm.value) {
            const oldVal = this.value;
            this.clear();
            const isChanged = oldVal !== this.value;
            if (event && isChanged) {
                this.emitChange(event);
            }
            return;
        };
        // RequireJS.require(['@moment'], (moment: typeof Moment) => {
            const temp = moment(this.inputElm.value, this.formatString, true).format(this.datepickerFormat);
            const _moment = moment(temp, this.datepickerFormat, true);
            this.updateValue(_moment, event);
        // })
    }

    private updateValue(value: Moment, event?: Event) {
        this.inputElm.placeholder = this._placeholder || '';
        const oldVal = this.value;
        if (value.isValid()) {
            this._value = value;
            this.inputElm.value = value.format(this.formatString);
            this.datepickerElm.value = value.format(this.datepickerFormat);
            if (this.callback)
                this.callback(this.inputElm.value);
        } else if (this.value) {
            this.inputElm.value = this.value.format(this.formatString);
            this.datepickerElm.value = this.value.format(this.datepickerFormat);
        }
        const isChanged = (oldVal && this.value && !oldVal.isSame(this.value)) || (!oldVal || !this.value)
        if (event && isChanged) {
            this.emitChange(event);
        }
    }

    private clear() {
        this._value = undefined;
        this.inputElm.value = '';
        this.datepickerElm.value = '';
        this.callback && this.callback('');
    }

    protected init() {
        if (!this.captionSpanElm) {
            RequireJS.config({
                paths: {
                    '@moment': `${LibPath}lib/moment/2.29.1/moment.js`
                }
            })
            this.callback = this.getAttribute("parentCallback", true);
            this.dateTimeFormat = this.getAttribute('dateTimeFormat', true);
            this._type = this.getAttribute('type', true, DEFAULT_VALUES.type);
            const height = this.getAttribute('height', true);
            this._iconWidth = typeof height === 'number' ? height : +(height.replace('px', ''));
            this.captionSpanElm = this.createElement('span', this);
            this.labelElm = <HTMLLabelElement>this.createElement('label', this.captionSpanElm);

            this.inputElm = <HTMLInputElement>this.createElement('input', this);
            this.inputElm.setAttribute('type', 'text');
            this.inputElm.setAttribute('autocomplete', 'disabled');
            // this.inputElm.style.height = this.height + 'px';
            // this.inputElm.maxLength = this.maxLength;
            // this.inputElm.addEventListener('keypress', this._dateInputMask);
            // this.inputElm.onfocus = this._onFocus;
            this.inputElm.pattern = this.formatString;

            this.placeholder = this.getAttribute('placeholder', true);

            this.toggleElm = this.createElement('span', this);
            this.toggleElm.classList.add('datepicker-toggle');
            this.toggleElm.style.width = this._iconWidth + 'px';
            this.toggleIconElm = new Icon(this, {
                name: this._type === 'time' ? 'clock' : 'calendar',
                width: 12,
                height: 12,
                fill: Theme.ThemeVars.text.primary
            });
            this.toggleElm.appendChild(this.toggleIconElm);
            this.datepickerElm = <HTMLInputElement>this.createElement('input');
            const inputType = this._type === 'dateTime' ? 'datetime-local' : this._type;
            this.datepickerElm.setAttribute('type', inputType);
            this.datepickerElm.classList.add('datepicker');
            this.datepickerElm.addEventListener('input', (event) => {
                event.stopPropagation();
                this._onDatePickerChange(event);
            })
            this.toggleElm.appendChild(this.datepickerElm);

            const minDate = this.getAttribute('minDate', true);
            this.minDate = minDate;
            this.caption = this.getAttribute('caption', true);
            this.captionWidth = this.getAttribute('captionWidth', true, this._caption ? defaultCaptionWidth : 0);
            super.init();
        }
    }

    protected _handleBlur(event: Event, stopPropagation?: boolean): boolean {
        event.stopPropagation();
        event.preventDefault();
        this._onBlur(event);
		return true;
	};

    static async create(options?: DatepickerElement, parent?: Control) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }
}