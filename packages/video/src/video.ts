import { Container, customElements, ControlElement, Control, RequireJS, LibPath, Border, IBorder } from '@ijstech/base';
import "./style/video.css";
import { GroupType } from '@ijstech/types';

export interface VideoElement extends ControlElement {
  url?: string;
  isStreaming?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-video']: VideoElement;
    }
  }
}

const reqs = ['video-js'];

function loadCss() {
  const cssId = 'videoCss';
  if (!document.getElementById(cssId)) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `${LibPath}lib/video-js/video-js.css`;
    link.media = 'all';
    head.appendChild(link);
  }
}

@customElements("i-video", {
  icon: 'play-circle',
  group: GroupType.BASIC,
  className: 'Video',
  props: {
    url: { type: 'string', default: '' },
    isStreaming: { type: 'boolean', default: false }
  },
  events: {},
  dataSchema: {
    type: 'object',
    properties: {
      url: { type: 'string' },
      isStreaming: { type: 'boolean', default: false }
    }
  }
})
export class Video extends Container {
  private videoElm: HTMLElement;
  private sourceElm: HTMLSourceElement;
  private overlayElm: HTMLElement;
  private player: any;
  private _url: string;
  private _isPlayed: boolean = false;

  get url(): string {
    return this._url;
  }
  set url(value: string) {
    this._url = value;
    if (!this.sourceElm) this.sourceElm = <HTMLSourceElement>this.createElement('source', this.videoElm);
    this.sourceElm.src = value;
    if (this.player) {
      if (value) {
        this.sourceElm.type = "application/x-mpegURL";
        this.player.src({
          src: value,
          type: 'application/x-mpegURL'
        })
      } else {
        this.player.reset();
      }
    } else {
      const videoEl = this.videoElm as HTMLVideoElement;
      if (videoEl?.load) videoEl.load();
    }
  }

  get border(): Border {
    return this._border;
  }
  set border(value: IBorder) {
    const video = this.videoElm?.querySelector('video') as HTMLElement;
    if (!video) return;
    this._border = new Border(video as Control, value);
  }

  set designMode(value: boolean) {
    this._designMode = value;
    if (this.overlayElm) {
      this.overlayElm.style.height = value ? '100%' : 'calc(100% - 3rem)';
      this.overlayElm.style.display = value ? 'block' : 'none';
    }
  }

  getPlayer() {
    if (this.player) return this.player;
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (this.player) {
          clearInterval(interval);
          resolve(this.player);
        }
      }, 100);
    });
  }

  private getVideoTypeFromExtension(url: string) {
    if (!url) return null;
    let videoType;
    let ext = url.split('.').pop();
    switch (ext) {
      case 'mp4':
        videoType = 'video/mp4';
        break;
      case 'webm':
        videoType = 'video/webm';
        break;
      case 'ogg':
        videoType = 'video/ogg';
        break;
      default:
        videoType = 'video/mp4';
        break;
    }
    return videoType;
  }

  protected init() {
    if (!this.initialized) {
      super.init();
      loadCss();
      this.overlayElm = this.createElement("div", this);
      this.overlayElm.classList.add('overlay');
      this.overlayElm.style.height = this._designMode ? '100%' : 'calc(100% - 3rem)';
      this.overlayElm.style.display = this._designMode ? 'block' : 'none';
      const self = this;
      const isStreaming = this.getAttribute('isStreaming', true);
      if (isStreaming) {
        let id = `video-${new Date().getTime()}`;
        this.videoElm = this.createElement("video-js", this) as HTMLElement;
        this.videoElm.id = id;
        this.videoElm.setAttribute("controls", "true");
        this.videoElm.setAttribute("preload", "auto");
        this.videoElm.classList.add('vjs-default-skin');
        this.overlayElm.addEventListener('click', (event: Event) => {
          if (this._designMode) return;
          event.preventDefault();
          event.stopPropagation();
          if (this.player.paused()) {
            this.player.play();
          } else {
            this.player.pause();
          }
        })

        const src = this.getAttribute('url', true);
        const border = this.getAttribute('border', true);
        RequireJS.config({
          baseUrl: `${LibPath}lib/video-js`,
          paths: {
            'video-js': 'video-js'
          }
        })
        RequireJS.require(reqs, function (videojs: any) {
          self.player = videojs(id, {
            playsinline: true,
            autoplay: false,
            controls: true,
            fluid: true,
            responsive: true,
            inactivityTimeout: 500,
            preload: "auto",
            techOrder: ["html5"],
            plugins: {},
            height: '100%',
            width: '100%'
          });
          if (src) {
            self.sourceElm = self.createElement(
              "source",
              self.videoElm
            ) as HTMLSourceElement;
            self.sourceElm.type = "application/x-mpegURL";
            self.sourceElm.src = src;
            self.player.src({
              src,
              type: 'application/x-mpegURL'
            })
          }
          const video = self.videoElm.querySelector('video') as HTMLElement;
          if (video) {
            self.videoElm.insertBefore(self.overlayElm, video);
            if (border) self._border = new Border(video as Control, border);
          }
        });
      }
      else {
        this.videoElm = this.createElement("video", this) as HTMLElement;
        this.videoElm.setAttribute("controls", "true");
        this.videoElm.setAttribute("width", "100%");
        this.insertBefore(this.overlayElm, this.videoElm);
        this.overlayElm.addEventListener('click', (event: Event) => {
          if (this._designMode) return;
          event.preventDefault();
          event.stopPropagation();
          if (this._isPlayed) {
            const video = this.videoElm as HTMLVideoElement;
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
          }
        })
        this.videoElm.addEventListener('canplay', () => {
          this._isPlayed = true;
        })
        this.sourceElm = this.createElement(
          "source",
          this.videoElm
        ) as HTMLSourceElement;
        this.url = this.getAttribute('url', true);
        let videoType = this.getVideoTypeFromExtension(this.url);
        if (videoType) {
          this.sourceElm.type = videoType;
        }
      }
    }
  }

  static async create(options?: VideoElement, parent?: Control) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }
}