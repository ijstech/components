import { Styles, Module, Container, Image, Label, FormatUtils, RadioGroup } from "@ijstech/components";
import { DataModel } from "./model";
import { customStyles } from './index.css';
const Theme = Styles.Theme.ThemeVars;

export default class Cart extends Module {
  private model: DataModel;

  private imgShopLogo: Image;
  private lblShopName: Label;
  private lblProductName: Label;
  private imgProduct: Image;
  private lblProductOrigin: Label;
  private lblProductPrice: Label;
  private lblShippingFee: Label;
  private lblTotal: Label;
  private lblItemsTotal: Label;
  private lblSubTotal: Label;
  private lblDiscount: Label;
  private lblDiscountLabel: Label;
  private payGroup: RadioGroup;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.model = new DataModel();
  }

  private renderUI() {
    this.imgShopLogo.url = this.model.shop.logoUrl;
    this.lblShopName.caption = this.model.shop.name;
    this.imgProduct.url = this.model.product.picture;
    this.lblProductName.caption = this.model.product.name;
    this.lblProductOrigin.caption = this.formatNumber(this.model.product?.price || 0);
    const originValue = Number(this.model.product?.price || 0);
    const discount = Number(this.model.product?.discount || 0);
    const discountValue = discount * originValue / 100;
    const value = originValue - discountValue;
    this.lblProductPrice.caption = this.formatNumber(value);
    this.lblDiscount.caption = this.formatNumber(discountValue);
    this.lblShippingFee.caption = this.formatNumber(this.model?.shipping?.fee || 0);
    const total = value + Number(this.model?.shipping?.fee || 0);
    this.lblTotal.caption = this.formatNumber(total);
    this.lblItemsTotal.caption = this.formatNumber(originValue);
    this.lblSubTotal.caption = this.formatNumber(value);
    this.lblDiscountLabel.caption = `${discount}% off`;
    this.lblDiscountLabel.visible = this.lblProductOrigin.visible = !!discount;
  }

  private formatNumber(value: number) {
    return FormatUtils.formatNumber(value, { decimalFigures: 2 }) + 'đ'
  }

  private onPayChanged() {
    console.log(this.payGroup.selectedValue)
  }

  init() {
    super.init();
    this.model.fetchShop('shopId');
    this.model.fetchProduct();
    this.model.getShippingInfo();
    this.renderUI();
    this.style.setProperty('--combobox-font_color', '#fff')
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
        mediaQueries={[
          {
            maxWidth: '767px',
            properties: {
              templateColumns: ['auto'],
              templateRows: ['auto'],
              gap: { row: "1rem", column: "0px" }
            }
          }
        ]}
      >
        <i-panel width="100%" overflow="hidden">
          <i-vstack
            border={{ "width": "1px", "style": "solid", "color": "var(--divider)", "radius": "12px" }}
            padding={{ "top": "24px", "right": "24px", "bottom": "16px", "left": "24px" }}
            gap={18}
            width="100%"
            overflow="hidden"
          >
            <i-hstack
              width='100%'
              overflow="hidden"
              horizontalAlignment="start"
              gap={6}
            >
              <i-image
                id="imgShopLogo"
                url={this.model.shop?.logoUrl}
                display='block'
                width='32px'
                stack={{ "grow": "0" }}
                height='32px'
                objectFit="cover"
              >
              </i-image>
              <i-label
                id="lblShopName"
                caption={this.model.shop?.name}
                font={{ "size": "16px", "weight": "500" }}
              >
              </i-label>
              <i-vstack
                hover={{ "backgroundColor": "var(--colors-primary-main)" }}
                cursor='pointer'
                width='24px'
                height='24px'
                verticalAlignment="center"
                horizontalAlignment="center"
                border={{ "radius": "50%" }}
              >
                <i-icon
                  width='18px'
                  height='18px'
                  name='ellipsis-h'
                  fill={Theme.text.primary}
                >
                </i-icon>
              </i-vstack>
            </i-hstack>
            <i-stack
              width='100%'
              gap={18}
              justifyContent='space-between'
              direction="horizontal"
              mediaQueries={[
                {
                  maxWidth: '767px',
                  properties: {
                    direction: "vertical",
                    justifyContent: 'start'
                  }
                }
              ]}
            >
              <i-panel
                stack={{ "basis": "30%", shrink: '0' }}
              >
                <i-image
                  id="imgProduct"
                  width='100%'
                  height="auto"
                  url=""
                  border={{ radius: 12 }}
                />
              </i-panel>
              <i-vstack
                gap={8}
                stack={{ "basis": "70%" }}
                overflow="hidden"
              >
                <i-stack
                  justifyContent='space-between'
                  maxWidth='100%'
                  direction="horizontal"
                  gap="8px"
                  overflow="hidden"
                >
                  <i-vstack
                    gap='5px'
                    stack={{ basis: '60%' }}
                    maxWidth="60%"
                  >
                    <i-label
                      id="lblProductName"
                      caption={this.model.product.name}
                      font={{ "size": "16px", "weight": "400" }}
                      textOverflow="ellipsis"
                      maxWidth="100%"
                    >
                    </i-label>
                    <i-panel>
                      <i-label
                        caption='Box Options: With Kraft Box'
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
                    alignItems="end"
                    stack={{ basis: '40%' }}
                  >
                    <i-panel>
                      <i-label
                        id="lblDiscountLabel"
                        caption='--'
                        background={{ "color": "var(--colors-success-light)" }}
                        font={{ "color": "var(--colors-success-contrast_text)", "size": "11px", "weight": "700" }}
                        border={{ "radius": "12px" }}
                        stack={{ "grow": "0", "shrink": "0" }}
                        padding={{ "top": "3px", "right": "3px", "bottom": "3px", "left": "3px" }}
                      >
                      </i-label>
                    </i-panel>
                    <i-label
                      id="lblProductPrice"
                      caption='0'
                      font={{ "size": "19px", "weight": "600", "color": "var(--colors-success-main)" }}
                    >
                    </i-label>
                    <i-label
                      id="lblProductOrigin"
                      caption='0'
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
                  background={{ "color": "transparent" }}
                  border={{ radius: 16 }}
                  items={[{ "value": "1", "label": "1" }, { "value": "2", "label": "2" }]}
                  value="1"
                  icon={{ "width": 16, "height": 16, "fill": "var(--text-primary)", "name": "angle-down" }}
                >
                </i-combo-box>
                <i-hstack
                  width='100%'
                  gap={8}
                  wrap="wrap"
                >
                  <i-hstack
                    padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
                    border={{ "radius": 16 }}
                    minWidth='36px'
                    minHeight='36px'
                    horizontalAlignment="center" verticalAlignment="center"
                    stack={{ "grow": "0" }}
                    cursor="pointer"
                    hover={{ backgroundColor: Theme.action.hoverBackground }}
                  >
                    <i-label
                      caption='Edit'
                      font={{ color: Theme.text.primary, transform: 'capitalize', weight: 600, size: '13px' }}
                    ></i-label>
                  </i-hstack>
                  <i-hstack
                    padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
                    border={{ "radius": 16 }}
                    minWidth='36px'
                    minHeight='36px'
                    horizontalAlignment="center" verticalAlignment="center"
                    stack={{ "grow": "0" }}
                    cursor="pointer"
                    hover={{ backgroundColor: Theme.action.hoverBackground }}
                  >
                    <i-label
                      caption='Save for later'
                      font={{ color: Theme.text.primary, transform: 'capitalize', weight: 600, size: '13px' }}
                    ></i-label>
                  </i-hstack>
                  <i-hstack
                    padding={{ "top": "9px", "right": "15px", "bottom": "9px", "left": "15px" }}
                    border={{ "radius": 16 }}
                    minWidth='36px'
                    minHeight='36px'
                    horizontalAlignment="center" verticalAlignment="center"
                    stack={{ "grow": "0" }}
                    cursor="pointer"
                    hover={{ backgroundColor: Theme.action.hoverBackground }}
                  >
                    <i-label
                      caption='Remove'
                      font={{ color: Theme.text.primary, transform: 'capitalize', weight: 600, size: '13px' }}
                    ></i-label>
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
                border={{ radius: 24 }}
                background={{ "color": "transparent" }}
                items={[{ "value": "1", "label": "Standard Shipping" }, { "value": "2", "label": "Express" }]}
                icon={{ "width": 16, "height": 16, "fill": "var(--text-primary)", "name": "angle-down" }}
                value="1"
              >
              </i-combo-box>
            </i-panel>
          </i-vstack>
        </i-panel>
        <i-vstack
          gap='8px'
          width={'calc(100% - 16px)'}
          overflow="hidden"
        >
          <i-label
            caption="How you'll pay"
            font={{ "size": "16px", "weight": "600" }}
          >
          </i-label>
          <i-vstack
            width='100%'
            gap={8}
          >
            <i-radio-group
              id="payGroup"
              width='100%'
              class={customStyles}
              onChanged={this.onPayChanged}
            >
              <i-radio value="1">
                <i-hstack verticalAlignment="center" gap="4px" margin={{right: 4}}>
                  <i-image url={"https://www.svgrepo.com/show/508730/visa-classic.svg"} width={48} height="auto"></i-image>
                  <i-image url={"https://www.svgrepo.com/show/508703/mastercard.svg"} width={48} height="auto"></i-image>
                </i-hstack>
              </i-radio>
              <i-radio value="2">
                <i-image url={"https://www.svgrepo.com/show/452222/google-pay.svg"} width={48} height="auto"></i-image>
              </i-radio>
            </i-radio-group>
          </i-vstack>
          <i-hstack
            width='100%'
            justifyContent='space-between'
            overflow="hidden"
            alignItems='center'
            padding={{ "top": "8px", bottom: "8px" }}
            border={{ "bottom": { "width": "1px", "style": "solid", "color": "var(--divider)" } }}
          >
            <i-label
              caption='Item(s) total'
              font={{ "size": "16px", "weight": "600" }}
            >
            </i-label>
            <i-label
              id="lblItemsTotal"
              caption='0'
              font={{ "size": "16px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
          <i-hstack
            width='100%'
            overflow="hidden"
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
              id="lblDiscount"
              caption='0'
              font={{ "size": "16px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
          <i-hstack
            overflow="hidden"
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
              id="lblSubTotal"
              caption='0'
              font={{ "size": "16px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
          <i-hstack
            width='100%'
            overflow="hidden"
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
              <i-label
                caption='(To Vietnam)'
                font={{ "size": "12px", "weight": "400" }}
              >
              </i-label>
            </i-vstack>
            <i-label
              id="lblShippingFee"
              caption="0"
              font={{ "size": "16px", "weight": "400" }}
            >
            </i-label>
          </i-hstack>
          <i-hstack
            width='100%'
            overflow="hidden"
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
              id="lblTotal"
              caption='0'
              font={{ "size": "16px", "weight": "600" }}
            >
            </i-label>
          </i-hstack>
          <i-checkbox
            width='100%'
            caption='Mark order as a gift'
            margin={{ top: 16 }}
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
            boxShadow="none"
          >
          </i-button>
          <i-panel>
            <i-button
              caption='Apply coupon code'
              width="auto"
              height='40px'
              icon={{ name: 'tag', fill: Theme.colors.success.main }}
              font={{ "size": "14px", "weight": "600" }}
              margin={{ "top": "5px" }}
              border={{ "radius": "24px" }}
              stack={{ grow: '0' }}
              padding={{ top: 9, bottom: 9, left: 15, right: 15 }}
              background={{ color: 'transparent' }}
              boxShadow="none"
            >
            </i-button>
          </i-panel>
          <i-label caption="Local taxes included (where applicable)" font={{ size: '13px' }}></i-label>
          <i-label caption="* Learn more about additional taxes, duties, and fees that may apply" font={{ size: '13px' }}></i-label>
        </i-vstack>
      </i-grid-layout>
    </i-panel>
  }
}
