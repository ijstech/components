import {
  Module,
  Styles,
  HStack,
  GridLayout,
  Panel,
  Control
} from '@ijstech/components'
import { afterBlurStyle, beforeBlurStyle, buttonHoveredStyle, customTopProductsStyle } from './index.css'
import { ProductModel } from './model'
import ProductFilter from './productFilter/index'
import ProductList from './productList/index'
import { IOption } from './types'
import { formatNumber } from './ultils'

const Theme = Styles.Theme.ThemeVars

export default class Products extends Module {
  private model: ProductModel

  private itemType: string[] = []

  private pnlOptions: HStack
  private pnlPicked: GridLayout
  private filterEl: ProductFilter
  private pnlFilter: Panel
  private leftIcon: Panel
  private rightIcon: Panel
  private leftBlur: Panel
  private rightBlur: Panel
  private productList: ProductList

  private scaleFilter() {
    if (window.matchMedia('(max-width: 480px)').matches) {
      return
    }

    const hasOverflow = this.pnlFilter.scrollWidth > this.pnlFilter.clientWidth
    if (hasOverflow) {
      this.rightBlur.visible = true
      this.leftIcon.visible = false
      this.rightIcon.visible = true
    }
    this.pnlFilter.scrollLeft = 0
  }

  private onClickLeftIcon() {
    const scrollWidth = this.pnlFilter.scrollWidth
    const clientWidth = this.pnlFilter.clientWidth

    const hasOverflow = scrollWidth > clientWidth

    this.rightBlur.visible = hasOverflow
    this.rightIcon.visible = hasOverflow

    if (hasOverflow) {
      this.pnlFilter.scrollLeft -= clientWidth

      if (this.pnlFilter.scrollLeft < 0) this.pnlFilter.scrollLeft = 0

      const isStart = this.pnlFilter.scrollLeft === 0
      this.leftBlur.visible = !isStart
      this.leftIcon.visible = !isStart
    }
  }

  private onClickRightIcon() {
    const scrollWidth = this.pnlFilter.scrollWidth
    const clientWidth = this.pnlFilter.clientWidth

    const hasOverflow = scrollWidth > clientWidth
    this.leftBlur.visible = hasOverflow
    this.leftIcon.visible = hasOverflow

    if (hasOverflow) {
      this.pnlFilter.scrollLeft += clientWidth
      if (this.pnlFilter.scrollLeft > scrollWidth)
        this.pnlFilter.scrollLeft = scrollWidth
      const isEnd = this.pnlFilter.scrollLeft + clientWidth >= scrollWidth

      this.rightBlur.visible = !isEnd
      this.rightIcon.visible = !isEnd
    }
  }

  private renderMostPicked() {
    const products = this.model.getTopProducts()
    this.pnlPicked.clearInnerHTML()
    for (const product of products) {
      const stars = new Array(Math.ceil(product.rating)).fill(1)
      this.pnlPicked.appendChild(
        <i-vstack
          position='relative'
          gap={16}
          width='100%'
          cursor='pointer'
          class='picked-card'
          onClick={() => {
            if (!product.link) return
            window.open(product.link, '_blank')
          }}
        >
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
          ></i-icon>
          <i-panel width='100%'>
            <i-image
              url={product.image}
              display='block'
              width='100%'
              overflow='hidden'
            ></i-image>
          </i-panel>
          <i-vstack width='100%' gap={6}>
            <i-label
              caption={product.name}
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
                  caption={`(${formatNumber(product.reviews || 0)})`}
                  font={{ size: '16px', weight: '400' }}
                ></i-label>
              </i-hstack>
            </i-hstack>
            <i-label
              caption={product.price}
              font={{ size: '16px', weight: '500' }}
            ></i-label>
            <i-panel display='inline' margin={{ top: -3 }}>
              <i-label
                display='inline'
                caption={product.originalPrice}
                font={{
                  size: '13px',
                  weight: '400',
                  color: Theme.colors.success.main,
                }}
                textDecoration='line-through'
              ></i-label>
              <i-label
                display='inline'
                caption={`(${product.discount})`}
                padding={{ left: 4 }}
                font={{
                  size: '13px',
                  weight: '400',
                  color: Theme.colors.success.main,
                }}
              ></i-label>
            </i-panel>
            <i-label
              caption={product.seller}
              font={{ size: '13px' }}
              opacity='0.7'
            ></i-label>
          </i-vstack>
        </i-vstack>
      )
    }
  }

