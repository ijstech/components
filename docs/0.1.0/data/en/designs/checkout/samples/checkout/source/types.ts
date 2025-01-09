export interface IPaymentOption {
  id: string;
  name: string;
  img: string;
}

export interface IRoom {
  id: string;
  hotel: {
    name: string;
    stars: number;
    address: string;
    point: number;
    reviewers: number;
    image: string;
  };
  type: string;
  nonSmoking?: boolean;
  includesBreakfast?: boolean;
  amenities?: string[];
  quality?: {
    cleanliness: {
      score: number;
      description: string;
    };
    location: {
      score: number;
      description: string;
    };
    value: {
      score: number;
      description: string;
    };
    service: {
      score: number;
      description: string;
    };
  },
  description?: string;
}

export interface IInformation {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface IBooking {
  id: string;
  checkin: string;
  checkout: string;
  room: string;
  guest: IInformation;
}