import { Styles, Module, customElements, ControlElement, Control, Container, observable } from "@ijstech/components";
const Theme = Styles.Theme.ThemeVars;
import { ITrack } from "../types";

interface PlaylistTrackElement extends ControlElement {
  data?: ITrack;
  onItemClick?: (data: ITrack) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['media-player-playlist--track']: PlaylistTrackElement;
    }
  }
}

@customElements('media-player-playlist--track')
export default class PlaylistTrack extends Module {
  @observable()
  private _data: ITrack = {
    id: '',
    title: '',
    lossyAudioUrl: '',
    slug: "",
    createdAtTime: "",
    platformId: "",
    websiteUrl: "",
    lossyAudioIpfsHash: "",
    lossyArtworkIpfsHash: "",
    artistId: ""
  };

  onItemClick: (data: ITrack) => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  setData(value: ITrack) {
    this._data = value;
  }

  get data() {
    return this._data;
  }

  private onTrackClick(target: Control) {
    if (typeof this.onItemClick === 'function')
      this.onItemClick(this.data);
  }

  render() {
    return <i-hstack
      verticalAlignment='center'
      horizontalAlignment='space-between'
      gap={'0.75rem'}
      height={'3.313rem'}
      border={{ radius: '0.5rem' }}
      margin={{ top: '0.25rem', bottom: '0.25rem' }}
      padding={{ left: '1rem', right: '1rem', top: '0.5rem', bottom: '0.5rem' }}
      background={{ color: Theme.action.hoverBackground }}
      cursor='pointer'
      onClick={this.onTrackClick}
    >
      <i-hstack verticalAlignment='center' gap={'0.75rem'} height={'100%'}>
        <i-image
          url={this.data.lossyArtworkUrl || ''}
          stack={{ shrink: '0' }}
          width={'2.5rem'} height={'2.5rem'}
          objectFit={'cover'}
        ></i-image>
        <i-vstack gap="0.25rem" verticalAlignment='center'>
          <i-label
            caption={this.data.title || ''}
            font={{ size: '1rem' }}
            wordBreak='break-all'
            lineClamp={1}
          ></i-label>
          <i-label
            caption={this.data.artist || ''}
            font={{ size: '0.875rem', color: Theme.text.secondary }}
            textOverflow='ellipsis'
          ></i-label>
        </i-vstack>
      </i-hstack>
      <i-panel hover={{ opacity: 0.5 }}>
        <i-icon name="ellipsis-v" width={'1rem'} height={'1rem'} fill={Theme.text.primary}></i-icon>
      </i-panel>
    </i-hstack>
  }
}
