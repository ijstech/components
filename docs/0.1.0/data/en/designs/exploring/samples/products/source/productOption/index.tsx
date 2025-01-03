import { Container, Module, customElements, ControlElement, Control, observable, Styles, HStack, Icon } from '@ijstech/components';
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
  private pnlOption: HStack;
  private closeIcon: Icon;

  @observable()
  private _data: IOption = {
    label: '',
    value: '',
    group: '',
    selected: false
  };

  onSelectOption: (target: Control, option: IOption) => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  setData(value: IOption) {
    this._data = value;
    this.updateUI();
  }

  get data() {
    return this._data;
  }

  private updateUI() {
    const isSelected = this._data.selected;
    if (isSelected) {
      this.pnlOption.background = { color: Theme.colors.primary.main };
      this.pnlOption.font = { color: Theme.colors.primary.dark, size: '13px', weight: 600 };
      this.closeIcon.visible = true;
    } else {
      this.pnlOption.background = { color: 'transparent' };
      this.pnlOption.font = { color: Theme.text.primary, size: '13px', weight: 600 };
      this.closeIcon.visible = false;
    }
  }

  private handleSelect(target: Control) {
    this._data.selected = !this._data.selected;
    this.updateUI();
    if (typeof this.onSelectOption === 'function') this.onSelectOption(target, this._data);
  }

  init() {
    super.init();
    const data = this.getAttribute('data', true);
    if (data) this.setData(data);
  }

  render() {
    return <i-hstack
      id="pnlOption"
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
        id="closeIcon"
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