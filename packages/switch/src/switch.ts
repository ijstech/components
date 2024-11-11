import { Control, ControlElement, customElements, notifyEventCallback } from "@ijstech/base";
import "./style/switch.css";
import { GroupType } from "@ijstech/types";

export interface SwitchElement extends ControlElement {
  checkedThumbColor?: string;
  uncheckedThumbColor?: string;
  checkedThumbText?: string;
  uncheckedThumbText?: string;
  checkedTrackColor?: string;
  uncheckedTrackColor?: string;
  checkedText?: string;
  uncheckedText?: string;
  checked?: boolean;
  onChanged?: notifyEventCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-switch"]: SwitchElement;
    }
  }
}

@customElements("i-switch", {
  icon: 'toggle-on',
  group: GroupType.FIELDS,
  className: 'Switch',
  props: {
    checkedThumbColor: { type: 'string', default: '' },
    uncheckedThumbColor: { type: 'string', default: '' },
    checkedThumbText: { type: 'string', default: '' },
    uncheckedThumbText: { type: 'string', default: '' },
    checkedTrackColor: { type: 'string', default: '' },
    uncheckedTrackColor: { type: 'string', default: '' },
    checkedText: { type: 'string', default: '' },
    uncheckedText: { type: 'string', default: '' },
    checked: { type: 'boolean', default: false },
  },
  events: {},
  dataSchema: {
    type: "object",
    properties: {
      checkedThumbColor: { type: "string", format: 'color' },
      uncheckedThumbColor: { type: "string", format: 'color' },
      checkedThumbText: { type: "string" },
      uncheckedThumbText: { type: "string" },
      checkedTrackColor: { type: "string", format: 'color' },
      uncheckedTrackColor: { type: "string", format: 'color' },
      checkedText: { type: "string" },
      uncheckedText: { type: "string" },
      checked: { type: "boolean", default: false },
    },
  }
})
export class Switch extends Control {
  private wrapperElm: HTMLElement;
  private switchBaseElm: HTMLElement;
  private inputElm: HTMLElement;
  private thumbElm: HTMLElement;
  private rippleElm: HTMLElement;
  private trackElm: HTMLElement;

  private _checked: boolean;
  private _checkedThumbColor: string;
  private _uncheckedThumbColor: string;
  private _checkedTrackColor: string;
  private _uncheckedTrackColor: string;
  private _checkedText: string;
  private _uncheckedText: string;
  private _checkedThumbText: string;
  private _uncheckedThumbText: string;
  public onChanged: notifyEventCallback;

  constructor(parent?: Control, options?: any) {
    super(parent, options);
  }

  get checked(): boolean {
    return this._checked
  }

  set checked(value: boolean) {
    if (this._checked === value) return;
    this._checked = value;
    this._checked ? this.switchBaseElm.classList.add("checked") : this.switchBaseElm.classList.remove("checked");
    if (this._checked) {
      if (this.checkedThumbColor) this.switchBaseElm.style.color = this.checkedThumbColor;
      if (this.checkedTrackColor) this.trackElm.style.backgroundColor = this.checkedTrackColor;
    } else {
      if (this.uncheckedThumbColor) this.switchBaseElm.style.color = this.uncheckedThumbColor;
      if (this.uncheckedTrackColor) this.trackElm.style.backgroundColor = this.uncheckedTrackColor;
    }
  }

