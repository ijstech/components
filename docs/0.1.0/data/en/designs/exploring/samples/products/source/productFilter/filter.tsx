import {
  Control,
  Repeater,
  Module,
  customElements,
  ControlElement,
  Label,
  Panel,
  Styles,
  RadioGroup,
  ComboBox,
  Input,
  Button
} from '@ijstech/components'
import { FilterModel } from './model'
import Selector from './selector'
import { buttonHoveredStyle } from '../index.css'
import { IOption } from '../types'

const Theme = Styles.Theme.ThemeVars

type onChangedCallback = (type: string) => number
type onCloseCallback = () => void

interface ProductFilterModalElement extends ControlElement {
  onChanged?: onChangedCallback
  onClose?: onCloseCallback
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-product-filter--modal': ProductFilterModalElement
    }
  }
}

@customElements('i-product-filter--modal')
export default class ProductFilterModal extends Module {
  private btnShowResults: Button;

  private model: FilterModel

  private inputMin: Input
  private inputMax: Input

  onChanged?: onChangedCallback
  onClose?: onCloseCallback

  get data() {
    return this.model.data
  }

  updateData(option: IOption) {
    const group = option.group;
    if (group) {
      const filters = this.model.getFilters();
      const isRadio = filters.find(item => item.key === group)?.isRadio;
      if (isRadio) {
        this.model.data[group] = option.selected ? option : undefined;
      } else {
        const value = this.model.data[group];
        if (option.selected) {
          if (!value) this.model.data[group] = [option];
          else if (value.findIndex(item => item.value === option.value) === -1) {
            value.push(option);
          }
        } else if (value) {
          const findedIndex = value.findIndex(item => item.value === option.value);
          if (findedIndex > -1) {
            value.splice(findedIndex, 1);
          }
        }
      }

      this.renderSelectors();
      if (typeof this.onChanged === 'function') {
        this.onChanged(group);
      }
    }
  }

  private repeatCategory: Repeater
  private lblShowCateMore: Label
  private pnlLocation: Panel
  private pnlPrices: Panel
  private pnlSelectors: Panel

  private renderUI() {
    this.repeatCategory.count = 5
    this.lblShowCateMore.visible = this.model.categories?.length > 5
    this.renderLocation()
    this.renderPrice()
    this.renderSelectors()
  }

  private onRenderCategories(parent: Control, index: number) {
    const data = this.model?.categories?.[index]
    if (!data) return
    const el = parent.children?.[index] as Label
    if (el) {
      el.caption = data.label
      el.link.href = `/${data.value}`
      el.link.target = '_blank'
    }
  }

  private onToggleCate(target: Label) {
    if (target.caption === 'Show more') {
      target.caption = 'Show less'
      this.repeatCategory.count = this.model.categories?.length
    } else {
      target.caption = 'Show more'
      this.repeatCategory.count = 5
    }
  }

  private renderLocation() {
    const options = this.model.locations
    this.pnlLocation.clearInnerHTML()
    this.pnlLocation.appendChild(
      <i-radio-group
        width='100%'
        selectedValue={this.data.location}
        onChanged={(target: RadioGroup) =>
          this.onRadioChanged(target, 'location')
        }
      >
        {options.map((option) => {
          if (option.value === 'custom') {
            return (
              <i-radio value={option.value}>
                <i-vstack gap={4}>
                  <i-label caption={option.label} font={{ size: '13px' }} />
                  <i-combo-box
                    height={36}
                    border={{
                      radius: 6,
                      width: '1px',
                      style: 'solid',
                      color: Theme.divider,
                    }}
                    placeholder='Enter location'
                    font={{ size: '13px' }}
                    items={[]}
                    onChanged={this.onCustomLocationChanged}
                  ></i-combo-box>
                </i-vstack>
              </i-radio>
            )
          }
          return (
            <i-radio
              value={option.value}
              caption={option.label}
              font={{ size: '13px' }}
            ></i-radio>
          )
        })}
      </i-radio-group>
    )
  }

  private onRadioChanged(target: RadioGroup, type: string) {
    const value = target.selectedValue
    this.onSelectorChanged(type, value)
  }

  private onCustomLocationChanged(target: ComboBox) {
    this.onSelectorChanged('customLocation', target.value)
  }

  private renderPrice() {
    const options = this.model.prices
    this.pnlPrices.clearInnerHTML()
    this.pnlPrices.appendChild(
      <i-radio-group
        position='relative'
        width='100%'
        selectedValue={this.data.price}
        onChanged={(target: RadioGroup) => this.onRadioChanged(target, 'price')}
      >
        {options.map((option) => {
          if (option.value === 'custom') {
            return (
              <i-radio value={option.value}>
                <i-vstack gap={4} maxWidth='69%' overflow='hidden'>
                  <i-label caption={option.label} font={{ size: '13px' }} />
                  <i-hstack
                    verticalAlignment='center'
                    gap={4}
                    overflow='hidden'
                    maxWidth='100%'
                  >
                    <i-input
                      id='inputMin'
                      height={36}
                      border={{
                        radius: 6,
                        width: '1px',
                        style: 'solid',
                        color: Theme.divider,
                      }}
                      placeholder='Min'
                      width='auto'
                      font={{ size: '13px' }}
                      inputType='number'
                      value={this.data.min ?? ''}
                      tag={'min'}
                    ></i-input>
                    <i-label font={{ size: '13px' }} caption='to'></i-label>
                    <i-input
                      id='inputMax'
                      height={36}
                      width='auto'
                      border={{
                        radius: 6,
                        width: '1px',
                        style: 'solid',
                        color: Theme.divider,
                      }}
                      placeholder='Max'
                      font={{ size: '13px' }}
                      inputType='number'
                      value={this.data.max ?? ''}
                      tag={'max'}
                    ></i-input>
                    <i-button
                      border={{ radius: 24 }}
                      background={{ color: 'transparent' }}
                      caption='Apply'
                      font={{
                        color: Theme.text.primary,
                        size: '13px',
                        weight: 500,
                      }}
                      boxShadow='none'
                      height={36}
                      padding={{ left: 9, right: 9 }}
                      class={buttonHoveredStyle}
                      onClick={this.handleApply}
                    ></i-button>
                  </i-hstack>
                </i-vstack>
              </i-radio>
            )
          }
          return (
            <i-radio
              value={option.value}
              caption={option.label}
              font={{ size: '13px' }}
            ></i-radio>
          )
        })}
      </i-radio-group>
    )
  }

