import { Module, Styles, HStack, GridLayout, Panel, Control } from '@ijstech/components';
import { ProductModel } from './model';
import { Filter, IOption } from './components/index';
import { afterBlurStyle, beforeBlurStyle, customImageStyle, customTopProductsStyle, buttonHoveredStyle } from './index.css';

const Theme = Styles.Theme.ThemeVars;

export default class Products extends Module {
  private model: ProductModel;

  private filteredData: { [key: string]: any } = {
    itemType: ''
  };


  private pnlOptions: HStack;
  private productsGrid: GridLayout;
  private pnlPicked: GridLayout;
  private filterEl: Filter;
  private pnlFilter: Panel;
  private leftIcon: Panel;
  private rightIcon: Panel;
  private pnlFilterWrap: Panel;
  private leftBlur: Panel;
  private rightBlur: Panel;

  private scaleFilter() {
    const hasOverflow = this.pnlFilter.scrollWidth > this.pnlFilter.clientWidth;
    if (hasOverflow) {
      this.rightBlur.visible = true;
      this.leftIcon.visible = false;
      this.rightIcon.visible = true;
    }
    this.pnlFilter.scrollLeft = 0;
  }

  private onClickLeftIcon() {
    const hasOverflow = this.pnlFilter.scrollWidth > this.pnlFilter.clientWidth;
    if (hasOverflow) {
      this.leftIcon.visible = false;
      this.rightIcon.visible = true;
      this.rightBlur.visible = false;
      this.pnlFilter.scrollLeft -= this.pnlFilter.clientWidth;
      if (this.pnlFilter.scrollLeft < 0) this.pnlFilter.scrollLeft = 0;
      if (this.pnlFilter.scrollLeft === 0) {
        this.leftBlur.visible = false;
      } else {
        this.leftBlur.visible = true;
      }
    }
  }

  private onClickRightIcon() {
    const hasOverflow = this.pnlFilter.scrollWidth > this.pnlFilter.clientWidth;
    this.leftBlur.visible = false;
    if (hasOverflow) {
      this.leftIcon.visible = true;
      this.rightIcon.visible = false;
      this.pnlFilter.scrollLeft += this.pnlFilter.clientWidth;
      if (this.pnlFilter.scrollLeft > this.pnlFilter.scrollWidth) this.pnlFilter.scrollLeft = this.pnlFilter.scrollWidth;
      if (this.pnlFilter.scrollLeft === this.pnlFilter.scrollWidth) {
        this.rightBlur.visible = false;
      } else {
        this.rightBlur.visible = true;
      }
    }
  }

  private renderProducts() {
    this.productsGrid.clearInnerHTML()
    for (let product of this.model.products) {
      this.productsGrid.appendChild(
        <i-vstack
          position='relative'
          width='100%'
          gap={16}
          overflow="hidden"
          justifyContent='space-between'
          cursor="pointer"
          onClick={() => {
            if (!product.link) return;
            window.open(product.link, '_blank')
          }}
        >
          <i-panel
            width='100%'
          >
            <i-image
              url={product.image}
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
              visible={product.isAvailable}
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
                caption={product.name}
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
                  visible={!!product.rating}
                  caption={`${product.rating}`}
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
                  caption={`(${product.reviews || 0})`}
                  font={{ "size": "12px", "weight": "400" }}
                >
                </i-label>
              </i-hstack>
            </i-hstack>
            <i-label
              caption={product.seller}
              font={{ "size": "13px" }}
              opacity='0.7'
            >
            </i-label>
            <i-panel display="inline">
              <i-label
                caption={product.price}
                font={{ "size": "16px", "weight": "500", color: Theme.colors.success.main }}
                display="inline"
              >
              </i-label>
              <i-label
                caption={product.original_price}
                padding={{ left: 4 }}
                font={{ "size": "13px", "weight": "400" }}
                textDecoration="line-through"
                display="inline"
                opacity='0.7'
                visible={!!product?.discount}
              >
              </i-label>
              <i-label
                caption={`(${product.discount})`}
                padding={{ left: 4 }}
                font={{ "size": "13px", "weight": "400" }}
                display="inline"
                opacity='0.7'
                visible={!!product?.discount}
              ></i-label>
            </i-panel>

            {/* <i-label
              caption='Free shipping'
              font={{ "size": "12px" }}
              opacity='0.7'
            >
            </i-label> */}
          </i-vstack>
          <i-hstack
            width='100%'
          >
            <i-button
              padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
              caption='Add to cart'
              border={{ "radius": "24px" }}
              icon={{ "width": 12, "height": 12, "fill": "var(--text-primary)", "name": "plus" }}
              font={{ "size": "13px", "weight": "500" }}
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
            >
            </i-button>
          </i-hstack>
        </i-vstack>
      )
    }
  }

