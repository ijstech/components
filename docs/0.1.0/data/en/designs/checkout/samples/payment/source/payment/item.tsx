import { observable, Module, ControlElement, customElements } from "@ijstech/components";
import { IInvoiceItem } from "./types";

interface PaymentItemElement extends ControlElement { }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-payment-item': PaymentItemElement;
    }
  }
}

@customElements('i-payment-item')
export default class PaymentItem extends Module {
  @observable()
  private _data: IInvoiceItem = {
    id: "",
    name: "",
    description: "",
    price: "",
    image: ""
  }

  get data() {
    return this._data;
  }

  setData(data: IInvoiceItem) {
    this._data = data;
  }

  render() {
    return <i-hstack
      position='relative'
      width='100%'
      gap={16}
      alignItems='center'
    >
      <i-image
        url={this._data?.image}
        display='block'
        width='48px'
        height='48px'
        objectFit='cover'
        stack={{ "shrink": "0" }}
        border={{ "width": "1px", "style": "solid", "color": "var(--divider)" }}
      >
      </i-image>
      <i-vstack
        position='relative'
        width='100%'
        gap={5}
      >
        <i-label
          caption={this._data?.name || ''}
          font={{ "weight": "600" }}
        >
        </i-label>
        <i-label
          caption={this._data?.description || ''}
          font={{ "color": "var(--text-secondary)" }}
        >
        </i-label>
      </i-vstack>
    </i-hstack>
  }
}


