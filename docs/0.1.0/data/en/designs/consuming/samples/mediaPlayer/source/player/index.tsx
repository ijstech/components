import {
  ControlElement,
  customElements,
  Module,
  Styles,
  Container,
  Icon,
  Image,
  Label,
  Range,
  Panel,
  moment,
  Control,
  GridLayout
} from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;
import { DataModel } from './model';

type callbackType = () => void;
export interface ITrack {
  id: string;
  title: string;
  lossyAudioUrl: string;
  artist?: string;
  lossyArtworkUrl?: string;
  duration?: string;
  chorusStart?: string;
  isPlaying?: boolean;
}

interface PlayerElement extends ControlElement {
  track?: ITrack;
  onNext?: callbackType;
  onPrev?: callbackType;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['media-player-player']: PlayerElement;
    }
  }
}

interface IPlayer {
  track?: ITrack;
}

@customElements('media-player-player')
export default class Player extends Module {
  private player: HTMLAudioElement;
  private iconPlay: Icon;
  private imgTrack: Image;
  private lblTrack: Label;
  private lblArtist: Label;
  private trackRange: Range;
  private lblStart: Label;
  private lblEnd: Label;
  private pnlRange: Panel;
  private playerWrapper: Panel;
  private pnlInfo: Panel;
  private pnlControls: Panel;
  private pnlTimeline: Panel;
  private pnlFooter: Panel;
  private playerGrid: GridLayout;

  private model: DataModel;
  private _data: IPlayer = {};
  private isPlaying: boolean = false;
  private isMinimized: boolean = false;

  onNext: callbackType;
  onPrev: callbackType;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: PlayerElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get track() {
    return this._data.track;
  }
  set track(value: ITrack) {
    this._data.track = value;
  }

  setData(data: IPlayer) {
    this.isPlaying = false;
    this.isMinimized = false;
    this._data = { ...data };
    this.initPlayer(this.track?.lossyAudioUrl || '');
  }

  playTrack(track: ITrack) {
    const self = this;
    if (this.track?.id && this.track.id === track.id) {
      this.togglePlay();
    } else {
      this.track = track;
      this.renderTrack();
      this.player.pause();
      this.initPlayer(track.lossyAudioUrl);
      this.player.play();
      this.isPlaying = true;
      this.iconPlay.name = 'pause-circle';
    }
  }

  private initPlayer(url: string) {
    const self = this;
    this.player = new Audio(url);
    this.player.ontimeupdate = () => {
      self.trackRange.value = self.player.currentTime;
      self.lblStart.caption = moment(self.player.currentTime * 1000).format('mm:ss');
    }
    this.player.onended = () => {
      self.isPlaying = false;
      self.iconPlay.name = 'play-circle';
    }
  }

  private onRangeChanged(target: Range) {
    this.player.currentTime = target.value;
  }