  private renderMostPicked() {
    const products = this.model.getTopProducts();
    this.pnlPicked.clearInnerHTML()
    for (const product of products) {
      const stars = new Array(Math.ceil(product.rating)).fill(1);
      this.pnlPicked.appendChild(
        <i-vstack
          position='relative'
          gap={16}
          cursor="pointer"
          class="picked-card"
          onClick={() => {
            if (!product.link) return;
            window.open(product.link, '_blank')
          }}
        >
          <i-icon
            name="heart"
            width={30}
            height={30}
            border={{ radius: '50%' }}
            fill={Theme.background.modal}
            padding={{ top: 8, left: 8, right: 8, bottom: 8 }}
            top={9999}
            right={10}
            zIndex={10}
            boxShadow={Theme.shadows[0]}
            background={{ color: '#fff' }}
            class="love-icon"
          ></i-icon>
          <i-panel
            width='100%'
          >
            <i-image
              url={product.image}
              display='block'
              width='100%'
              overflow="hidden"
            >
            </i-image>
          </i-panel>
          <i-vstack
            width='100%'
            gap={6}
          >
            <i-label
              caption={product.name}
              font={{ "size": "13px", "weight": "500" }}
              textOverflow="ellipsis"
            >
            </i-label>
            <i-hstack
              width='100%'
              alignItems='center'
              justifyContent="space-between"
            >
              <i-hstack
                alignItems='center'
                gap="4px"
              >
                <i-hstack
                  alignItems='center'
                >
                  {
                    stars.map(item => {
                      return <i-icon
                        width='12px'
                        height='12px'
                        name='star'
                        fill={Theme.text.primary}
                        image={{ "width": 12, "height": 12 }}
                      >
                      </i-icon>
                    })
                  }
                </i-hstack>

                <i-label
                  caption={`(${product.reviews})`}
                  font={{ "size": "16px", "weight": "400" }}
                >
                </i-label>
              </i-hstack>
            </i-hstack>
            <i-label
              caption={product.price}
              font={{ "size": "16px", "weight": "500" }}
            >
            </i-label>
            <i-panel display="inline" margin={{ top: -3 }}>
              <i-label
                display="inline"
                caption={product.original_price}
                font={{ "size": "13px", "weight": "400", color: Theme.colors.success.main }}
                textDecoration="line-through"
              >
              </i-label>
              <i-label
                display="inline"
                caption={`(${product.discount})`}
                padding={{ left: 4 }}
                font={{ "size": "13px", "weight": "400", color: Theme.colors.success.main }}
              >
              </i-label>
            </i-panel>
            <i-label
              caption={product.seller}
              font={{ "size": "13px" }}
              opacity='0.7'
            >
            </i-label>
          </i-vstack>
        </i-vstack>
      )
    }
  }

  private renderOptions() {
    this.pnlOptions.clearInnerHTML();
    const options = this.model.getOptions();
    for (const option of options) {
      this.pnlOptions.appendChild(
        <i-hstack
          alignItems='center'
          minWidth='36px'
          gap={8}
          minHeight='36px'
          padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
          border={{ "radius": "24px", "width": "1px", "color": Theme.divider }}
          cursor="pointer"
          stack={{ shrink: '0' }}
          onClick={(target: Control) => this.onSelectOption(target, option)}
        >
          <i-label
            caption={option.label}
            font={{ "size": "12px", "weight": "500" }}
          >
          </i-label>
          <i-icon
            width='12px'
            height='12px'
            name='times'
            visible={false}
            cursor="pointer"
            onClick={(target: Control) => this.onSelectOption(target.parent, option)}
          >
          </i-icon>
        </i-hstack>
      )
    }
  }

  private onSelectOption(target: Control, option: IOption) {
    const value = option.value;
    if (this.filteredData['itemType'] === value) {
      target.background = { color: 'transparent' };
      target.font = { color: Theme.text.primary, size: '13px', weight: 600 };
      const closeIcon = target.querySelector('i-icon') as Control;
      if (closeIcon) closeIcon.visible = false;
      this.filteredData['itemType'] = '';
    } else {
      target.background = { color: Theme.colors.primary.main };
      target.font = { color: Theme.colors.primary.dark, size: '13px', weight: 600 };
      this.filteredData['itemType'] = value;
      const closeIcon = target.querySelector('i-icon') as Control;
      if (closeIcon) closeIcon.visible = true;
    }
  }

  private showFilter() {
    if (!this.filterEl) {
      this.filterEl = new Filter(undefined, {
      });
    }
    this.filterEl.openModal({
      width: '50dvw',
      height: '100dvh',
      popupPlacement: 'left',
      overflow: "hidden",
      // class: closeIconStyle
    })
  }

  private handleFilter() {}

  init() {
    super.init();
    this.model = new ProductModel(this);
    this.model.fetchProducts();
    this.renderOptions();
    this.renderMostPicked();
    this.renderProducts();
    this.scaleFilter();
  }