  private handleValidate() {
    const min = this.inputMin.value
    const max = this.inputMax.value
    return Number(min) <= Number(max)
  }

  private handleApply() {
    const isAvalid = this.handleValidate()
    if (!isAvalid) {
      this.inputMax.value = undefined
    }
    this.model.setValues({ min: this.inputMin.value, max: this.inputMax.value })
    if (typeof this.onChanged === 'function') {
      const count = this.onChanged('price')
      this.btnShowResults.caption = `Show results (${count})`
    }
  }

  private renderSelectors() {
    this.pnlSelectors.clearInnerHTML()
    const filters = this.model.getFilters()
    for (let filter of filters) {
      this.pnlSelectors.appendChild(
        <i-product-filter--selector
          display='block'
          width='100%'
          data={filter}
          selectedValue={this.data[filter.key]}
          onChange={this.onSelectorChanged}
        />
      )
    }
  }

  private onSelectorChanged(type: string, value: any) {
    this.model.setValue(type, value)
    if (typeof this.onChanged === 'function') {
      const count = this.onChanged(type)
      this.btnShowResults.caption = `Show results (${count})`
    }
  }

  private onReset() {
    this.model.reset()
    this.renderUI()
    if (typeof this.onChanged === 'function') {
      const count = this.onChanged('reset')
      this.btnShowResults.caption = `Show results (${count})`
    }
  }

  private handleClose() {
    if (typeof this.onClose === 'function') this.onClose()
  }

  init() {
    super.init()
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged
    this.onClose = this.getAttribute('onClose', true) || this.onClose
    this.onSelectorChanged = this.onSelectorChanged.bind(this)
    this.handleValidate = this.handleValidate.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.model = new FilterModel()
    this.renderUI()
  }

  render() {
    return (
      <i-vstack width='100%' height='100%' gap={18}>
        <i-hstack
          position='relative'
          width='100%'
          gap={8}
          alignItems='center'
          justifyContent='space-between'
          margin={{ bottom: 6 }}
          stack={{ shrink: '0' }}
        >
          <i-label
            position='relative'
            caption='Filters'
            font={{ size: '19px', weight: '500' }}
          ></i-label>
          <i-button
            padding={{ top: '8px', right: '10px', bottom: '8px', left: '10px' }}
            caption='Reset'
            border={{ radius: '24px' }}
            font={{ size: '12px', weight: '500' }}
            class={buttonHoveredStyle}
            onClick={this.onReset}
          ></i-button>
        </i-hstack>
        <i-vstack stack={{ grow: '1' }} overflow={{ y: 'auto' }} gap='18px'>
          <i-vstack position='relative' width='100%' gap={4}>
            <i-label
              position='relative'
              caption='Categories'
              font={{ size: '13px', weight: '600' }}
            ></i-label>
            <i-label
              position='relative'
              caption='All Categories'
              font={{ size: '13px', weight: '500' }}
            ></i-label>
            <i-vstack position='relative' width='100%' gap={4}>
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
                  link={{ href: '#', target: '_blank' }}
                  font={{ size: '13px' }}
                ></i-label>
              </i-repeater>
              <i-label
                id='lblShowCateMore'
                position='relative'
                caption='Show more'
                textDecoration='underline'
                cursor='pointer'
                font={{ size: '13px' }}
                onClick={this.onToggleCate}
              ></i-label>
            </i-vstack>
          </i-vstack>
          <i-vstack gap='4px'>
            <i-label
              position='relative'
              caption='Shop location'
              font={{ size: '13px', weight: '600' }}
            ></i-label>
            <i-vstack id='pnlLocation' gap={4}></i-vstack>
          </i-vstack>
          <i-vstack gap='4px'>
            <i-label
              position='relative'
              caption='Price'
              font={{ size: '13px', weight: '600' }}
            ></i-label>
            <i-vstack id='pnlPrices' gap={4}></i-vstack>
          </i-vstack>
          <i-vstack id='pnlSelectors' gap={18} />
        </i-vstack>
        <i-hstack
          stack={{ shrink: '0' }}
          height={60}
          padding={{ top: 8, bottom: 12 }}
        >
          <i-button
            id="btnShowResults"
            caption='Show results (0 item)'
            border={{ radius: '24px' }}
            width='100%'
            padding={{ top: '9px', right: '15px', bottom: '9px', left: '15px' }}
            font={{ size: '12px', weight: '600' }}
            onClick={this.handleClose}
          ></i-button>
        </i-hstack>
      </i-vstack>
    )
  }
}
