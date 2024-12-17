import { Styles, Module, Button } from "@ijstech/components";
import { DataModel } from "./model";
const Theme = Styles.Theme.ThemeVars;

export default class Details extends Module {
  private model: DataModel;

  private onSelected(target: Button) {
    const parent = target.parent;
    const children = parent.children;
    for (const child of children) {
      (child as Button).background = { color: 'transparent' };
    }
    target.background = { color: Theme.action.activeBackground };
  }

  init() {
    super.init();
    this.model = new DataModel();
  }

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
            caption='Booking'
          >
          </i-label>
        </i-hstack>
      </i-hstack>
      <i-carousel-slider
        position='relative'
        width='100%'
        type='arrow'
        height='190px'
      >
        <i-panel
          position='relative'
          width='100%'
          overflow='hidden'
        >
          <i-image
            url='https://placehold.co/600x400?text=No+Image'
            display='block'
            width='100%'
            maxHeight='100%'
          >
          </i-image>
        </i-panel>
        <i-panel
          position='relative'
          width='100%'
        >
          <i-image
            url='https://placehold.co/600x400?text=No+Image'
            display='block'
            width='100%'
          >
          </i-image>
        </i-panel>
      </i-carousel-slider>
      <i-vstack
        position='relative'
        width='100%'
        gap={8}
        alignItems='center'
        justifyContent='center'
        margin={{ "top": "auto" }}
        class='text-center'
        padding={{ "top": "16px", "right": "32px", "bottom": "16px", "left": "32px" }}
      >
        <i-label
          position='relative'
          caption='Deep Tissue'
          font={{ "size": "16px", "weight": "600" }}
          lineHeight='1.75rem'
          border={{ bottom: { width: '2px', style: 'solid', color: Theme.divider } }}
        >
        </i-label>
        <i-label
          position='relative'
          caption='Strong massage style that will relax and soothe your tension.'
          font={{ "size": "14px" }}
          opacity='0.75'
        >
        </i-label>
      </i-vstack>
      <i-vstack
        position='relative'
        width='100%'
        margin={{ "top": "10px" }}
        gap={6}
        padding={{ "right": "16px", "left": "16px" }}
      >
        <i-label
          position='relative'
          caption='Length'
        >
        </i-label>
        <i-hstack
          position='relative'
          width='100%'
          gap={4}
          justifyContent='space-between'
        >
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            caption='60 min'
            background={{ "color": "transparent" }}
            stack={{ basis: '30%' }}
            border={{ "radius": "999px", "width": "1px", "style": "solid", "color": "var(--divider)" }}
            onClick={this.onSelected}
          >
          </i-button>
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            caption='90 min'
            background={{ "color": "transparent" }}
            stack={{ basis: '30%' }}
            border={{ "radius": "999px", "width": "1px", "style": "solid", "color": "var(--divider)" }}
            onClick={this.onSelected}
          >
          </i-button>
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            caption='120 min'
            background={{ "color": "transparent" }}
            stack={{ basis: '30%' }}
            border={{ "radius": "999px", "width": "1px", "style": "solid", "color": "var(--divider)" }}
            onClick={this.onSelected}
          >
          </i-button>
        </i-hstack>
      </i-vstack>
      <i-vstack
        position='relative'
        width='100%'
        margin={{ "top": "18px" }}
        gap={6}
        padding={{ "right": "16px", "left": "16px" }}
      >
        <i-label
          position='relative'
          caption='Therapist Reference'
        >
        </i-label>
        <i-hstack
          position='relative'
          width='100%'
          gap={4}
          justifyContent='space-between'
        >
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            caption='Female'
            background={{ "color": "transparent" }}
            stack={{ basis: '30%' }}
            border={{ "radius": "999px", "width": "1px", "style": "solid", "color": "var(--divider)" }}
            onClick={this.onSelected}
          >
          </i-button>
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            caption='Either'
            background={{ "color": "transparent" }}
            stack={{ basis: '30%' }}
            border={{ "radius": "999px", "width": "1px", "style": "solid", "color": "var(--divider)" }}
            onClick={this.onSelected}
          >
          </i-button>
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            caption='Male'
            background={{ "color": "transparent" }}
            stack={{ basis: '30%' }}
            border={{ "radius": "999px", "width": "1px", "style": "solid", "color": "var(--divider)" }}
            onClick={this.onSelected}
          >
          </i-button>
        </i-hstack>
      </i-vstack>
      <i-vstack
        position='relative'
        width='100%'
        margin={{ "top": "18px" }}
        gap={4}
        padding={{ "right": "16px", "left": "16px" }}
      >
        <i-label
          position='relative'
          caption='Date/Time'
        >
        </i-label>
        <i-vstack
          width='100%'
        >
          <i-hstack
            gap={4}
            verticalAlignment='center'
            horizontalAlignment='space-between'
            padding={{ "top": "4px", "right": "4px", "bottom": "4px", "left": "4px" }}
          >
            <i-label
              caption='Thu Oct 14'
              opacity={0.5}
              font={{ "size": "12px" }}
              stack={{ basis: '50%' }}
              class="text-center"
            >
            </i-label>
            <i-label
              caption='12:00 PM'
              opacity={0.5}
              font={{ "size": "12px" }}
              stack={{ basis: '50%' }}
              class="text-center"
            >
            </i-label>
          </i-hstack>
          <i-hstack
            gap={4}
            verticalAlignment='center'
            horizontalAlignment='space-between'
            padding={{ "top": "4px", "right": "4px", "bottom": "4px", "left": "4px" }}
          >
            <i-label
              caption='Fri Oct 15'
              stack={{ basis: '50%' }}
              class="text-center"
            >
            </i-label>
            <i-label
              caption='12:00 PM'
              stack={{ basis: '50%' }}
              class="text-center"
            >
            </i-label>
          </i-hstack>
          <i-hstack
            gap={4}
            verticalAlignment='center'
            horizontalAlignment='space-between'
            padding={{ "top": "4px", "right": "4px", "bottom": "4px", "left": "4px" }}
          >
            <i-label
              caption='Sat Oct 16'
              opacity={0.5}
              font={{ "size": "12px" }}
              stack={{ basis: '50%' }}
              class="text-center"
            >
            </i-label>
            <i-label
              caption='12:00 PM'
              opacity={0.5}
              font={{ "size": "12px" }}
              stack={{ basis: '50%' }}
              class="text-center"
            >
            </i-label>
          </i-hstack>
        </i-vstack>
        <i-button
          padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
          caption='Continue'
          border={{ "radius": "999px" }}
        >
        </i-button>
      </i-vstack>
    </i-panel>
  }
}