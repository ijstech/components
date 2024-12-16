import { Styles, Module, VStack, Control, customElements, ControlElement, Container, Label, FormatUtils } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;
import { DataModel } from "./model";

interface PlaylistElement extends ControlElement {
  artist?: any;
  tracks?: any[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['media-player-playlist']: PlaylistElement;
    }
  }
}

@customElements('media-player-playlist')
export default class Playlist extends Module {
  private model: DataModel;

  private pnlPlaylist: VStack;
  private pnlInfo: VStack;
  private lblArtist: Label;
  private lblSubscribe: Label;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: PlaylistElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get tracks() {
    return this.model.playList;
  }
  set tracks(value: any[]) {
    this.model.playList = value;
    this.renderPlaylist();
  }

  get artist() {
    return this.model.artist;
  }
  set artist(value: any) {
    this.model.artist = value;
  }

  private renderPlaylist() {
    this.pnlPlaylist.clearInnerHTML();
    const playlist = [...this.tracks];
    for (let i = 0; i < playlist.length; i++) {
      const track = playlist[i];
      const pnlTrack = (
        <i-hstack
          verticalAlignment='center'
          horizontalAlignment='space-between'
          gap={'0.75rem'}
          height={'3.313rem'}
          border={{ radius: '0.5rem' }}
          margin={{ top: '0.25rem', bottom: '0.25rem' }}
          padding={{ left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem' }}
          background={{ color: Theme.action.hoverBackground }}
          cursor='pointer'
          onClick={(target: Control) => this.onTrackClick(target, track)}
        >
          <i-hstack verticalAlignment='center' gap={'0.75rem'} height={'100%'}>
            <i-image
              url={track.lossyArtworkUrl || ''}
              stack={{ shrink: '0' }}
              width={'2.5rem'} height={'2.5rem'}
              objectFit={'cover'}
            ></i-image>
            <i-vstack gap="0.25rem" verticalAlignment='center'>
              <i-label
                caption={track.title || ''}
                font={{ size: '1rem' }}
                wordBreak='break-all'
                lineClamp={1}
              ></i-label>
              <i-label
                caption={track.artist || ''}
                font={{ size: '0.875rem', color: Theme.text.secondary }}
                textOverflow='ellipsis'
              ></i-label>
            </i-vstack>
          </i-hstack>
          <i-panel hover={{ opacity: 0.5 }}>
            <i-icon name="ellipsis-v" width={'1rem'} height={'1rem'} fill={Theme.text.primary}></i-icon>
          </i-panel>
        </i-hstack>
      )
      this.pnlPlaylist.appendChild(pnlTrack);
    }
  }

  private formatNumber(num: number) {
    return FormatUtils.formatNumber(num, { shortScale: true, decimalFigures: 0});
  }

  private renderUI() {
    this.lblArtist.caption = this.artist?.name || '';
    const num = this.formatNumber(this.artist?.followers?.total || 0);
    this.lblSubscribe.caption = `Subscribe ${num}`;
    const img = this.artist?.images?.[0]?.url || '';
    this.pnlInfo.background = {color: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), var(--background-default)), url(${img}) no-repeat center center/cover`}
    this.renderPlaylist();
  }

  private onTrackClick(target: Control, track: any) {
    console.log('onTrackClick', target, track);
  }

  init() {
    super.init();
    this.model = new DataModel();
    this.model.fetchPlaylist();
    this.model.fetchArtist();
    const tracks = this.getAttribute('tracks', true);
    if (tracks) this.tracks = tracks;
    const artist = this.getAttribute('artist', true);
    if (artist) this.artist = artist;
    this.renderUI();
  }

  render() {
    return <i-vstack
      width='100%'
      height='100%'
      gap={16}
      padding={{ "top": "16px", "bottom": "16px" }}
    >
      <i-vstack
        id='pnlInfo'
        position='relative'
        width='100%'
        alignItems='center'
        justifyContent='end'
        height='50%'
        gap={8}
        padding={{ "left": "16px", "right": "16px", "bottom": "16px" }}
      >
        <i-label
          id="lblArtist"
          position='relative'
          font={{ "size": "1.5rem", "weight": 700 }}
          lineHeight='1.5'
        >
        </i-label>
        <i-label
          id="lblSubscribe"
          position='relative'
          caption='Subscribe 18.9M'
          font={{ "size": "12px", "weight": 700, "color": "var(--colors-error-main)", "transform": "uppercase" }}
        >
        </i-label>
        <i-hstack
          position='relative'
          width='100%'
          verticalAlignment='center'
          gap={8}
        >
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            caption='Shuffle'
            border={{ "radius": "4px" }}
            icon={{ "width": 16, "height": 16, "fill": "var(--colors-secondary-contrast_text)", "name": "random" }}
            background={{ "color": "var(--colors-secondary-main)" }}
            font={{transform: 'uppercase'}}
            stack={{ "grow": "1" }}
          >
          </i-button>
          <i-button
            padding={{ "top": "8px", "right": "10px", "bottom": "8px", "left": "10px" }}
            caption='Radio'
            border={{ "radius": "4px" }}
            icon={{ "width": 16, "height": 16, "fill": "var(--colors-primary-contrast_text)", "name": "wifi" }}
            background={{ "color": "var(--colors-primary-main)" }}
            stack={{ "grow": "1" }}
            font={{transform: 'uppercase'}}
          >
          </i-button>
        </i-hstack>
      </i-vstack>
      <i-hstack
        position='relative'
        width='100%'
        horizontalAlignment='space-between'
        gap={8}
        border={{ "radius": "8px" }}
        padding={{ "top": "16px", "right": "16px", "bottom": "16px", "left": "16px" }}
        background={{ "color": "var(--colors-secondary-light)" }}
      >
        <i-vstack
          gap={4}
        >
          <i-label
            caption='Latest Releases'
            font={{ "size": "12px", "transform": "uppercase" }}
            opacity={0.5}
          >
          </i-label>
          <i-label
            caption='Remember the times'
            font={{ "size": "14px", "weight": 700 }}
          >
          </i-label>
          <i-label
            caption='Single 2020'
            opacity={0.5}
            font={{ "size": "12px" }}
          >
          </i-label>
        </i-vstack>
        <i-image                >
        </i-image>
      </i-hstack>
      <i-vstack
        gap={8}
        padding={{ "left": "16px", "right": "16px" }}
        margin={{ top: 8 }}
      >
        <i-label
          caption='Top songs'
          font={{ "weight": 600, "size": "1rem" }}
        >
        </i-label>
        <i-vstack
          id='pnlPlaylist'
          margin={{ "top": "0.75rem" }}
        >
        </i-vstack>
      </i-vstack>
    </i-vstack>
  }
}