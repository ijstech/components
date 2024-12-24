import { Control, Repeater, Module, customElements, ControlElement, Label, Panel, Styles } from '@ijstech/components';
import { FilterModel } from './model';
import Selector from './selector';
import { buttonHoveredStyle } from '../index.css';

const Theme = Styles.Theme.ThemeVars;

export interface FilterElement extends ControlElement {
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'products-filter': FilterElement;
    }
  }
}

@customElements('products-filter')
export default class Filter extends Module {
  private model: FilterModel;

  get data() {
    return this.model.data;
  }

  private repeatCategory: Repeater;
  private lblShowCateMore: Label;
  private pnlLocation: Panel;
  private pnlPrices: Panel;
  private pnlSelectors: Panel;

  private renderUI() {
    this.repeatCategory.count = 5;
    this.lblShowCateMore.visible = this.model.categories?.length > 5;
    this.renderLocation();
    this.renderPrice();
    this.renderSelectors();
  }

  private onRenderCategories(parent: Control, index: number) {
    const data = this.model?.categories?.[index];
    if (!data) return;
    const el = parent.children?.[index]?.firstChild as Label;
    if (el) {
      el.caption = data.label;
      el.link.href = `/${data.value}`;
      el.link.target = '_blank';
    }
  };

  private onToggleCate(target: Label) {
    if (target.caption === 'Show more') {
      target.caption = 'Show less'
      this.repeatCategory.count = this.model.categories?.length;
    } else {
      target.caption = 'Show more'
      this.repeatCategory.count = 5;
    }
  }

  private renderLocation() {
    const options = this.model.locations;
    this.pnlLocation.appendChild(
      <i-radio-group
        position='relative'
        width='100%'
        selectedValue={this.data.location}
      >
        {
          options.map(option => {
            if (option.value === 'custom') {
              return <i-radio value={option.value}>
                <i-vstack
                  gap={4}
                >
                  <i-label caption={option.label} font={{ size: '13px' }} />
                  <i-combo-box
                    height={36}
                    border={{ radius: 6, width: '1px', style: 'solid', color: Theme.divider }}
                    placeholder="Enter location"
                    font={{ size: '13px' }}
                    items={[]}
                  ></i-combo-box>
                </i-vstack>
              </i-radio>
            }
            return <i-radio value={option.value} caption={option.label} font={{ size: '13px' }}></i-radio>
          })
        }
      </i-radio-group>
    )
  }

  private renderPrice() {
    const options = this.model.prices;
    this.pnlPrices.appendChild(
      <i-radio-group
        position='relative'
        width='100%'
        selectedValue={this.data.price}
      >
        {
          options.map(option => {
            if (option.value === 'custom') {
              return <i-radio value={option.value}>
                <i-vstack
                  gap={4}
                  maxWidth="69%"
                  overflow="hidden"
                >
                  <i-label caption={option.label} font={{ size: '13px' }} />
                  <i-hstack verticalAlignment="center" gap={4} overflow="hidden" maxWidth="100%">
                    <i-input
                      height={36}
                      border={{ radius: 6, width: '1px', style: 'solid', color: Theme.divider }}
                      placeholder="Min"
                      width="auto"
                      font={{ size: '13px' }}
                      inputType="number"
                      value={this.data.min ?? ''}
                    ></i-input>
                    <i-label font={{ size: '13px' }} caption="to"></i-label>
                    <i-input
                      height={36}
                      width="auto"
                      border={{ radius: 6, width: '1px', style: 'solid', color: Theme.divider }}
                      placeholder="Max"
                      font={{ size: '13px' }}
                      inputType="number"
                      value={this.data.max ?? ''}
                    ></i-input>
                    <i-button
                      border={{ radius: 24 }}
                      background={{ color: "transparent" }}
                      caption="Apply"
                      font={{ color: Theme.text.primary, size: '13px', weight: 500 }}
                      boxShadow="none"
                      height={36}
                      padding={{left: 9, right: 9}}
                      class={buttonHoveredStyle}
                    ></i-button>
                  </i-hstack>
                </i-vstack>
              </i-radio>
            }
            return <i-radio value={option.value} caption={option.label} font={{ size: '13px' }}></i-radio>
          })
        }
      </i-radio-group>
    )
  }

