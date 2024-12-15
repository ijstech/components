import { observable } from "@ijstech/components";
export class DataModel {
  @observable()
  private _shop: any = {
    name: '',
    id: ''
  };
  private _product: any = {
    name: '',
    id: ''
  }
  private _shipping: any = {}

  constructor() {}

  get shop() {
    return this._shop;
  }

  set shop(value) {
    this._shop = value;
  }

  get product() {
    return this._product;
  }

  set product(value) {
    this._product = value;
  }

  get shipping() {
    return this._shipping;
  }
  set shipping(value: any) {
    this._shipping = value;
  }

  fetchShop(shopId: string) {
    this.shop = {
      "id": '123',
      "name": "RozaliaCrafts",
      "description": "Tea Favors, Bath Salts, Mint to be favor, Almond Favors",
      "address": "Bursa Province, Türkiye",
      "logoUrl": "https://i.etsystatic.com/isla/4d3aef/41092406/isla_75x75.41092406_53vn2j44.jpg?version=0"
    }
  }

  fetchProduct() {
    this._product = {
      picture: 'https://i.etsystatic.com/23712985/r/il/c7a5f7/2419940834/il_794xN.2419940834_isyp.jpg',
      name: '10 Loose Leaf Tea Sampler Gift Set, Birthday Day Gift Box, Gift for Her, Mom, Sister, Herbal Tea, Tea Lover Gift, Coworker, Christmas, Xmas',
      description: 'Tea Favors, Bath Salts, Mint to be favor, Almond Favors',
      link: "https://www.etsy.com/listing/827166796/10-loose-leaf-tea-sampler-gift-set",
      price: 10,
      rating: 4.5,
      brand: 'RozaliaCrafts',
      category: 'Favors',
      tags: ['tea', 'favors', 'bath salts', 'mint', 'almond'],
      discount: 20,
    }
  }

  getShippingInfo() {
    this.shipping = {
      fee: 1
    }
  }
}
