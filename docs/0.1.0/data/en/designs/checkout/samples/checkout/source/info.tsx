import { Styles, Module, customElements, ControlElement, Container, observable } from "@ijstech/components";
import { IInformation } from "./types";
const Theme = Styles.Theme.ThemeVars;

interface CheckoutInfoElement extends ControlElement {
  onClose?: () => void;
  data?: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['checkout-info']: CheckoutInfoElement;
    }
  }
}

@customElements('checkout-info')
export default class Information extends Module {
  @observable('data')
  private _data: IInformation = {
    name: '',
    phone: '',
    email: '',
    address: ""
  };

  onClose: () => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: CheckoutInfoElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get data() {
    return this._data;
  }
  set data(value: IInformation) {
    this._data = value;
  }

  private handleClose() {
    if (this.onClose) this.onClose();
  }

  init() {
    super.init();
    this.onClose = this.getAttribute('onClose', true) || this.onClose;
    const data = this.getAttribute('data', true);
    if (data) this.data = data;
  }

  render() {
    return <i-vstack>
      <i-hstack
        verticalAlignment='center'
        gap='8px'
        alignItems='center'
        justifyContent='space-between'
        padding={{ "top": "22px", "right": "22px", "bottom": "22px", "left": "22px" }}
        border={{ "bottom": { "width": "1px", "style": "solid", "color": "var(--divider)" } }}
      >
        <i-label
          caption='Guest Information'
          font={{ "weight": 600, "size": "18px" }}
        >
        </i-label>
        <i-icon
          position='relative'
          width='20px'
          height='20px'
          name='times'
          cursor="pointer"
          onClick={this.handleClose}
        >
        </i-icon>
      </i-hstack>
      <i-vstack
        position='relative'
        width='100%'
        padding={{ "top": "22px", "right": "22px", "bottom": "22px", "left": "22px" }}
        gap={12}
      >
        <i-label
          position='relative'
          padding={{ "bottom": 8 }}
          display='block'
          caption='Contact Information'
          border={{ "bottom": { "width": "1px", "style": "solid", "color": "var(--divider)" } }}
        >
        </i-label>
        <i-hstack
          position='relative'
          width='100%'
          gap={8}
          alignItems='center'
          justifyContent='space-between'
          stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
        >
          <i-label
            position='relative'
            caption='Full name:'
            font={{ color: Theme.text.secondary }}
            stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
          >
          </i-label>
          <i-label
            position='relative'
            caption={this.data.name}
            font={{ "weight": "500" }}
          >
          </i-label>
        </i-hstack>
        <i-hstack
          position='relative'
          width='100%'
          gap={8}
          alignItems='center'
          justifyContent='space-between'
          stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
        >
          <i-label
            position='relative'
            font={{ color: Theme.text.secondary }}
            caption='Phone number:'
            stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
          >
          </i-label>
          <i-label
            position='relative'
            caption={this.data.phone}
            font={{ "weight": "500" }}
          >
          </i-label>
        </i-hstack>
        <i-hstack
          position='relative'
          width='100%'
          gap={8}
          alignItems='center'
          justifyContent='space-between'
          stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
        >
          <i-label
            position='relative'
            font={{ color: Theme.text.secondary }}
            caption='Email:'
            stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
          >
          </i-label>
          <i-label
            position='relative'
            caption={this.data.email}
            font={{ "weight": "500" }}
          >
          </i-label>
        </i-hstack>
        <i-label
          position='relative'
          padding={{ "bottom": 8 }}
          display='block'
          caption='Special requests'
          border={{ "bottom": { "width": "1px", "style": "solid", "color": "var(--divider)" } }}
          margin={{ "top": "20px" }}
        >
        </i-label>
        <i-label
          position='relative'
          caption='All special requests are subject to availability upon arrival.'
          font={{ "size": "12px", color: Theme.text.secondary }}
        >
        </i-label>
        <i-hstack
          position='relative'
          width='100%'
          gap={8}
          alignItems='center'
          justifyContent='space-between'
          stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
        >
          <i-label
            position='relative'
            font={{ color: Theme.text.secondary }}
            caption='Room 1:'
            stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
          >
          </i-label>
          <i-label
            position='relative'
            caption={this.data.name}
            font={{ "weight": "500" }}
          >
          </i-label>
        </i-hstack>
      </i-vstack>
    </i-vstack>
  }
}
