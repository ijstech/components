import { Container, Module, customElements, ControlElement, Styles, Panel } from '@ijstech/components';
import { IProduct, ProductType } from '../types';
import { customButtonStyle, customImageStyle, shadowHoveredStyle } from '../index.css';
import { formatNumber } from '../ultils';
const Theme = Styles.Theme.ThemeVars;

type onItemClickedCallback = (product: IProduct) => void;

export interface ProductElement extends ControlElement {
  product?: IProduct;
  type?: ProductType;
  onItemClicked?: onItemClickedCallback;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-product': ProductElement;
    }
  }
}

const DEFAULT_TYPE = 'all';

interface IProductItem {
  product?: IProduct;
  type?: ProductType;
}

@customElements('i-product')
export default class Product extends Module {
  private pnlProductItem: Panel;

  private _data: IProductItem = {};

  onItemClicked: onItemClickedCallback;

  get product() {
    return this._data.product;
  }

  set product(value: IProduct) {
    this._data.product = value;
  }

  get type() {
    return this._data.type || DEFAULT_TYPE;
  }

  set type(value: ProductType) {
    this._data.type = value || DEFAULT_TYPE;
  }

  get isAllType() {
    return this.type === DEFAULT_TYPE;
  }

  setData(data: IProductItem) {
    this._data = data;
    this.renderUI();
  }

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  private renderUI() {
    if (this.isAllType)
      this.renderAllType();
    else
      this.renderTopType();
  }

  private handleItemClick() {
    if (!this.product.link) return;
    window.open(this.product.link, '_blank')
    if (typeof this.onItemClicked === 'function') this.onItemClicked(this.product);
  }

  private renderAllType() {
    this.pnlProductItem.clearInnerHTML();
    this.pnlProductItem.append(
       <i-panel
        width='100%'
      >
        <i-image
          url={this.product?.image}
          display='block'
          width='100%'
          class={customImageStyle}
        >
        </i-image>
      </i-panel>,
      <i-vstack
        width='100%'
        overflow="hidden"
        gap={4}
      >
        <i-label
          visible={this.product?.isAvailable}
          caption='Materials available'
          font={{ "size": "13px", "weight": "500" }}
        >
        </i-label>
        <i-stack
          id="pnlName"
          alignItems='center'
          justifyContent="space-between"
          stack={{ grow: '1' }}
          overflow="hidden"
        >
          <i-label
            caption={this.product?.name}
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
              visible={!!this.product?.rating}
              caption={`${this.product?.rating || ''}`}
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
              caption={`(${formatNumber(this.product?.reviews || 0)})`}
              font={{ "size": "12px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
        </i-stack>
        <i-label
          caption={this.product?.seller}
          font={{ "size": "13px" }}
          opacity='0.7'
        >
        </i-label>
        <i-panel display="inline">
          <i-label
            caption={this.product?.price}
            font={{ "size": "16px", "weight": "500", color: Theme.colors.success.main }}
            display="inline"
          >
          </i-label>
          <i-label
            caption={this.product?.originalPrice}
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
            caption={`(${this.product?.discount})`}
            padding={{ left: 4 }}
            font={{ "size": "13px", "weight": "400" }}
            display="inline"
            visible={!!this.product?.discount}
            opacity='0.7'
          ></i-label>
        </i-panel>
      </i-vstack>,
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
    )
  }

  private renderTopType() {
    this.pnlProductItem.clearInnerHTML();
    const stars = this.product?.rating ? new Array(Math.ceil(this.product.rating)).fill(1) : []
    this.pnlProductItem.append(
      <i-icon
        name='heart'
        width={30}
        height={30}
        border={{ radius: '50%' }}
        fill={Theme.background.modal}
        padding={{ top: 8, left: 8, right: 8, bottom: 8 }}
        top={100}
        visible={false}
        right={10}
        zIndex={10}
        boxShadow={Theme.shadows[0]}
        background={{ color: '#fff' }}
        class='love-icon'
      ></i-icon>,
      <i-panel width='100%'>
        <i-image
          url={this.product?.image}
          display='block'
          width='100%'
          overflow='hidden'
        ></i-image>
      </i-panel>,
      <i-vstack width='100%' gap={6}>
        <i-label
          caption={this.product?.name}
          font={{ size: '13px', weight: '500' }}
          textOverflow='ellipsis'
        ></i-label>
        <i-hstack
          width='100%'
          alignItems='center'
          justifyContent='space-between'
        >
          <i-hstack alignItems='center' gap='4px'>
            <i-hstack alignItems='center'>
              {stars.map((item) => {
                return (
                  <i-icon
                    width='12px'
                    height='12px'
                    name='star'
                    fill={Theme.text.primary}
                    image={{ width: 12, height: 12 }}
                  ></i-icon>
                )
              })}
            </i-hstack>

            <i-label
              caption={`(${formatNumber(this.product?.reviews || 0)})`}
              font={{ size: '16px', weight: '400' }}
            ></i-label>
          </i-hstack>
        </i-hstack>
        <i-label
          caption={this.product?.price}
          font={{ size: '16px', weight: '500' }}
        ></i-label>
        <i-panel display='inline' margin={{ top: -3 }}>
          <i-label
            display='inline'
            caption={this.product?.originalPrice}
            font={{
              size: '13px',
              weight: '400',
              color: Theme.colors.success.main,
            }}
            textDecoration='line-through'
          ></i-label>
          <i-label
            display='inline'
            caption={`(${this.product?.discount})`}
            padding={{ left: 4 }}
            font={{
              size: '13px',
              weight: '400',
              color: Theme.colors.success.main,
            }}
          ></i-label>
        </i-panel>
        <i-label
          caption={this.product?.seller}
          font={{ size: '13px' }}
          opacity='0.7'
        ></i-label>
      </i-vstack>
    );
  }

  init() {
    super.init();
    this.onItemClicked = this.getAttribute('onItemClicked', true) || this.onItemClicked;
    const product = this.getAttribute('product', true);
    const type = this.getAttribute('type', true);
    if (product || type) this.setData({ product, type });
  }

  render() {
    return <i-vstack
      id="pnlProductItem"
      position='relative'
      width='100%'
      gap={16}
      overflow="hidden"
      justifyContent='space-between'
      cursor="pointer"
      class='picked-card'
      onClick={this.handleItemClick}
    >
    </i-vstack>
  }
}
