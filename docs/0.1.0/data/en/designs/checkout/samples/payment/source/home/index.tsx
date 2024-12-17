import { Styles, Module } from "@ijstech/components";
import { DataModel } from "./model";
const Theme = Styles.Theme.ThemeVars;

export default class Payment extends Module {
  private model: DataModel;
  render() {
    return <i-panel
      width='100%'
      minHeight='100%'
    >
      <i-hstack
        position='relative'
        width='100%'
        padding={{ "top": "8px", "right": "16px", "bottom": "8px", "left": "16px" }}
      >
        <i-icon
          position='relative'
          name='times'
          width={16}
          height={16}
          display='inline-flex'
          stack={{ "shrink": "0" }}
        >
        </i-icon>
        <i-hstack
          position='relative'
          width='100%'
          stack={{ "basis": "0%", "shrink": "1", "grow": "1" }}
          justifyContent='center'
        >
          <i-label
            position='relative'
            caption='Checkout'
          >
          </i-label>
        </i-hstack>
      </i-hstack>
      <i-hstack
        gap={8}
        width='100%'
        background={{ "color": "var(--background-default)" }}
        padding={{ "top": 8, "right": 8, "bottom": 8, "left": 8 }}
      >
        <i-panel
          stack={{ "shrink": "0" }}
        >
          <i-image
            width='100px'
            display='inline-block'
            url='https://d4ov6iqsvotvt.cloudfront.net/uploads/show/poster_image/5654/medium_1620213561-gore-vidal-s-the-best-man.jpg'
          >
          </i-image>
        </i-panel>
        <i-vstack
          gap='6px'
          width='100%'
        >
          <i-label
            caption="Gore Vidal's The Best Man"
            font={{ "size": "16px", "weight": "600" }}
          >
          </i-label>
          <i-label
            caption='Wednesday, October 14, 2021'
            font={{ "size": "12px" }}
          >
          </i-label>
          <i-label
            caption='1 ticket . Contribute what you can'
            font={{ "size": "14px" }}
          >
          </i-label>
        </i-vstack>
      </i-hstack>
      <i-vstack
        width='100%'
        gap='16px'
        padding={{ "left": 16, "right": 16, "top": 16 }}
      >
        <i-label
          caption='Payment Information'
          font={{ "size": "16px", "weight": "600", "transform": "uppercase" }}
        >
        </i-label>
        <i-vstack
          width='100%'
          background={{ "color": "var(--input-background)" }}
          border={{ "width": "1px", "radius": "4px", "color": "var(--divider)" }}
        >
          <i-hstack
            gap='8px'
            width='100%'
            height={32}
            border={{ "radius": "4px 4px 0 0" }}
            alignItems='center'
            padding={{ "right": "8px", "left": "8px" }}
          >
            <i-hstack
              position='relative'
              width='100%'
              gap='4px'
              verticalAlignment='center'
              height='100%'
              alignItems='center'
            >
              <i-icon
                position='relative'
                width='20px'
                height='20px'
                name='credit-card'
              >
              </i-icon>
              <i-input
                position='relative'
                width='100%'
                height='100%'
                background={{ "color": "transparent" }}
                border={{ "width": "0px" }}
                padding={{ "top": "5px", "right": "5px", "bottom": "5px", "left": "5px" }}
                placeholder='Add a credit card'
              >
              </i-input>
            </i-hstack>
            <i-label
              visible={false}
              font={{ "color": "var(--colors-error-main)" }}
              position='relative'
              maxWidth='30%'
              overflowWrap='break-word'
            >
            </i-label>
          </i-hstack>
          <i-hstack
            gap='8px'
            width='100%'
            border={{ "top": { "width": "1px", "style": "solid", "color": "var(--divider)" }, "radius": "0 0 4px 4px" }}
            alignItems='center'
          >
            <i-hstack
              position='relative'
              width='100%'
            >
              <i-input
                position='relative'
                width='100%'
                height='32px'
                background={{ "color": "transparent" }}
                border={{ "width": "0px" }}
                padding={{ "top": "5px", "right": "8px", "bottom": "5px", "left": "8px" }}
                placeholder='Add a voucher'
              >
              </i-input>
            </i-hstack>
          </i-hstack>
        </i-vstack>
      </i-vstack>
      <i-vstack
        width='100%'
        gap='16px'
        padding={{ "left": 16, "right": 16, "top": 16 }}
      >
        <i-label
          caption='Contact information'
          font={{ "size": "16px", "weight": "600", "transform": "uppercase" }}
        >
        </i-label>
        <i-vstack
          width='100%'
          background={{ "color": "var(--input-background)" }}
          border={{ "width": "1px", "radius": "4px", "color": "var(--divider)" }}
        >
          <i-hstack
            gap='8px'
            width='100%'
            height={32}
            border={{ "radius": "4px 4px 0 0" }}
            alignItems='center'
            padding={{ "right": "8px", "left": "8px" }}
          >
            <i-hstack
              position='relative'
              width='100%'
              gap='4px'
              verticalAlignment='center'
              height='100%'
              alignItems='center'
            >
              <i-icon
                position='relative'
                width='20px'
                height='20px'
                name='user'
              >
              </i-icon>
              <i-input
                position='relative'
                width='100%'
                height='100%'
                background={{ "color": "transparent" }}
                border={{ "width": "0px" }}
                padding={{ "top": "5px", "right": "5px", "bottom": "5px", "left": "5px" }}
                placeholder='Jane Doe'
              >
              </i-input>
            </i-hstack>
            <i-label
              visible={false}
              font={{ "color": "var(--colors-error-main)" }}
              position='relative'
              maxWidth='30%'
              overflowWrap='break-word'
            >
            </i-label>
          </i-hstack>
          <i-hstack
            gap='8px'
            width='100%'
            height={32}
            border={{ "width": "0px", "top": { "width": "1px", style: 'solid', color: Theme.divider } }}
            alignItems='center'
            padding={{ "right": "8px", "left": "8px" }}
          >
            <i-hstack
              position='relative'
              width='100%'
              gap='4px'
              verticalAlignment='center'
              height='100%'
              alignItems='center'
            >
              <i-icon
                position='relative'
                width='20px'
                height='20px'
                name='phone'
              >
              </i-icon>
              <i-input
                position='relative'
                width='100%'
                height='100%'
                background={{ "color": "transparent" }}
                border={{ "width": "0px" }}
                padding={{ "top": "5px", "right": "5px", "bottom": "5px", "left": "5px" }}
                placeholder='Phone'
              >
              </i-input>
            </i-hstack>
            <i-label
              visible={false}
              font={{ "color": "var(--colors-error-main)" }}
              position='relative'
              maxWidth='30%'
              overflowWrap='break-word'
            >
            </i-label>
          </i-hstack>
          <i-hstack
            gap='8px'
            width='100%'
            height={32}
            border={{ "radius": "4px 4px 0 0", "width": "0px", "top": { "width": "1px", style: 'solid', color: Theme.divider } }}
            alignItems='center'
            padding={{ "right": "8px", "left": "8px" }}
          >
            <i-hstack
              position='relative'
              width='100%'
              gap='4px'
              verticalAlignment='center'
              height='100%'
              alignItems='center'
            >
              <i-icon
                position='relative'
                width='20px'
                height='20px'
                name='envelope'
              >
              </i-icon>
              <i-input
                position='relative'
                width='100%'
                height='100%'
                background={{ "color": "transparent" }}
                border={{ "width": "0px" }}
                padding={{ "top": "5px", "right": "5px", "bottom": "5px", "left": "5px" }}
                placeholder='user@gmail.com'
              >
              </i-input>
            </i-hstack>
            <i-label
              visible={false}
              font={{ "color": "var(--colors-error-main)" }}
              position='relative'
              maxWidth='30%'
              overflowWrap='break-word'
            >
            </i-label>
          </i-hstack>
        </i-vstack>
      </i-vstack>
    </i-panel>
  }
}