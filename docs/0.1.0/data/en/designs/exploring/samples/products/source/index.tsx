import {
  Module,
  Repeater,
  Panel,
  Control,
  observable
} from '@ijstech/components'
import { afterBlurStyle, beforeBlurStyle, buttonHoveredStyle, customOptionStyle } from './index.css'
import { ProductModel } from './model'
import ProductFilter from './productFilter/index'
import ProductList from './productList/index'
import ProductOption from './productOption/index'
import { IOption } from './types'

export default class Products extends Module {
  @observable()
  private model: ProductModel = new ProductModel();

  private optionsRepeater: Repeater;
  private filterEl: ProductFilter
  private pnlFilter: Panel
  private leftIcon: Panel
  private rightIcon: Panel
  private leftBlur: Panel
  private rightBlur: Panel

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
    const options = this.model.getOptions();

    if (this.filterEl.data && type !== 'reset') {
      const values = Object.values(this.filterEl.data);
      let flattenValues: any[] = [];

      for (const value of values) {
        if (Array.isArray(value)) {
          flattenValues = flattenValues.concat(value);
        } else if (value !== undefined && value !== null) {
          flattenValues.push(value);
        }
      }

      for (const value of flattenValues) {
        const findedOption = options.find(option => option.value === value?.value);
        if (findedOption) findedOption.selected = true;
        else if (value?.value) {
          options.unshift({
            value: value?.value,
            label: value?.label,
            group: value?.group,
            selected: true
          })
        }
      }
    }

    this.model.options = options;
    this.model.filteredProducts = this.model.handlFilter(this.filterEl.data);

    return this.model?.filteredProducts?.length || 0;
  }

  private onCloseFilter() {
    this.filterEl.closeModal()
  }

  private onSelectOption(target: Control, option: IOption) {
    this.filterEl.updateData(option);
  }

  private onRenderOption(parent: Control, index: number) {
    const childEl = parent.children?.[index] as ProductOption;
    const data = this.model.options?.[index];

    if (childEl && data) {
      childEl.setData(data);
      childEl.onSelectOption = this.onSelectOption.bind(this)
    }
  };

  async init() {
    super.init()
    this.model.topProducts = this.model.getTopProducts();
    this.model.filteredProducts = this.model.handlFilter(this.filterEl?.data);

    const optionEl = document.createElement('i-product-option') as ProductOption;
    optionEl.stack = {shrink: '0'};
    this.optionsRepeater.add(optionEl);
    this.model.options = this.model.getOptions();
    this.scaleFilter();
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
                  color: 'var(--divider)'
                }}
                padding={{
                  top: '9px',
                  right: '15px',
                  bottom: '9px',
                  left: '15px'
                }}
                boxShadow='none'
                font={{ size: '12px', weight: '600' }}
                background={{ color: 'transparent' }}
                stack={{ shrink: '0' }}
                onClick={this.showFilter}
                mediaQueries={[
                  { maxWidth: '480px', properties: { visible: false } }
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
                  color: 'var(--divider)'
                }}
                padding={{
                  top: '9px',
                  right: '15px',
                  bottom: '9px',
                  left: '15px'
                }}
                boxShadow='none'
                font={{ size: '12px', weight: '600' }}
                background={{ color: 'transparent' }}
                stack={{ shrink: '0' }}
                onClick={this.showFilter}
                mediaQueries={[
                  { maxWidth: '480px', properties: { visible: true } }
                ]}
              ></i-button>
              <i-repeater
                id="optionsRepeater"
                gap={12}
                layout="horizontal"
                data={this.model.options}
                mediaQueries={[
                  { maxWidth: '480px', properties: { visible: false } }
                ]}
                class={customOptionStyle}
                onRender={this.onRenderOption}
              >
              </i-repeater>
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
                properties: { stack: { basis: 'auto', shrink: '1' } }
              }
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
                left: '15px'
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
                name: 'caret-down'
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
              color: 'var(--divider)'
            }}
            background={{ color: 'transparent' }}
            font={{ color: 'var(--text-primary)' }}
            boxShadow='none'
          ></i-button>
        </i-hstack>
        <i-product-list
          id="topList"
          display='block'
          width='100%'
          data={this.model.topProducts}
          type="top"
        ></i-product-list>
        <i-product-list
          id="productList"
          display='block'
          data={this.model.filteredProducts}
          width='100%'
        ></i-product-list>
      </i-vstack>
    )
  }
}