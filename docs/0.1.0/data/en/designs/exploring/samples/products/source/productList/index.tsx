import {
  Control, Repeater,
  Container,
  Module,
  customElements,
  ControlElement,
  observable
} from '@ijstech/components'
import Product from '../productItem/index'
import { IProduct } from '../types';
import { productListStyle } from '../index.css';

export interface ProductListElement extends ControlElement {
  data?: IProduct[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-product-list': ProductListElement
    }
  }
}

@customElements('i-product-list')
export default class ProductList extends Module {
  private listRepeater: Repeater;

  // @observable('data', true) // TODO: fix this
  private _data: IProduct[] = [];

  set data(value: IProduct[]) {
    this._data = value || [];
    this.listRepeater.data = this._data;
  }

  get data() {
    return this._data || [];
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options)
    this.onRenderItem = this.onRenderItem.bind(this);
  }

  onRenderItem(parent: Control, index: number) {
    const childEl = parent.children?.[index]?.firstChild as Product;
    const data = this.data[index];
    if (childEl && data) {
      childEl.setData(data);
    }
  };

  async init() {
    super.init()

    await this.listRepeater.ready();
    const item = document.createElement('i-product') as Product;
    this.listRepeater.add(item);

    const data = this.getAttribute('data', true);
    if (data) this.data = data;
  }

  render() {
    return <i-repeater
      id="listRepeater"
      position='relative'
      width='100%'
      // data={this.data}
      class={productListStyle}
      onRender={this.onRenderItem}
    >
    </i-repeater>
  }
}