  private renderTrack() {
    this.pnlRange.clearInnerHTML();
    const duration = parseFloat(this.track?.duration || '0');
    this.trackRange = <i-range
      min={0}
      max={duration}
      value={0}
      step={1}
      width={'100%'}
      onChanged={this.onRangeChanged.bind(this)}
    ></i-range>
    this.pnlRange.appendChild(this.trackRange);
    this.imgTrack.url = this.track?.lossyArtworkUrl || '';
    this.lblArtist.caption = this.track?.artist || '';
    this.lblTrack.caption = this.track?.title || '';
    this.lblEnd.caption = moment(duration * 1000).format('mm:ss');
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.player.play();
      this.iconPlay.name = 'pause-circle';
    } else {
      this.player.pause();
      this.iconPlay.name = 'play-circle';
    }
  }

  private playNextTrack() {
    if (this.onNext) this.onNext();
  }

  private playPrevTrack() {
    if (this.onPrev) this.onPrev();
  }

  private onPlay() {
    if (this.track) this.playTrack(this.track);
  }

  private onCollect() { }

  private onExpand(target: Control, event: MouseEvent) {
    event.stopPropagation();
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    this.isMinimized = !this.isMinimized;
    if (this.isMinimized) {
      this.playerWrapper.mediaQueries = [{
        maxWidth: '767px',
        properties: {
          position: 'fixed',
          bottom: '0.5rem',
          zIndex: 9999,
          maxHeight: '3.5rem'
        }
      }];
      this.playerGrid.mediaQueries = [{
        maxWidth: '767px',
        properties: {
          padding: { left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem' },
          gap: { row: '0px !important', column: '0.5rem !important' },
          templateColumns: ['2.5rem', 'repeat(2, 1fr)'],
          templateRows: ['1fr']
        }
      }];
      this.pnlTimeline.mediaQueries = [{
        maxWidth: '767px',
        properties: { visible: false }
      }];
      this.pnlFooter.mediaQueries = [{
        maxWidth: '767px',
        properties: { visible: false }
      }];
      this.imgTrack.mediaQueries = [{
        maxWidth: '767px',
        properties: {
          maxWidth: '2.5rem',
          border: { radius: '50%' }
        }
      }];
    } else {
      this.playerGrid.mediaQueries = [];
      this.playerWrapper.mediaQueries = [
        {
          maxWidth: '767px',
          properties: {
            position: 'fixed',
            bottom: '0px',
            zIndex: 9999,
            maxHeight: '100dvh'
          }
        }
      ];
      this.pnlTimeline.mediaQueries = [];
      this.pnlFooter.mediaQueries = [];
      this.imgTrack.mediaQueries = [];
    }
  }

  private renderControls() {
    this.imgTrack = (
      <i-panel position="relative" width="100%" height={0} overflow="hidden" padding={{ bottom: "80%" }}>
        <i-image
          position="absolute"
          display="block"
          width="100%"
          height="auto"
          top={0}
          left={0}
          url={this.track.lossyArtworkUrl || ''}
        ></i-image>
      </i-panel>
    )
    this.pnlInfo = (
      <i-hstack
        id="pnlInfo"
        horizontalAlignment='space-between'
        margin={{ top: '1rem', bottom: '1rem' }}
        width={'100%'}
        padding={{ "left": "1rem", "right": "1rem" }}
        mediaQueries={[
          {
            maxWidth: '767px',
            properties: {
              margin: { top: 0, bottom: 0 }
            }
          }
        ]}
      >
        <i-panel
          cursor='pointer'
          hover={{ opacity: 0.5 }}
        >
          <i-icon
            name='exclamation-circle'
            width={'1rem'} height={'1rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
        <i-vstack gap="0.25rem" class="text-center">
          <i-label
            id="lblTrack"
            caption={this.track.title || ''}
            font={{ weight: 600, size: 'clamp(1rem, 0.95rem + 0.25vw, 1.25rem)' }}
            lineHeight={'1.375rem'}
            maxWidth={'100%'}
            textOverflow='ellipsis'
          ></i-label>
          <i-label
            id="lblArtist"
            caption={this.track.artist || ''}
            font={{ size: 'clamp(0.75rem, 0.7rem + 0.25vw, 1rem)' }}
          ></i-label>
        </i-vstack>
        <i-panel
          cursor='pointer'
          hover={{ opacity: 0.5 }}
        >
          <i-icon
            name='ellipsis-v'
            width={'1rem'} height={'1rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
      </i-hstack>
    )
    const duration = parseFloat(this.track?.duration || '0');
    this.pnlTimeline = (
      <i-vstack
        id="pnlTimeline"
        width={'100%'}
        padding={{ "left": "1rem", "right": "1rem" }}
      >
        <i-panel id="pnlRange">
          <i-range
            id="trackRange"
            min={0}
            max={duration}
            value={0}
            step={1}
            width={'100%'}
            onChanged={this.onRangeChanged.bind(this)}
          ></i-range>
        </i-panel>
        <i-hstack
          horizontalAlignment='space-between'
          gap="0.25rem"
        >
          <i-label id="lblStart" caption='0:00' font={{ size: '0.875rem' }}></i-label>
          <i-label id='lblEnd' caption={moment(duration * 1000).format('mm:ss')} font={{ size: '0.875rem' }}></i-label>
        </i-hstack>
      </i-vstack>
    )
    this.pnlControls = (
      <i-hstack
        id="pnlControls"
        verticalAlignment='center'
        horizontalAlignment='space-between'
        gap={'1.25rem'}
        width={'80%'}
        margin={{ left: 'auto', right: 'auto' }}
        mediaQueries={[
          {
            maxWidth: '767px',
            properties: {
              gap: '0.5rem'
            }
          }
        ]}
      >
        <i-panel cursor='pointer' hover={{ opacity: 0.5 }}>
          <i-icon
            name="thumbs-down"
            width={'1rem'}
            height={'1rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
        <i-grid-layout
          verticalAlignment="stretch"
          columnsPerRow={3}
          maxWidth={'80%'}
          height={'3rem'}
          border={{ radius: '0.25rem', width: '1px', style: 'solid', color: Theme.divider }}
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {
                border: { radius: '0px', width: '1px', style: 'none', color: Theme.divider }
              }
            }
          ]}
          stack={{ grow: '1', shrink: '1' }}
        >
          <i-vstack
            verticalAlignment='center'
            horizontalAlignment='center'
            cursor='pointer'
            hover={{ opacity: 0.5 }}
            onClick={() => this.playPrevTrack()}
          >
            <i-icon
              name="step-backward"
              width={'0.75rem'} height={'0.75rem'}
              fill={Theme.text.primary}
            ></i-icon>
          </i-vstack>
          <i-vstack
            verticalAlignment='center'
            horizontalAlignment='center'
            cursor='pointer'
            hover={{ opacity: 0.5 }}
            onClick={() => this.onPlay()}
          >
            <i-icon
              id="iconPlay"
              name="play-circle"
              width={'1.75rem'} height={'1.75rem'}
              fill={Theme.text.primary}
            ></i-icon>
          </i-vstack>
          <i-vstack
            verticalAlignment='center'
            horizontalAlignment='center'
            cursor='pointer'
            hover={{ opacity: 0.5 }}
            onClick={() => this.playNextTrack()}
          >
            <i-icon
              name="step-forward"
              width={'0.75rem'} height={'0.75rem'}
              fill={Theme.text.primary}
            ></i-icon>
          </i-vstack>
        </i-grid-layout>
        <i-panel cursor='pointer' hover={{ opacity: 0.5 }}>
          <i-icon
            name="thumbs-up"
            width={'1rem'} height={'1rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
      </i-hstack>
    )
    this.pnlFooter = (
      <i-hstack
        id="pnlFooter"
        verticalAlignment='center'
        horizontalAlignment='space-between'
        gap={'1.25rem'}
        width={'100%'}
        padding={{ "left": "1rem", "right": "1rem" }}
        visible={false}
        margin={{ top: '1rem' }}
      >
        <i-panel cursor='pointer' hover={{ opacity: 0.5 }}>
          <i-icon
            name="music"
            width={'1.25rem'} height={'1.25rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
        <i-hstack
          verticalAlignment="center"
          gap="0.25rem"
          cursor='pointer'
          onClick={this.onCollect}
        >
          <i-panel cursor='pointer' hover={{ opacity: 0.5 }}>
            <i-icon
              name="exclamation-circle"
              width={'1.25rem'} height={'1.25rem'}
              fill={Theme.text.primary}
            ></i-icon>
          </i-panel>
          <i-label
            caption='Collect'
            font={{ size: '0.875rem', weight: 600 }}
          ></i-label>
        </i-hstack>
        <i-panel cursor='pointer' hover={{ opacity: 0.5 }}>
          <i-icon
            name="share"
            width={'1.25rem'} height={'1.25rem'}
            fill={Theme.text.primary}
          ></i-icon>
        </i-panel>
      </i-hstack>
    )

    this.playerGrid.append(this.imgTrack, this.pnlInfo, this.pnlTimeline, this.pnlControls, this.pnlFooter);
  }

  init() {
    super.init();
    this.model = new DataModel();
    this.onNext = this.getAttribute('onNext', true) || this.onNext;
    this.onPrev = this.getAttribute('onPrev', true) || this.onPrev;
    const track = this.getAttribute('track', true);
    if (track) this.setData({ track });
    this.setData({ track: this.model.getTrack() });
    this.renderControls();
  }

  render() {
    return <i-panel
      id='playerWrapper'
      width='100%'
      height='100%'
    >
      <i-grid-layout
        id='playerGrid'
        gap={{ "row": "1rem", "column": "0px" }}
        width='100%'
        height='100%'
        templateRows={["auto"]}
        templateColumns={["1fr"]}
        verticalAlignment='stretch'
        padding={{bottom: '1.25rem'}}
        // onClick={this.onExpand}
      >
      </i-grid-layout>
    </i-panel>
  }
}
