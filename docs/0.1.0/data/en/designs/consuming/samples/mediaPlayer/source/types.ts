interface IArtist {
  external_urls?: {
    spotify: string;
  };
  followers?: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: any[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

interface ITrack {
  id: string;
  title: string;
  lossyAudioUrl: string;
  artist?: string;
  lossyArtworkUrl?: string;
  duration?: string;
  chorusStart?: string;
  isPlaying?: boolean;
  slug: string;
  createdAtTime: string;
  platformId: string;
  websiteUrl: string;
  lossyAudioIpfsHash: string;
  lossyArtworkIpfsHash: string;
  artistId: string;
}

export {
  IArtist,
  ITrack
}