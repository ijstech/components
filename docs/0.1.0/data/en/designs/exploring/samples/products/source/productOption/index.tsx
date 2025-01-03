import { Container, Module, customElements, ControlElement, Control, observable, Styles } from '@ijstech/components';
import { IOption } from '../types';
const Theme = Styles.Theme.ThemeVars;

interface ProductOptionElement extends ControlElement {
  data?: IOption;
  onSelectOption?: (target: Control, option: IOption) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-product-option': ProductOptionElement;
    }
  }
}

@customElements('i-product-option')
export default class ProductOption extends Module {
  @observable()
  private _data: IOption = {
    label: '',
    value: ''
  };

  onSelectOption: (target: Control, option: IOption) => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  setData(value: IOption) {
    this._data = value;
  }

  get data() {
    return this._data;
  }

  private handleSelect(target: Control) {
    if (typeof this.onSelectOption === 'function') this.onSelectOption(target, this._data);
  }

  init() {
    super.init();
    const data = this.getAttribute('data', true);
    if (data) this.setData(data);
  }

  render() {
    return <i-hstack
    alignItems='center'
    minWidth='36px'
    gap={8}
    minHeight='36px'
    padding={{ top: '9px', right: '15px', bottom: '9px', left: '15px' }}
    border={{ radius: '24px', width: '1px', color: Theme.divider }}
    cursor='pointer'
    stack={{ shrink: '0' }}
    onClick={this.handleSelect}
  >
    <i-label
      caption={this._data?.label}
      font={{ size: '12px', weight: '500' }}
    ></i-label>
    <i-icon
      width='12px'
      height='12px'
      name='times'
      visible={false}
      cursor='pointer'
      onClick={this.handleSelect}
    ></i-icon>
  </i-hstack>
  }
}