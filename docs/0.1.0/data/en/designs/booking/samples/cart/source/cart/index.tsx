import { ControlElement, Styles, Module, Container, observable, customElements, Panel } from "@ijstech/components";
import { customStyles } from './index.css';
import { DataModel, getPayments, shippingOptions } from "./model";
const Theme = Styles.Theme.ThemeVars;

interface CartMainElement extends ControlElement {
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-cart': CartMainElement;
    }
  }
}

@customElements('i-cart')
export default class CartMain extends Module {
  private pnlPayments: Panel;

  @observable()
  private model: DataModel = new DataModel();

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  private renderPayments() {
    const payments = getPayments();
    this.pnlPayments.clearInnerHTML();
    this.pnlPayments.appendChild(
      <i-radio-group
        id='payGroup'
        width='100%'
        class={customStyles}
      >
        {payments.map((payment) => {
          return (
            <i-radio
              value={payment.value}
            >
              <i-hstack
                verticalAlignment='center'
                gap='4px'
                margin={{ "right": 4 }}
              >
                {payment.images.map((image) => {
                  return (
                    <i-image
                      url={image}
                      width={48}
                    >
                    </i-image>
                  )
                })}
              </i-hstack>
            </i-radio>
          )
        })}
      </i-radio-group>
    )
  }

  init() {
    super.init();
    this.renderPayments();
  }

