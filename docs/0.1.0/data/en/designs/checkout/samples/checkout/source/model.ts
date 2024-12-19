import { Module } from "@ijstech/components";
export interface IPaymentOption {
  id: string;
  name: string;
  img: string;
}

export class PaymentModel {
  private tag: any = {
    light: {},
    dark: {
      '--text-primary': '#333',
      '--background-main': '#fff',
      '--colors-secondary-main': '#fafafa',
      '--input-background': '#fff',
      '--input-font_color': '#333',
      '--colors-error-main': '#dd1a00',
      '--colors-success-main': '#329223',
      '--colors-error-light': '#fff2f2',
      '--colors-success-light': '#e2f4ea',
      '--colors-primary-main': '#2577be',
      '--colors-primary-light': '#f2f9ff',
      '--background-modal': '#fff',
      '--background-default': '#f7f7f7',
      '--font-family': 'Montserrat, sans-serif',
      '--colors-secondary-light': '#fafafa',
      '--divider': '#d9d9d9',
      '--text-secondary': '#727272'
    }
  }
  private _module: Module;
  private _payments: IPaymentOption[] = [
    {
      id: '1',
      name: 'Credit Card',
      img: 'https://static.travala.com/resources/images/checkout/credit-cards.svg',
    },
    {
      id: '2',
      name: 'Travel Credits',
      img: 'https://static.travala.com/resources/images/checkout/travel_credits.svg',
    },
    {
      id: '3',
      name: 'WeChat Pay',
      img: 'https://static.travala.com/resources/images/checkout/wechat_pay.svg',
    },
    {
      id: '4',
      name: 'My Wallet',
      img: 'https://static.travala.com/resources/images/checkout/wallet.svg',
    },
    {
      id: '5',
      name: 'Web3 Wallet',
      img: 'https://static.travala.com/resources/images/checkout/web3-wallet.svg',
    }
  ]
  private _information: any;

  constructor(module: Module) {
    this._module = module;
  }

  get payments() {
    return this._payments;
  }

  get information() {
    return this._information || {
      "name": 'John Doe',
      "phone": "(123) 456-7890",
      "email": "user@example.com",
      "address": "123 Main St, Anytown, USA",
    };
  }
  set information(value: any) {
    this._information = value;
  }

  getPayment(id: string) {
    return this._payments.find(p => p.id === id);
  }

  private updateStyle(name: string, value: any) {
    value ? this._module.style.setProperty(name, value) : this._module.style.removeProperty(name);
  }

  updateTheme() {
    const themeVar = document.body.style.getPropertyValue('--theme') || 'dark';
    const data = this.tag[themeVar];
    if (!data) return;
    for (const key in data) {
      this.updateStyle(key, data[key]);
    }
  }
}