  private renderOptions() {
    this.pnlOptions.clearInnerHTML()
    const options = this.model.getOptions()
    for (const option of options) {
      this.pnlOptions.appendChild(
        <i-hstack
          alignItems='center'
          minWidth='36px'
          gap={8}
          minHeight='36px'
          padding={{ top: '9px', right: '15px', bottom: '9px', left: '15px' }}
          border={{ radius: '24px', width: '1px', color: Theme.divider }}
          cursor='pointer'
          stack={{ shrink: '0' }}
          onClick={(target: Control) => this.onSelectOption(target, option)}
        >
          <i-label
            caption={option.label}
            font={{ size: '12px', weight: '500' }}
          ></i-label>
          <i-icon
            width='12px'
            height='12px'
            name='times'
            visible={false}
            cursor='pointer'
            onClick={(target: Control) =>
              this.onSelectOption(target.parent, option)
            }
          ></i-icon>
        </i-hstack>
      )
    }
  }

  private onSelectOption(target: Control, option: IOption) {
    const value = option.value
    const findedIndex = this.itemType.findIndex((item) => item === value)
    if (findedIndex > -1) {
      target.background = { color: 'transparent' }
      target.font = { color: Theme.text.primary, size: '13px', weight: 600 }
      const closeIcon = target.querySelector('i-icon') as Control
      if (closeIcon) closeIcon.visible = false
      this.itemType.splice(findedIndex, 1)
    } else {
      target.background = { color: Theme.colors.primary.main }
      target.font = {
        color: Theme.colors.primary.dark,
        size: '13px',
        weight: 600,
      }
      this.itemType.push(value)
      const closeIcon = target.querySelector('i-icon') as Control
      if (closeIcon) closeIcon.visible = true
    }
  }

  private showFilter() {
    if (!this.filterEl) {
      this.filterEl = new ProductFilter(undefined, {
        onChanged: this.onFilterChanged.bind(this),
        onClose: this.onCloseFilter.bind(this),
      })
    }
    this.filterEl.openModal({
      width: '50dvw',
      height: '100dvh',
      popupPlacement: 'left',
      overflow: 'hidden',
      closeIcon: null,
      mediaQueries: [
        {
          maxWidth: '767px',
          properties: {
            width: '100dvw',
            border: { radius: 0 },
          },
        },
      ],
    })
  }

  private onFilterChanged(type: string) {
    // TODO: render options
    if (type === 'reset') {
      this.renderOptions()
    }
    const filteredData = this.model.filteredProducts(this.filterEl.data);
    this.productList.data = filteredData;

    return filteredData?.length;
  }

  private onCloseFilter() {
    this.filterEl.closeModal()
  }

  init() {
    super.init()
    this.model = new ProductModel()
    this.renderOptions()
    this.renderMostPicked()
    this.productList.data = this.model.products;
    this.scaleFilter()
  }