  get checkedThumbColor(): string {
    return this._checkedThumbColor
  }
  set checkedThumbColor(value: string) {
    if (this._checkedThumbColor === value) return;
    this._checkedThumbColor = value;
    if (this._checked) {
      this.switchBaseElm.style.color = this.checkedThumbColor;
    }
  }
  get uncheckedThumbColor(): string {
    return this._uncheckedThumbColor
  }
  set uncheckedThumbColor(value: string) {
    if (this._uncheckedThumbColor === value) return;
    this._uncheckedThumbColor = value;
    if (!this._checked) {
      this.switchBaseElm.style.color = value;
    }
  }
  get checkedTrackColor(): string {
    return this._checkedTrackColor
  }
  set checkedTrackColor(value: string) {
    if (this._checkedTrackColor === value) return;
    this._checkedTrackColor = value;
    if (this._checked) {
      this.trackElm.style.backgroundColor = value;
    }
  }
  get uncheckedTrackColor(): string {
    return this._uncheckedTrackColor
  }
  set uncheckedTrackColor(value: string) {
    if (this._uncheckedTrackColor === value) return;
    this._uncheckedTrackColor = value;
    if (!this._checked) {
      this.trackElm.style.backgroundColor = value;
    }
  }
  get checkedText(): string {
    return this._checkedText;
  }
  set checkedText(value: string) {
    this._checkedText = value;
    this.trackElm.style.setProperty("--checked-text", `"${value}"`);
  }
  get uncheckedText(): string {
    return this._uncheckedText;
  }
  set uncheckedText(value: string) {
    this._uncheckedText = value;
    this.trackElm.style.setProperty("--text", `"${value}"`);
  }
  get checkedThumbText(): string {
    return this._checkedThumbText;
  }
  set checkedThumbText(value: string) {
    this._checkedThumbText = value;
    this.thumbElm.classList.add("thumb-text");
    this.thumbElm.style.setProperty("--thumb-text", `'${value || ""}'`);
  }
  get uncheckedThumbText(): string {
    return this._uncheckedThumbText;
  }
  set uncheckedThumbText(value: string) {
    this._uncheckedThumbText = value;
    this.thumbElm.classList.add("thumb-text");
    this.thumbElm.style.setProperty("--thumb-checked-text", `'${value || ""}'`);
  }

  protected setAttributeToProperty<P extends keyof Switch>(propertyName: P){
    const prop = this.getAttribute(propertyName, true);
    if (prop) this[propertyName] = prop;
  }

  _handleClick(event: MouseEvent) {
    if (this._designMode) return false;
    if (!this.onClick){
      this.checked = !this.checked;
      if (typeof this.onChanged === 'function')
        this.onChanged(this, event)
      if (typeof this.onObserverChanged === 'function')
        this.onObserverChanged(this, event);
    }
    return super._handleClick(event, true);
  }

  init() {
    if (!this.wrapperElm) {
      this.wrapperElm = this.createElement("div", this);
      this.wrapperElm.classList.add("wrapper");

      this.switchBaseElm = this.createElement("div");
      this.switchBaseElm.classList.add("switch-base");
      this.wrapperElm.appendChild(this.switchBaseElm);

      this.trackElm = this.createElement("div");
      this.trackElm.classList.add("track");
      this.wrapperElm.appendChild(this.trackElm);

      // switch-base
      this.inputElm = this.createElement("input");
      this.inputElm.setAttribute("type", "checkbox");
      this.switchBaseElm.appendChild(this.inputElm);

      this.thumbElm = this.createElement("div");
      this.thumbElm.classList.add("thumb");
      this.switchBaseElm.appendChild(this.thumbElm);

      this.rippleElm = this.createElement("div");
      this.rippleElm.classList.add("ripple");
      this.switchBaseElm.appendChild(this.rippleElm);

      this.checked = this.getAttribute("checked", true) || false;
      this.setAttributeToProperty('checkedThumbColor');
      this.setAttributeToProperty('uncheckedThumbColor');
      this.setAttributeToProperty('checkedTrackColor');
      this.setAttributeToProperty('uncheckedTrackColor');
      this.setAttributeToProperty('checkedText');
      this.setAttributeToProperty('uncheckedText');
      this.setAttributeToProperty('checkedThumbText');
      this.setAttributeToProperty('uncheckedThumbText');
      super.init();
    }
  }

  static async create(options?: SwitchElement, parent?: Control){
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}
