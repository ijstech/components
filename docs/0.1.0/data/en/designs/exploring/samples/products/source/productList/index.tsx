import {
  Control, Repeater,
  Container,
  Module,
  customElements,
  ControlElement,
  observable
} from '@ijstech/components'
import Product from '../productItem/index'
import { IProduct, ProductType } from '../types';
import { customTopProductsStyle, productListStyle } from '../index.css';

export interface ProductListElement extends ControlElement {
  data?: IProduct[];
  type?: ProductType;
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

  @observable('data', true)
  private _data: IProduct[] = [];
  private _type: ProductType = 'all';

  set data(value: IProduct[]) {
    this._data = value || [];
  }

  get data() {
    return this._data || [];
  }

  get type() {
    return this._type || 'all';
  }

  set type(value: ProductType) {
    this._type = value || 'all';
    this.classList.remove(productListStyle, customTopProductsStyle);
    this.classList.add(this.type === 'all' ? productListStyle : customTopProductsStyle);
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  private onRenderItem(parent: Control, index: number) {
    const childEl = parent.children?.[index]?.firstChild as Product;
    const data = this.data[index];
    if (childEl && data) {
      childEl.setData({ product: data, type: this.type });
    }
  };

  async init() {
    const type = this.getAttribute('type', true, 'all');
    if (type) this.type = type;
    super.init()
    this.onRenderItem = this.onRenderItem.bind(this);

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
      data={this.data}
      gap={16}
      onRender={this.onRenderItem}
    >
    </i-repeater>
  }
}
