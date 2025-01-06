import { Control, Styles, Module, Button, customElements, ControlElement, Container, Repeater } from "@ijstech/components";
import { DataModel } from "./model";
import { customScrollbarCss } from './index.css';
const Theme = Styles.Theme.ThemeVars;

interface DetailsMainElement extends ControlElement { }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'i-details': DetailsMainElement;
    }
  }
}

@customElements('i-details')
export default class DetailsMain extends Module {
  private model: DataModel = new DataModel();

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  private onLengthRender(parent: Control, index: number) {
    const repeater = parent.closest('i-repeater');
    const prop = repeater?.id === 'lengthsRepeater' ? 'lengths' : 'preferences';
    const childEl = parent.children?.[index] as Button;
    const data = this.model?.[prop]?.[index];
    if (childEl && data) {
      childEl.caption = data.name;
      childEl.onClick = this.onSelected.bind(this);
    }
  };

  private onDateRender(parent: Control, index: number) {
    const repeater = parent.closest('i-repeater');
    const prop = repeater?.id === 'datesRepeater' ? 'dates' : 'times';
    const childEl = parent.children?.[index] as Button;
    const data = this.model?.[prop]?.[index];
    if (childEl && data) {
      childEl.caption = data;
    }
  };

  private onSelected(target: Button) {
    const parent = target.closest('.repeater-container');
    const children = parent?.children || [];
    for (const child of children) {
      const btn = child.firstChild as Button;
      if (btn) btn.background = { color: 'transparent' };
    }
    target.background = { color: Theme.action.activeBackground };
  }

  init() {
    super.init();
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
        class="text-center"
        padding={{ "top": "16px", "right": "32px", "bottom": "16px", "left": "32px" }}
      >
        <i-label
          position='relative'
          caption='Deep Tissue'
          font={{ "size": "16px", "weight": "600" }}
          lineHeight='1.75rem'
          border={{ "bottom": { "width": "2px", "style": "solid", "color": "var(--divider)" } }}
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
        <i-repeater
          id='lengthsRepeater'
          width='100%'
          layout='horizontal'
          justifyContent="space-between"
          data={this.model.lengths}
          onRender={this.onLengthRender}
        >
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            background={{ "color": "transparent" }}
            border={{ "radius": "999px", "width": "1px", "style": "solid", "color": "var(--divider)" }}
            stack={{basis: '30%'}}
          >
          </i-button>
        </i-repeater>
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
        <i-repeater
          id='referencesRepeater'
          width='100%'
          layout='horizontal'
          justifyContent="space-between"
          data={this.model.preferences}
          onRender={this.onLengthRender}
        >
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            background={{ "color": "transparent" }}
            border={{ "radius": "999px", "width": "1px", "style": "solid", "color": "var(--divider)" }}
            stack={{ basis: '30%' }}
          >
          </i-button>
        </i-repeater>
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
        <i-hstack
          verticalAlignment='center'
          horizontalAlignment='space-between'
          padding={{ "top": "4px", "right": "4px", "bottom": "4px", "left": "4px" }}
        >
          <i-vstack
            stack={{ "basis": "50%" }}
            position="relative"
          >
            <i-label
              caption="Fri Oct 15"
              display="block"
              lineHeight="24px"
              top={'calc(50% - 9px)'}
              left={0}
              width="100%"
              zIndex={11}
              class="text-center"
            ></i-label>
            <i-panel
              top={'calc(50% - 9px)'}
              left={0}
              width="100%"
              height={24}
              zIndex={10}
              background={{color: Theme.background.default}}
            ></i-panel>
            <i-repeater
              id='datesRepeater'
              gap={4}
              width='100%'
              height={72}
              overflow={{y: 'auto'}}
              data={this.model.dates}
              onRender={this.onDateRender}
              class={`text-center ${customScrollbarCss}`}
            >
              <i-label
                caption=''
                opacity={0.5}
                font={{ "size": "12px" }}
                lineHeight="24px"
              />
            </i-repeater>
          </i-vstack>
          <i-vstack
            stack={{ "basis": "50%" }}
            position="relative"
          >
            <i-label
              caption="12:00 PM"
              display="block"
              lineHeight="24px"
              top={'calc(50% - 9px)'}
              left={0}
              width="100%"
              zIndex={11}
              class="text-center"
            ></i-label>
            <i-panel
              top={'calc(50% - 9px)'}
              left={0}
              width="100%"
              height={24}
              zIndex={10}
              background={{color: Theme.background.default}}
            ></i-panel>
            <i-repeater
              id='timesRepeater'
              gap={4}
              width='100%'
              height={72}
              overflow={{ y: 'auto' }}
              data={this.model.times}
              onRender={this.onDateRender}
              class={`text-center ${customScrollbarCss}`}
            >
              <i-label
                caption=''
                opacity={0.5}
                font={{ "size": "12px" }}
                lineHeight="24px"
              />
            </i-repeater>
          </i-vstack>
        </i-hstack>

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