  render() {
    return <i-panel
      width='100%'
      padding={{ "top": "16px", "right": "16px", "bottom": "16px", "left": "16px" }}
    >
      <i-grid-layout
        width='100%'
        overflow='hidden'
        gap={{ "row": "8px", "column": "24px" }}
        templateColumns={["60%", "40%"]}
        padding={{ "top": "8px", "right": "8px", "bottom": "8px", "left": "8px" }}
        mediaQueries={[{ "maxWidth": "767px", "properties": { "templateColumns": ["auto"], "templateRows": ["auto"], "gap": { "row": "1rem", "column": "0px" } } }]}
      >
        <i-panel
          width='100%'
          overflow='hidden'
        >
          <i-vstack
            border={{ "width": "1px", "style": "solid", "color": "var(--divider)", "radius": "12px" }}
            padding={{ "top": "24px", "right": "24px", "bottom": "16px", "left": "24px" }}
            gap={18}
            width='100%'
            overflow='hidden'
          >
            <i-hstack
              width='100%'
              overflow='hidden'
              horizontalAlignment='start'
              verticalAlignment='center'
              gap={6}
            >
              <i-image
                url={this.model.shop?.logoUrl}
                display='block'
                width='32px'
                stack={{ "grow": "0" }}
                height='32px'
                objectFit='cover'
              >
              </i-image>
              <i-label
                caption={this.model.shop?.name}
                font={{ "size": "16px", "weight": "500" }}
              >
              </i-label>
              <i-vstack
                hover={{ "backgroundColor": "var(--colors-primary-main)" }}
                cursor='pointer'
                width='24px'
                height='24px'
                verticalAlignment='center'
                horizontalAlignment='center'
                border={{ "radius": "50%" }}
              >
                <i-icon
                  width='18px'
                  height='18px'
                  name='ellipsis-h'
                  fill='var(--text-primary)'
                >
                </i-icon>
              </i-vstack>
            </i-hstack>
            <i-stack
              width='100%'
              gap={18}
              justifyContent='space-between'
              mediaQueries={[{ "maxWidth": "767px", "properties": { "direction": "vertical", "justifyContent": "start" } }]}
            >
              <i-panel
                stack={{ "basis": "30%", "shrink": "0" }}
              >
                <i-image
                  width='100%'
                  url={this.model.product?.picture}
                  border={{ "radius": 12 }}
                >
                </i-image>
              </i-panel>
              <i-vstack
                gap={8}
                stack={{ "basis": "70%" }}
                overflow='hidden'
              >
                <i-stack
                  justifyContent='space-between'
                  maxWidth='100%'
                  gap='8px'
                  overflow='hidden'
                >
                  <i-vstack
                    gap='5px'
                    stack={{ "basis": "60%" }}
                    maxWidth='60%'
                  >
                    <i-label
                      caption={this.model.product?.name}
                      font={{ "size": "16px", "weight": "400" }}
                      textOverflow='ellipsis'
                      maxWidth='100%'
                    >
                    </i-label>
                    <i-panel>
                      <i-label
                        caption={this.model.product?.type}
                        background={{ "color": "var(--colors-secondary-light)" }}
                        font={{ "color": "var(--colors-secondary-contrast_text)", "size": "11px", "weight": "700" }}
                        border={{ "radius": "12px" }}
                        padding={{ "top": "3px", "right": "3px", "bottom": "3px", "left": "3px" }}
                        stack={{ "grow": "0" }}
                      >
                      </i-label>
                    </i-panel>
                  </i-vstack>
                  <i-vstack
                    gap='5px'
                    alignItems='end'
                    stack={{ "basis": "40%" }}
                  >
                    <i-panel>
                      <i-label
                        caption={this.model.product?.discount}
                        background={{ "color": "var(--colors-success-light)" }}
                        font={{ "color": "var(--colors-success-contrast_text)", "size": "11px", "weight": "700" }}
                        border={{ "radius": "12px" }}
                        stack={{ "grow": "0", "shrink": "0" }}
                        padding={{ "top": "3px", "right": "3px", "bottom": "3px", "left": "3px" }}
                      >
                      </i-label>
                    </i-panel>
                    <i-label
                      caption={this.model.product?.price}
                      font={{ "size": "19px", "weight": "600", "color": "var(--colors-success-main)" }}
                    >
                    </i-label>
                    <i-label
                      caption={this.model.product?.originalPrice}
                      font={{ "color": "var(--text-disabled)", "size": "12px" }}
                      textDecoration='line-through'
                    >
                    </i-label>
                  </i-vstack>
                </i-stack>
                <i-label
                  caption='In 180 carts, 40 bought in the past 24 hours'
                  font={{ "color": "var(--colors-error-main)" }}
                >
                </i-label>
                <i-combo-box
                  width='100px'
                  height='32px'
                  background={{ "color": Theme.input.background }}
                  border={{ "radius": 16 }}
                  font={{ color: Theme.input.fontColor }}
                  items={[{ "value": "1", "label": "1" }, { "value": "2", "label": "2" }]}
                  value='1'
                  icon={{ "width": 16, "height": 16, "fill": Theme.input.fontColor, "name": "caret-down" }}
                >
                </i-combo-box>
                <i-hstack
                  width='100%'
                  gap={8}
                  wrap='wrap'
                >
                  <i-hstack
                    padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
                    border={{ "radius": 16 }}
                    minWidth='36px'
                    minHeight='36px'
                    horizontalAlignment='center'
                    verticalAlignment='center'
                    stack={{ "grow": "0" }}
                    cursor='pointer'
                    hover={{ "backgroundColor": "var(--action-hover_background)" }}
                  >
                    <i-label
                      caption='Edit'
                      font={{ "color": "var(--text-primary)", "transform": "capitalize", "weight": 600, "size": "13px" }}
                    >
                    </i-label>
                  </i-hstack>
                  <i-hstack
                    padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
                    border={{ "radius": 16 }}
                    minWidth='36px'
                    minHeight='36px'
                    horizontalAlignment='center'
                    verticalAlignment='center'
                    stack={{ "grow": "0" }}
                    cursor='pointer'
                    hover={{ "backgroundColor": "var(--action-hover_background)" }}
                  >
                    <i-label
                      caption='Save for later'
                      font={{ "color": "var(--text-primary)", "transform": "capitalize", "weight": 600, "size": "13px" }}
                    >
                    </i-label>
                  </i-hstack>
                  <i-hstack
                    padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
                    border={{ "radius": 16 }}
                    minWidth='36px'
                    minHeight='36px'
                    horizontalAlignment='center'
                    verticalAlignment='center'
                    stack={{ "grow": "0" }}
                    cursor='pointer'
                    hover={{ "backgroundColor": "var(--action-hover_background)" }}
                  >
                    <i-label
                      caption='Remove'
                      font={{ "color": "var(--text-primary)", "transform": "capitalize", "weight": 600, "size": "13px" }}
                    >
                    </i-label>
                  </i-hstack>
                </i-hstack>
              </i-vstack>
            </i-stack>
            <i-panel
              width='100%'
            >
              <i-combo-box
                width='100%'
                height='48px'
                border={{ "radius": 24 }}
                background={{ "color": Theme.input.background }}
                font={{ color: Theme.input.fontColor }}
                items={shippingOptions()}
                icon={{ "width": 16, "height": 16, "fill": Theme.input.fontColor, "name": "caret-down" }}
              >
              </i-combo-box>
            </i-panel>
          </i-vstack>
        </i-panel>
        <i-vstack
          gap='8px'
          width='calc(100% - 16px)'
          overflow='hidden'
        >
          <i-label
            caption="How you'll pay"
            font={{ "size": "16px", "weight": "600" }}
          >
          </i-label>
          <i-vstack
            id="pnlPayments"
            width='100%'
            gap={8}
          >
          </i-vstack>
          <i-hstack
            width='100%'
            justifyContent='space-between'
            overflow='hidden'
            alignItems='center'
            padding={{ "top": "8px", "bottom": "8px" }}
            border={{ "bottom": { "width": "1px", "style": "solid", "color": "var(--divider)" } }}
          >
            <i-label
              caption='Item(s) total'
              font={{ "size": "16px", "weight": "600" }}
            >
            </i-label>
            <i-label
              caption={this.model.shippingInfo?.itemsTotal}
              font={{ "size": "16px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
          <i-hstack
            width='100%'
            overflow='hidden'
            justifyContent='space-between'
            alignItems='center'
            padding={{ "top": "8px" }}
          >
            <i-label
              caption='Shop discount'
              font={{ "size": "16px", "weight": "600" }}
            >
            </i-label>
            <i-label
              caption={this.model.shippingInfo?.discount}
              font={{ "size": "16px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
          <i-hstack
            overflow='hidden'
            width='100%'
            justifyContent='space-between'
            alignItems='center'
            padding={{ "bottom": "8px", "top": "8px" }}
            border={{ "bottom": { "width": "1px", "style": "solid", "color": "var(--divider)" } }}
          >
            <i-label
              caption='Subtotal'
              font={{ "size": "16px", "weight": "600" }}
            >
            </i-label>
            <i-label
              caption={this.model.shippingInfo?.subTotal}
              font={{ "size": "16px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
          <i-hstack
            width='100%'
            overflow='hidden'
            justifyContent='space-between'
            alignItems='center'
            padding={{ "top": "8px" }}
          >
            <i-vstack>
              <i-label
                caption='Shipping'
                font={{ "size": "16px", "weight": "600" }}
              >
              </i-label>
              <i-panel
                display='inline'
              >
                <i-label
                  caption='(To'
                  display='inline'
                  font={{ "size": "12px", "weight": "400" }}
                >
                </i-label>
                <i-label
                  caption={this.model.shippingInfo?.to}
                  padding={{ "left": 4 }}
                  display='inline'
                  font={{ "size": "12px", "weight": "400" }}
                >
                </i-label>
                <i-label
                  caption=')'
                  display='inline'
                  font={{ "size": "12px", "weight": "400" }}
                >
                </i-label>
              </i-panel>
            </i-vstack>
            <i-label
              caption={this.model.shippingInfo?.fee}
              font={{ "size": "16px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
          <i-hstack
            width='100%'
            overflow='hidden'
            justifyContent='space-between'
            alignItems='center'
            padding={{ "bottom": "8px", "top": "8px" }}
            border={{ "bottom": { "width": "1px", "style": "solid", "color": "var(--divider)" } }}
          >
            <i-label
              caption='Total'
              font={{ "size": "16px", "weight": "600" }}
            >
            </i-label>
            <i-label
              caption={this.model.shippingInfo?.total}
              font={{ "size": "16px", "weight": "600" }}
            >
            </i-label>
          </i-hstack>
          <i-checkbox
            width='100%'
            caption='Mark order as a gift'
            margin={{ "top": 16 }}
            font={{ "size": "16px", "weight": "500" }}
          >
          </i-checkbox>
          <i-button
            caption='Proceed to checkout'
            width='100%'
            height='40px'
            font={{ "size": "14px", "weight": "600" }}
            margin={{ "top": "5px" }}
            border={{ "radius": "24px" }}
            boxShadow='none'
          >
          </i-button>
          <i-panel>
            <i-button
              caption='Apply coupon code'
              height='40px'
              icon={{ "name": "tag", "fill": "var(--colors-success-main)" }}
              font={{ "size": "14px", "weight": "600" }}
              margin={{ "top": "5px" }}
              border={{ "radius": "24px" }}
              stack={{ "grow": "0" }}
              padding={{ "top": 9, "bottom": 9, "left": 15, "right": 15 }}
              background={{ "color": "transparent" }}
              boxShadow='none'
            >
            </i-button>
          </i-panel>
          <i-label
            caption='Local taxes included (where applicable)'
            font={{ "size": "13px" }}
          >
          </i-label>
          <i-label
            caption='* Learn more about additional taxes, duties, and fees that may apply'
            font={{ "size": "13px" }}
          >
          </i-label>
        </i-vstack>
      </i-grid-layout>
    </i-panel>
  }
}
