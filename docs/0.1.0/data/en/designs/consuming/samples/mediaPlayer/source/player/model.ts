import { ITrack } from "../types";

export class DataModel {
  private _track: ITrack = {
    id: "",
    title: "",
    lossyAudioUrl: "",
    slug: "",
    createdAtTime: "",
    platformId: "",
    websiteUrl: "",
    lossyAudioIpfsHash: "",
    lossyArtworkIpfsHash: "",
    artistId: ""
  };

  constructor() {}

  get track() {
    return this._track;
  }

  set track(value: ITrack) {
    this._track = value;
  }

  getTrack(): ITrack {
    return {
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
      "artist": 'Chaos',
      "duration": "191.14",
      "chorusStart": "51.82"
    }
  }
}