  render() {
    return (
      <i-vstack
        width='100%'
        gap={18}
        padding={{ left: 16, right: 16, top: 16, bottom: 16 }}
        background={{ color: 'var(--background-main)' }}
      >
        <i-hstack
          width='100%'
          gap={16}
          alignItems='center'
          horizontalAlignment='space-between'
          padding={{ top: 8 }}
          overflow='hidden'
          position='relative'
        >
          <i-panel
            id='leftBlur'
            class={beforeBlurStyle}
            visible={false}
          ></i-panel>
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
            ></i-icon>
          </i-panel>
          <i-hstack alignItems='center' maxWidth='70%' position='relative'>
            <i-hstack
              id='pnlFilter'
              alignItems='center'
              maxWidth='100%'
              overflow='hidden'
              gap={12}
            >
              <i-button
                icon={{ name: 'sliders-h', width: 13, height: 13 }}
                caption='All Filters'
                minHeight={36}
                border={{
                  radius: '24px',
                  width: '2px',
                  style: 'solid',
                  color: 'var(--divider)',
                }}
                padding={{
                  top: '9px',
                  right: '15px',
                  bottom: '9px',
                  left: '15px',
                }}
                boxShadow='none'
                font={{ size: '12px', weight: '600' }}
                background={{ color: 'transparent' }}
                stack={{ shrink: '0' }}
                onClick={this.showFilter}
                mediaQueries={[
                  { maxWidth: '480px', properties: { visible: false } },
                ]}
              ></i-button>
              <i-button
                visible={false}
                icon={{ name: 'sliders-h', width: 13, height: 13 }}
                minHeight={36}
                border={{
                  radius: '24px',
                  width: '2px',
                  style: 'solid',
                  color: 'var(--divider)',
                }}
                padding={{
                  top: '9px',
                  right: '15px',
                  bottom: '9px',
                  left: '15px',
                }}
                boxShadow='none'
                font={{ size: '12px', weight: '600' }}
                background={{ color: 'transparent' }}
                stack={{ shrink: '0' }}
                onClick={this.showFilter}
                mediaQueries={[
                  { maxWidth: '480px', properties: { visible: true } },
                ]}
              ></i-button>
              <i-hstack
                id='pnlOptions'
                gap={12}
                alignItems='center'
                mediaQueries={[
                  { maxWidth: '480px', properties: { visible: false } },
                ]}
              ></i-hstack>
            </i-hstack>
            <i-panel
              id='rightBlur'
              class={afterBlurStyle}
              visible={false}
            ></i-panel>
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
              ></i-icon>
            </i-panel>
          </i-hstack>
          <i-hstack
            position='relative'
            width='100%'
            gap={12}
            stack={{ basis: '30%', shrink: '0' }}
            alignItems='center'
            justifyContent='end'
            mediaQueries={[
              {
                maxWidth: '480px',
                properties: { stack: { basis: 'auto', shrink: '1' } },
              },
            ]}
          >
            <i-hstack gap={4} verticalAlignment='center'>
              <i-label
                caption='153 results, with ads'
                font={{ size: '12px', weight: 300 }}
                display='inline'
              ></i-label>
              <i-icon
                name='question-circle'
                width={12}
                height={12}
                tooltip={{ content: 'Content' }}
                padding={{ left: 4 }}
                stack={{ shrink: '0' }}
              ></i-icon>
            </i-hstack>
            <i-button
              padding={{
                top: '9px',
                right: '15px',
                bottom: '9px',
                left: '15px',
              }}
              caption='Most relevant'
              stack={{ shrink: '0' }}
              border={{ radius: '24px' }}
              boxShadow='none'
              background={{ color: 'transparent' }}
              rightIcon={{
                width: 12,
                height: 12,
                fill: 'var(--text-primary)',
                name: 'caret-down',
              }}
              font={{ size: '12px', weight: '600' }}
              class={buttonHoveredStyle}
            ></i-button>
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
            font={{ size: '19px', weight: '500' }}
          ></i-label>
          <i-button
            minWidth='36px'
            minHeight='36px'
            padding={{ top: '9px', right: '15px', bottom: '9px', left: '15px' }}
            caption='See more'
            border={{
              radius: '24px',
              width: '2px',
              style: 'solid',
              color: 'var(--divider)',
            }}
            background={{ color: 'transparent' }}
            font={{ color: 'var(--text-primary)' }}
            boxShadow='none'
          ></i-button>
        </i-hstack>
        <i-grid-layout
          id='pnlPicked'
          class={customTopProductsStyle}
          width='100%'
          gap={{ row: '16px', column: '16px' }}
          padding={{ bottom: 16 }}
          templateColumns={['repeat(6, minmax(0, 1fr))']}
          autoFillInHoles={true}
          border={{
            bottom: { width: '1px', style: 'solid', color: 'var(--divider)' },
          }}
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: { templateColumns: ['1fr'], templateRows: ['auto'] },
            },
            {
              minWidth: '768px',
              maxWidth: '1024px',
              properties: { templateColumns: ['repeat(3, minmax(0, 1fr))'] },
            },
          ]}
        ></i-grid-layout>
        <i-product-list
          id="productList"
          display='block'
          width='100%'
        ></i-product-list>
      </i-vstack>
    )
  }
}