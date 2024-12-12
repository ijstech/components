import { Styles, Module, CarouselSlider, FormatUtils } from "@ijstech/components";
import { customStyles } from "./index.css";
import { DataModel } from "./model";
const Theme = Styles.Theme.ThemeVars;

export default class MediaPlayer extends Module {
  private model: DataModel;
  private startSlider: CarouselSlider;

  private formatNumber(num: number) {
    return FormatUtils.formatNumber(num, {shortScale: true});
  }

  private renderStartSlider() {
    this.model.fetchArtists();
    const items = [];
    for (const artist of this.model.artists) {
      const itemEl = <i-vstack
        verticalAlignment="center"
        horizontalAlignment="center"
        hover={{ opacity: 0.5 }}
        cursor="pointer"
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
        controls: [itemEl]
      })
    }
    this.startSlider.items = items;
  }

  init() {
    super.init();
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
        <i-carousel-slider
          id="startSlider"
          width='100%'
          indicators={false}
          slidesToShow={1}
          swipe={true}
          margin={{top: '1rem'}}
          class={customStyles}
          background={{ color: Theme.colors.primary.main }}
        >
        </i-carousel-slider>
      </i-vstack>
    </i-vstack>
  }
}