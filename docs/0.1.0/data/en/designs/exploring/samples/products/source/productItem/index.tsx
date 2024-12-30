import { Container, Module, customElements, ControlElement, Styles, observable, Label } from '@ijstech/components';
import { IProduct } from '../types';
import { ProductModel } from './model';
import { customButtonStyle, customImageStyle, shadowHoveredStyle } from '../index.css';
import { formatNumber } from '../ultils';
const Theme = Styles.Theme.ThemeVars;

type onItemClickedCallback = (product: IProduct) => void;
type ProductType = 'top' | 'all';

export interface ProductElement extends ControlElement {
  product?: IProduct;
  type?: string;
  onItemClicked?: onItemClickedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-product': ProductElement;
    }
  }
}

@customElements('i-product')
export default class Product extends Module {
  private lblReviews: Label;
  private lblDiscount: Label;
  private lblRating: Label;

  private model: ProductModel; // TODO: fix this

  @observable('product')
  private _product: IProduct = {
    name: '',
    image: '',
    price: '',
    reviews: 0,
    seller: '',
    rating: 0
  };
  private _type: ProductType = 'all';

  onItemClicked: onItemClickedCallback;

  get product() {
    return this._product;
  }

  set product(value: IProduct) {
    this._product = value;
  }

  get type() {
    return this._type;
  }

  set type(value: ProductType) {
    this._type = value;
  }

  setData(data: IProduct) {
    this.product = data;
    this.renderProduct();
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  private renderProduct() {
    this.lblReviews.caption = `(${formatNumber(this.product.reviews || 0)})`;
    this.lblDiscount.caption = `(${this.product.discount})`;
    this.lblDiscount.visible = !!this.product?.discount;
    this.lblRating.caption = `${this.product.rating || ''}`;
  }

  private handleItemClick() {
    if (!this.product.link) return;
    window.open(this.product.link, '_blank')
    if (typeof this.onItemClicked === 'function') this.onItemClicked(this.product);
  }

  init() {
    super.init();
    this.onItemClicked = this.getAttribute('onItemClicked', true) || this.onItemClicked;
    this.model = new ProductModel();
    const product = this.getAttribute('product', true);
    this.type = this.getAttribute('type', true, 'all');
    if (product) this.setData(product);
  }

  render() {
    return <i-vstack
      position='relative'
      width='100%'
      gap={16}
      overflow="hidden"
      justifyContent='space-between'
      cursor="pointer"
      onClick={this.handleItemClick}
    >
      <i-panel
        width='100%'
      >
        <i-image
          url={this.product.image}
          display='block'
          width='100%'
          class={customImageStyle}
        >
        </i-image>
      </i-panel>
      <i-vstack
        width='100%'
        overflow="hidden"
        gap={4}
      >
        <i-label
          visible={this.product.isAvailable}
          caption='Materials available'
          font={{ "size": "13px", "weight": "500" }}
        >
        </i-label>
        <i-hstack
          alignItems='center'
          justifyContent="space-between"
          stack={{ grow: '1' }}
          overflow="hidden"
        >
          <i-label
            caption={this.product.name}
            font={{ "size": "13px", "weight": "500" }}
            maxWidth="60%"
            textOverflow="ellipsis"
          >
          </i-label>
          <i-hstack
            alignItems='center'
            gap="4px"
            justifyContent="end"
          >
            <i-label
              id="lblRating"
              visible={!!this.product.rating}
              caption=""
              font={{ "size": "13px", "weight": "500" }}
            >
            </i-label>
            <i-icon
              width='12px'
              height='12px'
              name='star'
              fill={Theme.text.primary}
              image={{ "width": 12, "height": 12 }}
            >
            </i-icon>
            <i-label
              id="lblReviews"
              caption=""
              font={{ "size": "12px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
        </i-hstack>
        <i-label
          caption={this.product.seller}
          font={{ "size": "13px" }}
          opacity='0.7'
        >
        </i-label>
        <i-panel display="inline">
          <i-label
            caption={this.product.price}
            font={{ "size": "16px", "weight": "500", color: Theme.colors.success.main }}
            display="inline"
          >
          </i-label>
          <i-label
            caption={this.product.originalPrice}
            padding={{ left: 4 }}
            font={{ "size": "13px", "weight": "400" }}
            textDecoration="line-through"
            display="inline"
            opacity='0.7'
            visible={!!this.product?.discount}
          >
          </i-label>
          <i-label
            id="lblDiscount"
            caption=""
            padding={{ left: 4 }}
            font={{ "size": "13px", "weight": "400" }}
            display="inline"
            opacity='0.7'
          ></i-label>
        </i-panel>
      </i-vstack>
      <i-hstack
        width='100%'
      >
        <i-button
          padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
          caption='Add to cart'
          border={{ "radius": "24px", "width": "2px", "style": "solid", "color": "var(--divider)" }}
          background={{ "color": "transparent" }}
          icon={{ "width": 12, "height": 12, "fill": "var(--text-primary)", "name": "plus" }}
          font={{ "size": "13px", "weight": "500" }}
          class={shadowHoveredStyle}
        >
        </i-button>
        <i-button
          padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
          caption='More like this'
          background={{ "color": "transparent" }}
          rightIcon={{ "name": "angle-right", "width": 12, "height": 12 }}
          border={{ "width": 0 }}
          boxShadow='none'
          font={{ "size": "13px", "weight": "500" }}
          class={customButtonStyle}
        >
        </i-button>
      </i-hstack>
    </i-vstack>
  }
}
