import { IArtist, ITrack } from "../types";

export class DataModel {
  private _playList: ITrack[] = [];
  private _artist: IArtist = {
    genres: [],
    href: "",
    id: "",
    images: [],
    name: "",
    popularity: 0,
    type: "",
    uri: ""
  };

  public lastestRelease = {
    track: 'Remember the times',
    album: 'Single 2020'
  }

  constructor() {}

  get playList() {
    return this._playList || [];
  }

  set playList(value: ITrack[]) {
    this._playList = value || [];
  }

  get artist() {
    return this._artist;
  }

  set artist(value: any) {
    this._artist = value;
  }

  fetchArtist(): IArtist {
   return {
      "external_urls": {
        "spotify": "https://open.spotify.com/artist/3fMbdgg4jU18AjLCKBhRSm"
      },
      "followers": {
        "href": '',
        "total": 33777613
      },
      "genres": [
        "r&b",
        "soul"
      ],
      "href": "https://api.spotify.com/v1/artists/3fMbdgg4jU18AjLCKBhRSm?locale=en-US%2Cen%3Bq%3D0.9",
      "id": "3fMbdgg4jU18AjLCKBhRSm",
      "images": [
        {
          "url": "https://i.scdn.co/image/ab6761610000e5eb997cc9a4aec335d46c9481fd",
          "height": 640,
          "width": 640
        },
        {
          "url": "https://i.scdn.co/image/ab67616100005174997cc9a4aec335d46c9481fd",
          "height": 320,
          "width": 320
        },
        {
          "url": "https://i.scdn.co/image/ab6761610000f178997cc9a4aec335d46c9481fd",
          "height": 160,
          "width": 160
        }
      ],
      "name": "Michael Jackson",
      "popularity": 85,
      "type": "artist",
      "uri": "spotify:artist:3fMbdgg4jU18AjLCKBhRSm"
    }
  }

  fetchPlaylist(): ITrack[] {
    return [
      {
        "id": "ethereum/0x8427e46826a520b1264B55f31fCB5DDFDc31E349/way-of-the-dao",
        "title": "Way Of The DAO",
        "slug": "way-of-the-dao-1654292532000",
        "createdAtTime": "2022-06-03T21:42:12+00:00",
        "platformId": "0x8427e46826a520b1264b55f31fcb5ddfdc31e349",
        "websiteUrl": "https://www.chaos.build/",
        "lossyAudioUrl": "https://web3-music-pipeline.mypinata.cloud/ipfs/QmUbtVMriquE1RAL2rdNnA8Yd5GKfZamnPN9zbn8uCbivD/Act%203%20Alchemy%20A%20-%20Way%20Of%20The%20DAO.mp3",
        "lossyArtworkUrl": "https://web3-music-pipeline.mypinata.cloud/ipfs/bafybeih7263ymuee7mkaapkm2aqfmcw5f2zphr4bn4y5yewlmx5noweifq//9968.png",
        "lossyAudioIpfsHash": "QmUbtVMriquE1RAL2rdNnA8Yd5GKfZamnPN9zbn8uCbivD/Act%203%20Alchemy%20A%20-%20Way%20Of%20The%20DAO.mp3",
        "lossyArtworkIpfsHash": "bafybeih7263ymuee7mkaapkm2aqfmcw5f2zphr4bn4y5yewlmx5noweifq//9968.png",
        "artistId": "$0x8427e46826a520b1264B55f31fCB5DDFDc31E349",
        artist: 'Chaos',
        "duration": "191.14",
        "chorusStart": "51.82"
      },
      {
        "id": "ethereum/0x8427e46826a520b1264B55f31fCB5DDFDc31E349/bonsai",
        "title": "Bonsai",
        "slug": "bonsai-1654174830000",
        "createdAtTime": "2022-06-02T13:00:30+00:00",
        "platformId": "0x8427e46826a520b1264b55f31fcb5ddfdc31e349",
        "websiteUrl": "https://www.chaos.build/",
        "lossyAudioUrl": "https://web3-music-pipeline.mypinata.cloud/ipfs/QmUbtVMriquE1RAL2rdNnA8Yd5GKfZamnPN9zbn8uCbivD/Act%203%20Band%202%20-%20Bonsai.mp3",
        "lossyArtworkUrl": "https://web3-music-pipeline.mypinata.cloud/ipfs/bafybeih7263ymuee7mkaapkm2aqfmcw5f2zphr4bn4y5yewlmx5noweifq//371.png",
        "lossyAudioIpfsHash": "QmUbtVMriquE1RAL2rdNnA8Yd5GKfZamnPN9zbn8uCbivD/Act%203%20Band%202%20-%20Bonsai.mp3",
        "lossyArtworkIpfsHash": "bafybeih7263ymuee7mkaapkm2aqfmcw5f2zphr4bn4y5yewlmx5noweifq//371.png",
        "artistId": "$0x8427e46826a520b1264B55f31fCB5DDFDc31E349",
        artist: "Chaos",
        "duration": "172.93",
        "chorusStart": "116.65"
      }
    ]
  }
}