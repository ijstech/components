import { Control, ControlElement, customElements } from "@ijstech/base";

export interface ComboBoxItemElement extends ControlElement {
  value?: string;
  label?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["i-combo-box-item"]: ComboBoxItemElement;
    }
  }
}

@customElements('i-combo-box-item')
export class ComboBoxItem extends Control {
  private _value: string;
  private _label: string;

  get value() {
    return this._value;
  }
  set value(data: string) {
    this._value = data;
  }

  get label() {
    return this._label;
  }
  set label(data: string) {
    this._label = data;
  }

  init() {
    super.init();
    this.value = this.getAttribute('value', true);
    this.label = this.textContent || this.getAttribute('label', true);
  }

  static async create(options?: ComboBoxItemElement, parent?: Control) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}