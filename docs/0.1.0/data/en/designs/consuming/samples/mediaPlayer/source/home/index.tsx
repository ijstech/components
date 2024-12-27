import { Styles, Module, CarouselSlider, FormatUtils, ControlElement, customElements, Container } from "@ijstech/components";
import { DataModel } from "./model";
import { IArtist } from "../types";
const Theme = Styles.Theme.ThemeVars;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['media-player-home']: HomeElement;
    }
  }
}

type onOpenCallback = (artist: IArtist) => void;
interface HomeElement extends ControlElement {
  onOpen?: onOpenCallback;
}

@customElements('media-player-home')
export default class Home extends Module {
  private model: DataModel;
  private startSlider: CarouselSlider;

  onOpen: onOpenCallback;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: HomeElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  private formatNumber(num: number) {
    return FormatUtils.formatNumber(num, { shortScale: true, decimalFigures: 0});
  }

  private renderStartSlider() {
    const items = [];
    for (const artist of this.model.artists) {
      const itemEl = <i-vstack
        verticalAlignment="center"
        horizontalAlignment="center"
        hover={{ opacity: 0.5 }}
        cursor="pointer"
        onClick={() => this.handleOpen(artist)}
      >
        <i-panel
          width={120}
          height={120}
          border={{ radius: '50%' }}
          stack={{ shrink: '0' }}
        >
          <i-image
            border={{ radius: '50%' }}
            width='100%' height='100%'
            url={artist.images?.[0]?.url}
          ></i-image>
        </i-panel>
        <i-vstack margin={{top: '0.5rem'}} gap={8} padding={{bottom: '1rem'}} horizontalAlignment="center">
          <i-label caption={artist.name} font={{ size: '0.875rem' }} class="text-center"></i-label>
          <i-label caption={`${this.formatNumber(artist.followers?.total || 0)}` + " subscribers"} font={{ size: '0.875rem', color: Theme.text.secondary }} class="text-center"></i-label>
        </i-vstack>
      </i-vstack>
      items.push({
        name: '',
        width: '150px',
        controls: [itemEl]
      })
    }
    this.startSlider.items = items;
  }

  private handleOpen(artist: any) {
    if (this.onOpen) this.onOpen(artist);
  }

  init() {
    super.init();
    this.onOpen = this.getAttribute('onOpen', true) || this.onOpen;
    this.model = new DataModel();
    this.renderStartSlider();
  }

  render() {
    return <i-vstack
      width='100%'
      height='100%'
      gap={16}
      padding={{ "top": "16px", "right": "16px", "bottom": "16px", "left": "16px" }}
    >
      <i-panel height={'10%'}></i-panel>
      <i-vstack
        position='relative'
        width='100%'
        height='40%'
        gap={4}
      >
        <i-label
          position='relative'
          caption='Welcome'
          font={{ "size": "12px", transform: 'uppercase' }}
          lineHeight='1.5'
        >
        </i-label>
        <i-label
          position='relative'
          caption='Music to get you started'
          font={{ "size": "16px", "weight": 700 }}
        >
        </i-label>
        <i-panel
          margin={{top: '1rem'}}
        >
          <i-carousel-slider
            id="startSlider"
            width='100%'
            indicators={false}
            slidesToShow={1}
            swipe={true}
            background={{ color: Theme.colors.primary.main }}
          >
          </i-carousel-slider>
        </i-panel>
      </i-vstack>
    </i-vstack>
  }
}