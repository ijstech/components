import { customElements, ControlElement, Control, notifyEventCallback, observable } from '@ijstech/base';
import './style/checkbox.css';
import { GroupType } from '@ijstech/types';

export interface CheckboxElement extends ControlElement {
    checked?: boolean;
    indeterminate?: boolean;
    caption?: string;
    captionWidth?: number | string;
    readOnly?: boolean;
    onChanged?: notifyEventCallback;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-checkbox']: CheckboxElement
        }
    }
}

const DEFAULT_VALUES = {
    indeterminate: false,
    checked: false,
    captionWidth: 0,
    readOnly: false,
    caption: ''
}

@customElements('i-checkbox', {
    icon: 'check-square',
    group: GroupType.FIELDS,
    className: 'Checkbox',
    props: {
        checked: {
            type: 'boolean',
            default: DEFAULT_VALUES.checked
        },
        indeterminate: {
            type: 'boolean',
            default: DEFAULT_VALUES.indeterminate
        },
        caption: {
            type: 'string',
            default: DEFAULT_VALUES.caption
        },
        captionWidth: {
            type: 'number',
            default: DEFAULT_VALUES.captionWidth
        },
        readOnly: {
            type: 'boolean',
            default: DEFAULT_VALUES.readOnly
        }
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
            checked: {
                type: 'boolean',
                default: DEFAULT_VALUES.checked
            },
            indeterminate: {
                type: 'boolean',
                default: DEFAULT_VALUES.indeterminate
            },
            caption: {
                type: 'string'
            },
            readOnly: {
                type: 'boolean',
                default: DEFAULT_VALUES.readOnly
            }
        }
    }
})
export class Checkbox extends Control {
    @observable('cchecked')
    private _checked: boolean;
    private _caption: string;
    private _captionWidth: number | string;
    private _indeterminate: boolean;
    private _readOnly: boolean;

    private wrapperElm: HTMLElement;
    private inputSpanElm: HTMLElement;
    private captionSpanElm: HTMLElement;
    private inputElm: HTMLInputElement;
    private checkmarklElm: HTMLElement;

    public onChanged: notifyEventCallback;

    constructor(parent?: Control, options?: any) {
        super(parent, options, {
            height: 30
        });
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
                && (this.captionSpanElm.innerHTML = value);
    }
    get captionWidth(): number | string {
        return this._captionWidth;
    }
    set captionWidth(value: number | string) {
        if (!value) return
        this._captionWidth = value;
        this.setElementPosition(this.captionSpanElm, 'width', value);
    }
    get height(): number {
        return this.offsetHeight;
    }
    set height(value: number | string) {
        this.setPosition('height', value);
    }
    get indeterminate(): boolean {
        return this._indeterminate;
    }
    set indeterminate(value: boolean) {
        this._indeterminate = value;
        if (this.inputSpanElm)
            value
                ? this.inputSpanElm.classList.add('is-indeterminate')
                : this.inputSpanElm.classList.remove('is-indeterminate');
        this.inputElm.indeterminate = value;
    }
    get checked(): boolean {
        return this._checked;
    }
    set checked(value: boolean) {
        this._checked = value;
        console.log('checkbox change', value, this._checked)
        this.addClass(value, 'is-checked');
        this.inputElm && (this.inputElm.checked = value);
    }
    get value(): any {
        return this.inputElm.value;
    }
    set value(data: any) {
        this.inputElm.value = data;
    }

    get enabled(): boolean {
        return super.enabled;
    }
    set enabled(value: boolean) {
        super.enabled = value;
        if (this.inputElm) {
            this.inputElm.disabled = !value;
        }
    }

    get readOnly(): boolean {
        return this._readOnly;
    }
    set readOnly(value: boolean) {
        this._readOnly = value;
        if (this.inputElm) {
            this.inputElm.readOnly = value;
        }
    }

    private _handleChange(event: Event) {
        if (this.readOnly || this._designMode) return;
        this.checked = this.inputElm.checked || false;
        this.addClass(this.checked, 'is-checked');
        if (typeof this.onObserverChanged === 'function') this.onObserverChanged(this, event);
        if (typeof this.onChanged === 'function') this.onChanged(this, event);
    }
    private addClass(value: boolean, className: string) {
        if (value)
            this.classList.add(className);
        else
            this.classList.remove(className);
    }
    protected init() {
        if (!this.captionSpanElm) {
            this.wrapperElm = this.createElement('label', this);
            if (this.height)
                this.wrapperElm.style.height = this.height + 'px';
            this.wrapperElm.classList.add('i-checkbox');
    
            this.inputSpanElm = <HTMLElement>this.createElement('span', this.wrapperElm);
            this.inputSpanElm.classList.add('i-checkbox_input');

            this.inputElm = <HTMLInputElement>this.createElement('input', this.inputSpanElm);
            this.inputElm.type = 'checkbox';
            const disabled = this.getAttribute('enabled') === false;
            this.inputElm.disabled = disabled;
            this.readOnly = this.getAttribute('readOnly', true, DEFAULT_VALUES.readOnly);

            this.checkmarklElm = this.createElement('span');
            this.checkmarklElm.classList.add('checkmark');
            this.inputSpanElm.appendChild(this.checkmarklElm)

            this.inputElm.addEventListener('input', this._handleChange.bind(this));

            this.captionSpanElm = <HTMLElement>this.createElement('span', this.wrapperElm);
            this.captionSpanElm.classList.add('i-checkbox_label');
            this.captionWidth = this.getAttribute('captionWidth', true);
            this.caption = this.getAttribute('caption', true);
        
            this.value = this.caption;

            this.checked = this.getAttribute('checked', true, DEFAULT_VALUES.checked);
            
            this.indeterminate = this.getAttribute('indeterminate', true);

            this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;

            super.init();
        }
    }

    static async create(options?: CheckboxElement, parent?: Control){
        let self = new this(parent, options);
        await self.ready();
        return self;
    }
}