import { Container, Module, customElements, ControlElement, Styles, observable, Panel, RadioGroup, Checkbox } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export interface SelectorElement extends ControlElement {
  data?: ISelectorData;
  selectedValue?: any;
  onChange?: (type: string, value: any) => void;
}

interface ISelectorData {
  title: string;
  key: string;
  options: any[];
  isRadio?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-product-filter--selector': SelectorElement;
    }
  }
}

@customElements('i-product-filter--selector')
export default class Selector extends Module {
  private pnlOptions: Panel;

  onChange: (type: string, value: any) => void;

  @observable()
  private _data: ISelectorData = {
    title: '',
    key: '',
    options: []
  };

  private _selectedValue: any;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  get selectedValue() {
    return this._selectedValue;
  }

  set selectedValue(value: any) {
    this._selectedValue = value;
  }

  get data() {
    return this._data;
  }

  set data(value: ISelectorData) {
    this._data = value;
    this.renderUI();
  }

  private renderUI() {
    this.pnlOptions.clearInnerHTML();
    if (this.data.options.length === 0) return;
    const options = this.data.options;
    const isRadio = this.data.isRadio;
    if (isRadio) {
      this.pnlOptions.appendChild(
        <i-radio-group
          width='100%'
          tag={this.data.key}
          selectedValue={this.selectedValue}
          onChanged={this.handleRadioChanged}
        >
          {options.map(option => {
            return <i-radio
              value={option.value}
              caption={option.label}
              font={{size: '13px'}}
            />
          })
          }
        </i-radio-group>
      )
    } else {
      const selected = this.selectedValue ? typeof this.selectedValue === 'string' ? [this.selectedValue] : this.selectedValue : [];
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        this.pnlOptions.appendChild(
          <i-checkbox
            caption={option.label}
            checked={selected && selected.includes(option.value)}
            tag={option}
            onChanged={this.handleCheckboxChanged}
          />
        )
      }
    }
  }

  private handleRadioChanged(target: RadioGroup) {
    const value = target.selectedValue;
    const label = this.data.options.find(item => item.value === value)?.label;
    if (typeof this.onChange === 'function') this.onChange(this.data.key, { value, label, group: this.data.key })
  }

  private handleCheckboxChanged(target: Checkbox) {
    const option = target.tag;
    const selectedValues = this.selectedValue || [];
    const findedIndex = selectedValues.findIndex(item => item.value === option.value);
    if (findedIndex > -1) {
      selectedValues.splice(findedIndex, 1);
    } else {
      selectedValues.push({ ...option, group: this.data.key });
    }
    if (typeof this.onChange === 'function') this.onChange(this.data.key, selectedValues);
  }

  init() {
    super.init();
    this.onChange = this.getAttribute('onChange', true) || this.onChange;
    this.handleCheckboxChanged = this.handleCheckboxChanged.bind(this);
    this.handleRadioChanged = this.handleRadioChanged.bind(this);
    this.selectedValue = this.getAttribute('selectedValue', true);
    const data = this.getAttribute('data', true);
    if (data) this.data = data;
  }

  render() {
    return <i-vstack
      gap={8}
      width='100%'
    >
      <i-label
        position='relative'
        caption={this._data.title || ''}
        font={{ "size": "13px", "weight": "600" }}
      >
      </i-label>
      <i-vstack id="pnlOptions"></i-vstack>
    </i-vstack>
  }
}
