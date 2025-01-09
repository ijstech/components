import { IProduct } from "./types";

export class DataModel {
  public data: IProduct = {
    id: "",
    image: '',
    name: ""
  };

  constructor() {
    this.data = this.getPayment();
  }

  getPayment = () => {
    return {
      id: '1',
      image: 'https://d4ov6iqsvotvt.cloudfront.net/uploads/show/poster_image/5654/medium_1620213561-gore-vidal-s-the-best-man.jpg',
      name: 'Gore Vidal - The Best Man',
      publishedAt: 'Wednesday, October 14, 2021',
      price: '$19.99',
      reviews: null,
      seller: 'Amazon',
      quantity: '1'
    }
  }
}