import { Module, VStack, Control, customElements, ControlElement, Container, Label, FormatUtils, observable, Repeater } from "@ijstech/components";
import { DataModel } from "./model";
import Player from "../player/index";
import PlaylistTrack from "./track";
import { IArtist, ITrack } from "../types";

interface PlaylistElement extends ControlElement {
  artist?: IArtist;
  tracks?: ITrack[];
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
  @observable()
  private model: DataModel = new DataModel();

  private playlistWrapper: VStack;
  private playlistRepeater: Repeater;
  private pnlInfo: VStack;
  private lblSubscribe: Label;
  private player: Player;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: PlaylistElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get tracks() {
    return this.model.playList || [];
  }
  set tracks(value: ITrack[]) {
    this.model.playList = value || [];
  }

  get artist() {
    return this.model.artist;
  }
  set artist(value: IArtist) {
    this.model.artist = value;
  }

  private formatNumber(num: number) {
    return FormatUtils.formatNumber(num, { shortScale: true, decimalFigures: 0 });
  }

  private renderUI() {
    const num = this.formatNumber(this.artist?.followers?.total || 0);
    this.lblSubscribe.caption = `Subscribe ${num}`;
    const img = this.artist?.images?.[0]?.url || '';
    this.pnlInfo.background = { color: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), var(--background-default)), url(${img}) no-repeat center center/cover` }
  }

  private handleOnNext() {
    const trackIndex = this.tracks.findIndex(track => this.player?.track?.id && track.id === this.player.track.id);
    const maxIndex = this.tracks.length;
    const nextIndex = (((trackIndex + 1) % maxIndex) + maxIndex) % maxIndex;
    this.player.onPlay(this.tracks[nextIndex]);
  }

  private handleOnPrev() {
    const trackIndex = this.tracks.findIndex(track => this.player?.track?.id && track.id === this.player.track.id);
    const maxIndex = this.tracks.length;
    const prev = (((trackIndex + -1) % maxIndex) + maxIndex) % maxIndex;
    this.player.onPlay(this.tracks[prev]);
  }

  private handleRender(target: Control, index: number) {
    const el = target.children?.[index] as PlaylistTrack;
    const data = this.model.playList?.[index];
    if (el && data) {
      el.setData(data);
      el.onItemClick = this.onTrackClick.bind(this);
    }
  }

  private onTrackClick(track: ITrack) {
    this.playlistWrapper.visible = false;
    this.player.visible = true;
    this.player.setData({ track });
  }

  init() {
    super.init();
    this.tracks = this.model.fetchPlaylist();
    this.artist = this.model.fetchArtist();

    const tracks = this.getAttribute('tracks', true);
    if (tracks) this.tracks = tracks;
    const artist = this.getAttribute('artist', true);
    if (artist) this.artist = artist;

    const trackEl = document.createElement('media-player-playlist--track') as PlaylistTrack;
    this.playlistRepeater.add(trackEl);
    this.renderUI();
  }

  render() {
    return <i-panel
      width='100%'
      height='100%'
    >
      <i-vstack
        id="playlistWrapper"
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
            caption={this.model.artist?.name}
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
              font={{ transform: 'uppercase' }}
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
              font={{ transform: 'uppercase' }}
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
              caption={this.model.lastestRelease?.track}
              font={{ "size": "14px", "weight": 700 }}
            >
            </i-label>
            <i-label
              caption={this.model.lastestRelease?.album}
              opacity={0.5}
              font={{ "size": "12px" }}
            >
            </i-label>
          </i-vstack>
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
          <i-repeater
            id="playlistRepeater"
            data={this.model.playList}
            margin={{ top: '0.75rem' }}
            onRender={this.handleRender}
          >
          </i-repeater>
        </i-vstack>
      </i-vstack>
      <media-player-player
        id="player"
        display='block'
        width='100%'
        height='100%'
        visible={false}
        onNext={this.handleOnNext}
        onPrev={this.handleOnPrev}
      />
    </i-panel>
  }
}