import { IArtist } from "../types";

export class DataModel {
  private _artists: IArtist[] = [];

  constructor() {
    this._artists = this.fetchArtists();
  }

  get artists() {
    return this._artists;
  }

  set artists(value: IArtist[]) {
    this._artists = value;
  }

  fetchArtists(): IArtist[] {
    return [
      {
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
      },
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02"
        },
        "followers": {
          "href": '',
          "total": 128001442
        },
        "genres": [
          "pop"
        ],
        "href": "https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02?locale=en-US%2Cen%3Bq%3D0.9",
        "id": "06HL4z0CvFAxyc27GXpf02",
        "images": [
          {
            "url": "https://i.scdn.co/image/ab6761610000e5ebe672b5f553298dcdccb0e676",
            "height": 640,
            "width": 640
          },
          {
            "url": "https://i.scdn.co/image/ab67616100005174e672b5f553298dcdccb0e676",
            "height": 320,
            "width": 320
          },
          {
            "url": "https://i.scdn.co/image/ab6761610000f178e672b5f553298dcdccb0e676",
            "height": 160,
            "width": 160
          }
        ],
        "name": "Taylor Swift",
        "popularity": 100,
        "type": "artist",
        "uri": "spotify:artist:06HL4z0CvFAxyc27GXpf02"
      },
      {
        "external_urls": {
          "spotify": "https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C"
        },
        "followers": {
          "href": '',
          "total": 63889217
        },
        "genres": [
          "dance pop",
          "pop"
        ],
        "href": "https://api.spotify.com/v1/artists/0du5cEVh5yTK9QJze8zA0C?locale=en-US%2Cen%3Bq%3D0.9",
        "id": "0du5cEVh5yTK9QJze8zA0C",
        "images": [
          {
            "url": "https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55fb0db4911f25dd",
            "height": 640,
            "width": 640
          },
          {
            "url": "https://i.scdn.co/image/ab67616100005174c36dd9eb55fb0db4911f25dd",
            "height": 320,
            "width": 320
          },
          {
            "url": "https://i.scdn.co/image/ab6761610000f178c36dd9eb55fb0db4911f25dd",
            "height": 160,
            "width": 160
          }
        ],
        "name": "Bruno Mars",
        "popularity": 96,
        "type": "artist",
        "uri": "spotify:artist:0du5cEVh5yTK9QJze8zA0C"
      }
    ]
  }
}