  render() {
    return <i-vstack
      width='100%'
      gap={18}
      padding={{ "left": 16, "right": 16, "top": 16, "bottom": 16 }}
      background={{ "color": "var(--background-main)" }}
    >
      <i-hstack
        width='100%'
        gap={16}
        alignItems='center'
        justifyContent='center'
        padding={{ "top": 8 }}
        overflow='hidden'
        position='relative'
        id='pnlFilterWrap'
      >
        <i-panel id="leftBlur" class={beforeBlurStyle} visible={false}></i-panel>
        <i-panel
          id='leftIcon'
          cursor='pointer'
          visible={false}
          left={0}
          zIndex={10}
          onClick={this.onClickLeftIcon}
        >
          <i-icon
            name='angle-left'
            width={20}
            height={20}
            fill='var(--text-primary)'
            cursor='pointer'
          >
          </i-icon>
        </i-panel>
        <i-hstack
          id='pnlFilter'
          alignItems='center'
          maxWidth='70%'
          overflow='hidden'
          position='relative'
        >
          <i-hstack
            alignItems='center'
            maxWidth='100%'
            gap={12}
          >
            <i-button
              icon={{ "name": "sliders-h", "width": 13, "height": 13 }}
              caption='All Filters'
              minHeight={36}
              border={{ "radius": "24px", "width": "2px", "style": "solid", "color": "var(--divider)" }}
              padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
              boxShadow='none'
              font={{ "size": "12px", "weight": "600" }}
              background={{ "color": "transparent" }}
              stack={{ "shrink": "0" }}
              onClick={this.showFilter}
            >
            </i-button>
            <i-hstack
              id='pnlOptions'
              gap={12}
              alignItems='center'
            >
            </i-hstack>
          </i-hstack>
          <i-panel id="rightBlur" class={afterBlurStyle} visible={false}></i-panel>
          <i-panel
            id='rightIcon'
            cursor='pointer'
            visible={false}
            right={0}
            top={10}
            zIndex={10}
            onClick={this.onClickRightIcon}
          >
            <i-icon
              name='angle-right'
              width={20}
              height={20}
              fill='var(--text-primary)'
              cursor='pointer'
            >
            </i-icon>
          </i-panel>
        </i-hstack>
        <i-hstack
          position='relative'
          width='100%'
          gap={12}
          stack={{ "basis": "30%", "shrink": "0" }}
          alignItems='center'
          justifyContent="end"
        >
          <i-hstack
            gap={4}
            verticalAlignment='center'
          >
            <i-label
              caption='153 results, with ads'
              font={{ "size": "12px", "weight": 300 }}
              display='inline'
            >
            </i-label>
            <i-icon
              name='question-circle'
              width={12}
              height={12}
              tooltip={{ "content": "Content" }}
              padding={{ "left": 4 }}
              stack={{ "shrink": "0" }}
            >
            </i-icon>
          </i-hstack>
          <i-button
            padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
            caption='Most relevant'
            stack={{ "shrink": "0" }}
            border={{ "radius": "24px" }}
            boxShadow='none'
            background={{ "color": "transparent" }}
            rightIcon={{ "width": 12, "height": 12, "fill": "var(--text-primary)", "name": "caret-down" }}
            font={{ "size": "12px", "weight": "600" }}
            class={buttonHoveredStyle}
          >
          </i-button>
        </i-hstack>
      </i-hstack>
      <i-hstack
        position='relative'
        width='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        <i-label
          position='relative'
          caption="Etsy's Picks"
          font={{ "size": "19px", "weight": "500" }}
        >
        </i-label>
        <i-button
          minWidth='36px'
          minHeight='36px'
          padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
          caption='See more'
          border={{ "radius": "24px", "width": "2px", "style": "solid", "color": "var(--divider)" }}
          background={{ "color": "transparent" }}
          font={{ "color": "var(--text-primary)" }}
          boxShadow='none'
        >
        </i-button>
      </i-hstack>
      <i-grid-layout
        id='pnlPicked'
        class={customTopProductsStyle}
        width='100%'
        gap={{ "column": 16, "row": 16 }}
        padding={{ "bottom": 16 }}
        templateColumns={["repeat(6, minmax(0, 1fr))"]}
        border={{ "bottom": { "width": "1px", "style": "solid", "color": "var(--divider)" } }}
        mediaQueries={[{ "maxWidth": "767px", "properties": { "templateColumns": ["1fr"], "templateRows": ["auto"] } }]}
      >
      </i-grid-layout>
      <i-grid-layout
        id='productsGrid'
        width='100%'
        templateColumns={["repeat(4, minmax(0, 1fr))"]}
        templateRows={["auto"]}
        gap={{ "row": "16px", "column": "16px" }}
        mediaQueries={[{ "maxWidth": "767px", "properties": { "templateColumns": ["1fr"], "templateRows": ["auto"] } }]}
      >
      </i-grid-layout>
    </i-vstack>
  }
} 