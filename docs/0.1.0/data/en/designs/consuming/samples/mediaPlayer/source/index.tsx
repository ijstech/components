import { Module } from "@ijstech/components";
import Home from "./home/index";
import Playlist from "./playlist/index";

export default class MediaPlayer extends Module {
  private home: Home;
  private playlist: Playlist;

  private openPlaylist() {
    this.playlist.visible = true;
    this.home.visible = false;
  }

  init() {
    super.init();
    this.openPlaylist = this.openPlaylist.bind(this);
  }

  render() {
    return <i-panel
      width='100%'
      height='100%'
    >
      <media-player-home
        id="home"
        display='block'
        width='100%'
        height='100%'
        visible={true}
        onOpen={this.openPlaylist}
      />
      <media-player-playlist
        id="playlist"
        display='block'
        width='100%'
        height='100%'
        visible={false}
      />
    </i-panel>
  }
}
