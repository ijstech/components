import { IBooking, IInformation, IPaymentOption, IRoom } from "../types";

export class PaymentModel {
  public tag: any = {
    light: {},
    dark: {
      '--text-primary': '#333',
      '--background-main': '#fff',
      '--colors-secondary-main': '#fafafa',
      '--input-background': '#fff',
      '--input-font_color': '#333',
      '--colors-error-main': '#dd1a00',
      '--colors-success-main': '#329223',
      '--colors-error-light': '#fff2f2',
      '--colors-success-light': '#e2f4ea',
      '--colors-primary-main': '#2577be',
      '--colors-primary-light': '#f2f9ff',
      '--background-modal': '#fff',
      '--background-default': '#f7f7f7',
      '--font-family': 'Montserrat, sans-serif',
      '--colors-secondary-light': '#fafafa',
      '--divider': '#d9d9d9',
      '--text-secondary': '#727272'
    }
  }
  public payments: IPaymentOption[] = [
    {
      id: '1',
      name: 'Credit Card',
      img: 'https://static.travala.com/resources/images/checkout/credit-cards.svg',
    },
    {
      id: '2',
      name: 'Travel Credits',
      img: 'https://static.travala.com/resources/images/checkout/travel_credits.svg',
    },
    {
      id: '3',
      name: 'WeChat Pay',
      img: 'https://static.travala.com/resources/images/checkout/wechat_pay.svg',
    },
    {
      id: '4',
      name: 'My Wallet',
      img: 'https://static.travala.com/resources/images/checkout/wallet.svg',
    },
    {
      id: '5',
      name: 'Web3 Wallet',
      img: 'https://static.travala.com/resources/images/checkout/web3-wallet.svg',
    }
  ]
  public information: IInformation;
  public room: IRoom = {
    id: '',
    hotel: {
      name: '',
      stars: 0,
      address: '',
      point: 0,
      reviewers: 0,
      image: ''
    },
    type: ''
  };
  public booking: IBooking;

  constructor() {}

  getPayment = (id: string) => {
    return this.payments.find(p => p.id === id);
  }

  fetchRoom = (): IRoom => {
    return {
      id: '1',
      hotel: {
        name: 'Canary Dalat Hotel',
        stars: 3,
        address: '82 Tran Quang Khai Street',
        point: 9.2,
        reviewers: 9,
        image: 'https://i.travelapi.com/lodging/42000000/41900000/41899600/41899529/59cd236e_z.jpg'
      },
      type: 'Deluxe Triple Room',
      description: '2 Queen Beds and 1 Large Twin Bed',
      nonSmoking: true,
      includesBreakfast: true,
      amenities: [
        'WiFi',
        'Free WiFi',
        'Free Parking',
        'Breakfast',
        'Dining',
        'Lunch',
        'Snacks',
        'Kitchen',
        'Pool',
        'Spa'
      ],
      quality: {
        cleanliness: {
          score: 9,
          description: 'Clean and tidy'
        },
        location: {
          score: 9,
          description: 'Located in the heart of the city'
        },
        value: {
          score: 9,
          description: 'High value'
        },
        service: {
          score: 9,
          description: 'Good service'
        }
      }
    }
  }

  fetchBooking = (): IBooking => {
    return {
      id: '1',
      checkin: '2024-12-01',
      checkout: '2024-12-04',
      room: '1',
      guest: {
        name: 'John Doe',
        phone: '(123) 456-7890',
        email: 'user@example.com',
        address: '82 Tran Quang Khai Street'
      }
    }
  }

  fetchInfo = () => {
    return {
      "name": 'John Doe',
      "phone": "(123) 456-7890",
      "email": "user@example.com",
      "address": "123 Main St, Anytown, USA",
    }
  }

  getHotelStatus = (point: number) => {
    if (point < 5) {
      return 'Not Good';
    } else if (point >= 5 && point < 8) {
      return 'Normal';
    } else if (point >= 8 && point < 9) {
      return 'Excellent';
    } else {
      return 'Wonderfull';
    }
  }
}