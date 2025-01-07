import { Module, observable } from '@ijstech/components'
import { ProductModel } from './model'
import ProductFilter from './productFilter/index'
import ProductList from './productList/index'

export default class Products extends Module {
  @observable()
  private model: ProductModel = new ProductModel();

  private productFilter: ProductFilter

  private onFilterChanged(data: any) {
    this.model.filteredProducts = this.model.handlFilter(data);
    return this.model?.filteredProducts?.length || 0;
  }

  async init() {
    super.init()
    this.model.topProducts = this.model.getTopProducts();
    this.model.filteredProducts = this.model.handlFilter(this.productFilter.filteredData);
    this.model.options = this.model.getOptions();
    this.productFilter.data = this.model.options;
  }

  render() {
    return (
      <i-vstack
        width='100%'
        gap={18}
        padding={{ left: 16, right: 16, top: 16, bottom: 16 }}
        background={{ color: 'var(--background-main)' }}
      >
        <i-product-filter
          id="productFilter"
          display="block"
          width="100%"
          onChanged={this.onFilterChanged}
        ></i-product-filter>
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