  private renderSelectors() {
    this.pnlSelectors.clearInnerHTML();
    const filters = this.model.getFilters();
    for (let filter of filters) {
      this.pnlSelectors.appendChild(
        <products-filter--selector
          display="block"
          width="100%"
          data={filter}
          selectedValue={this.data[filter.key]}
          onChange={this.onSelectorChanged}
        />
      )
    }
  }

  private onSelectorChanged(type: string, value: any) {
    console.log(type, value)
  }

  private onReset() {
    this.model.reset();
    this.renderUI();
  }

  init() {
    super.init();
    this.onSelectorChanged = this.onSelectorChanged.bind(this);
    this.model = new FilterModel();
    this.renderUI();
  }

  render() {
    return <i-vstack width="100%" height="100%" gap={18}>
      <i-hstack
        position='relative'
        width='100%'
        gap={8}
        alignItems='center'
        justifyContent='space-between'
        margin={{ "bottom": 6 }}
        stack={{ shrink: '0' }}
      >
        <i-label
          position='relative'
          caption='Filters'
          font={{ "size": "19px", "weight": "500" }}
        >
        </i-label>
        <i-button
          padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
          caption='Reset'
          border={{ "radius": "24px" }}
          font={{ "size": "12px", "weight": "500" }}
          class={buttonHoveredStyle}
          onClick={this.onReset}
        >
        </i-button>
      </i-hstack>
      <i-vstack stack={{ grow: '1' }} overflow={{ y: 'auto' }} gap="18px">
        <i-vstack
          position='relative'
          width='100%'
          gap={4}
        >
          <i-label
            position='relative'
            caption='Categories'
            font={{ "size": "13px", "weight": "600" }}
          >
          </i-label>
          <i-label
            position='relative'
            caption='All Categories'
            font={{ "size": "13px", "weight": "500" }}
          >
          </i-label>
          <i-vstack
            position='relative'
            width='100%'
            gap={4}
          >
            <i-repeater
              id='repeatCategory'
              position='relative'
              width='100%'
              display='block'
              count={3}
              onRender={this.onRenderCategories}
            >
              <i-label
                position='relative'
                caption='Home & Living'
                link={{ "href": "#", "target": "_blank" }}
                font={{ "size": "13px" }}
              >
              </i-label>
            </i-repeater>
            <i-label
              id='lblShowCateMore'
              position='relative'
              caption='Show more'
              textDecoration='underline'
              cursor='pointer'
              font={{ "size": "13px" }}
              onClick={this.onToggleCate}
            >
            </i-label>
          </i-vstack>
        </i-vstack>
        <i-vstack
          gap='4px'
          id="pnlLocation"
        >
          <i-label
            position='relative'
            caption='Shop location'
            font={{ "size": "13px", "weight": "600" }}
          >
          </i-label>
        </i-vstack>
        <i-vstack
          gap='4px'
          id="pnlPrices"
        >
          <i-label
            position='relative'
            caption='Price'
            font={{ "size": "13px", "weight": "600" }}
          >
          </i-label>
        </i-vstack>
        <i-vstack id="pnlSelectors" gap={18} />
      </i-vstack>
      <i-hstack
        stack={{ shrink: '0' }}
        height={60}
        padding={{top: 12, bottom: 12}}
      >
        <i-button
          caption="Show more"
          border={{ "radius": "24px" }}
          width='100%'
          padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
          font={{ "size": "12px", "weight": "600" }}
        ></i-button>
      </i-hstack>
    </i-vstack>
  }
}