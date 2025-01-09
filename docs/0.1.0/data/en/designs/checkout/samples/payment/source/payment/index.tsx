import { Styles, Module, ControlElement, customElements, observable } from "@ijstech/components";
import { DataModel } from "./model";
const Theme = Styles.Theme.ThemeVars;


interface PaymentMainElement extends ControlElement { }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-payment': PaymentMainElement;
    }
  }
}

@customElements('i-payment')
export default class PaymentMain extends Module {
  @observable()
  private model: DataModel = new DataModel();

  init() {
    super.init();
  }

  render() {
    return <i-panel
      width='100%'
      overflow='hidden'
      background={{ "color": "var(--background-main)" }}
    >
      <i-grid-layout
        gap={{ "column": 16, "row": 16 }}
        maxWidth='100%'
        templateColumns={["minmax(min-content, 480px)", "1fr"]}
        mediaQueries={[{ "minWidth": "320px", "maxWidth": "767px", "properties": { "templateColumns": ["1fr"] } }]}
      >
        <i-vstack
          maxWidth='100%'
          padding={{ "top": "32px", "right": "32px", "bottom": "32px", "left": "32px" }}
          border={{ "width": "1px", "style": "solid", "color": "var(--divider)" }}
          mediaQueries={[{ "minWidth": "320px", "maxWidth": "767px", "properties": { "padding": { "top": "16px", "right": "16px", "bottom": "16px", "left": "16px" } } }]}
        >
          <i-label
            caption='Order details'
            font={{ "size": "24px", "weight": 600 }}
          >
          </i-label>
          <i-vstack
            gap={16}
            margin={{ "top": 24 }}
          >
            <i-vstack
              gap={5}
            >
              <i-label
                caption='Email address'
                font={{ "size": "14px", "color": "var(--text-secondary)" }}
              >
              </i-label>
              <i-label
                caption='abc@gmail.com'
              >
              </i-label>
            </i-vstack>
            <i-vstack
              gap={5}
            >
              <i-label
                caption='Payment method'
                font={{ "size": "14px", "color": "var(--text-secondary)" }}
              >
              </i-label>
              <i-hstack
                verticalAlignment='center'
                horizontalAlignment='space-between'
                gap={8}
              >
                <i-label
                  caption='Bitcoin'
                >
                </i-label>
                <i-label
                  caption='Change'
                  textDecoration='underline'
                >
                </i-label>
              </i-hstack>
            </i-vstack>
            <i-vstack
              gap={5}
            >
              <i-label
                caption='Invoice id'
                font={{ "size": "14px", "color": "var(--text-secondary)" }}
              >
              </i-label>
              <i-label
                caption='758fe9b5-5626-416d-abda-0d5ca29ec442'
                wordBreak='break-all'
              >
              </i-label>
            </i-vstack>
            <i-panel
              height={1}
              width='100%'
              background={{ "color": "var(--divider)" }}
              margin={{ "top": 16, "bottom": 16 }}
            >
            </i-panel>
            <i-hstack
              position='relative'
              width='100%'
              gap={16}
              alignItems='center'
            >
              <i-image
                url='https://cdn.bitrefill.com/primg/i1w48h48/viettel-mobile-vietnam.webp'
                display='block'
                width='48px'
                height='48px'
                objectFit='cover'
                stack={{ "shrink": "0" }}
                border={{ "width": "1px", "style": "solid", "color": "var(--divider)" }}
              >
              </i-image>
              <i-vstack
                position='relative'
                width='100%'
                gap={5}
              >
                <i-label
                  caption='Viettel Mobile Vietnam'
                  font={{ "weight": "600" }}
                >
                </i-label>
                <i-label
                  caption='20000.00 VND value'
                  font={{ "color": "var(--text-secondary)" }}
                >
                </i-label>
              </i-vstack>
            </i-hstack>
            <i-hstack
              position='relative'
              width='100%'
              justifyContent='space-between'
              alignItems='center'
              gap={8}
              border={{ "width": "0px", "top": { "width": "1px" }, "color": "var(--divider)" }}
              padding={{ "top": "12px" }}
            >
              <i-label
                caption='Total'
              >
              </i-label>
              <i-label
                caption='0.00000884 BTC'
              >
              </i-label>
            </i-hstack>
          </i-vstack>
        </i-vstack>
        <i-vstack
          padding={{ "top": "32px", "right": "32px", "bottom": "32px", "left": "32px" }}
          border={{ "width": "1px", "style": "solid", "color": "var(--divider)" }}
          maxWidth='100%'
          mediaQueries={[{ "minWidth": "320px", "maxWidth": "767px", "properties": { "padding": { "top": "16px", "right": "16px", "bottom": "16px", "left": "16px" } } }]}
        >
          <i-hstack
            position='relative'
            width='100%'
            gap={8}
          >
            <i-image
              width={40}
              height={40}
              objectFit='cover'
              border={{ "radius": "50%" }}
              url='https://img.icons8.com/?size=256&id=63192&format=png'
            >
            </i-image>
            <i-label
              caption='Pay with Bitcoin'
              font={{ "size": "32px", "weight": "600" }}
            >
            </i-label>
          </i-hstack>
          <i-hstack
            position='relative'
            width='100%'
            justifyContent='center'
          >
            <i-image
              url='https://placehold.co/600x400?text=No+Image'
              display='block'
              width='276px'
              height='276px'
              margin={{ "top": "16px" }}
            >
            </i-image>
          </i-hstack>
          <i-vstack
            position='relative'
            width='100%'
            gap={12}
          >
            <i-label
              caption='Payment details'
              font={{ "size": "20px", "weight": "600" }}
            >
            </i-label>
            <i-vstack
              position='relative'
              width='100%'
              gap={24}
            >
              <i-vstack
                gap={5}
              >
                <i-label
                  caption='Payment unique address'
                  font={{ "weight": 600 }}
                >
                </i-label>
                <i-hstack
                  horizontalAlignment='space-between'
                  verticalAlignment='center'
                  gap={16}
                >
                  <i-label
                    caption='bc1qxk3vu9hmu4y2w97qs9gy29yj6azvve9ae9wpsr'
                    font={{ "size": "18px" }}
                    wordBreak='break-all'
                  >
                  </i-label>
                  <i-button
                    caption='Copy'
                    rightIcon={{ "width": 12, "height": 12, "fill": "var(--text-primary)", "name": "copy" }}
                    height='30px'
                    border={{ "radius": "9999px" }}
                    padding={{ "left": "10px", "right": "10px" }}
                  >
                  </i-button>
                </i-hstack>
              </i-vstack>
              <i-vstack
                gap={5}
              >
                <i-label
                  caption='Amount to pay'
                  font={{ "weight": 600 }}
                >
                </i-label>
                <i-hstack
                  horizontalAlignment='space-between'
                  verticalAlignment='center'
                  gap={16}
                >
                  <i-label
                    caption='0.00000883 BTC'
                    font={{ "size": "18px" }}
                  >
                  </i-label>
                  <i-button
                    caption='Copy'
                    rightIcon={{ "width": 12, "height": 12, "fill": "var(--text-primary)", "name": "copy" }}
                    height='30px'
                    border={{ "radius": "9999px" }}
                    padding={{ "left": "10px", "right": "10px" }}
                  >
                  </i-button>
                </i-hstack>
              </i-vstack>
              <i-hstack
                horizontalAlignment='space-between'
                verticalAlignment='center'
                gap={16}
                justifyContent='space-between'
                alignItems='center'
              >
                <i-label
                  caption='Expires in'
                  font={{ "size": "16px", "weight": "600" }}
                  stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
                >
                </i-label>
                <i-hstack
                  position='relative'
                  alignItems='center'
                  gap={4}
                >
                  <i-progress
                    width='20px'
                    height='20px'
                    percent={50}
                    strokeWidth={3}
                    border={{ "radius": "4px" }}
                    type='circle'
                  >
                  </i-progress>
                  <i-label
                    caption='17:22'
                  >
                  </i-label>
                </i-hstack>
              </i-hstack>
            </i-vstack>
            <i-hstack
              justifyContent='center'
              margin={{ "top": 32, "bottom": 16 }}
            >
              <i-button
                padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
                caption='Open in Blockchain.com'
                border={{ "radius": "9999px" }}
                margin={{ "left": "10px", "right": "10px" }}
                height='40px'
                maxWidth='350px'
              >
              </i-button>
            </i-hstack>
          </i-vstack>
        </i-vstack>
      </i-grid-layout>
    </i-panel>
  }
}