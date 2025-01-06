import { FormatUtils } from "@ijstech/components";
import { IProduct, IShop, IOption, IShippingInfo } from "../types";

export function formatNumber(value: number) {
  return FormatUtils.formatNumber(value, { decimalFigures: 2 }) + 'đ'
}

export function shippingOptions() {
  return [
    { "value": "1", "label": "Standard Shipping" },
    { "value": "2", "label": "Express" }
  ]
}

export function getPayments() {
  return [
    {
      value: '1',
      images: [
        'https://www.svgrepo.com/show/508730/visa-classic.svg',
        'https://www.svgrepo.com/show/508703/mastercard.svg'
      ]
    },
    {
      value: '2',
      images: [
        'https://www.svgrepo.com/show/452222/google-pay.svg'
      ]
    }
  ]
}

export class DataModel {
  public shop: IShop = {
    name: '',
    id: ''
  };
  public product: IProduct = {
    name: '',
    picture: "",
    description: "",
    link: "",
    price: "",
    rating: 0,
    brand: "",
    category: "",
    tags: [],
    type: "",
    discount: "",
    originalPrice: ""
  }
  public shippingInfo: IShippingInfo = {
    fee: "",
    to: "",
    itemsTotal: "",
    subTotal: "",
    discount: "",
    total: ""
  };

  constructor() {
    this.shop = this.fetchShop();
    this.product = this.fetchProduct();
    this.shippingInfo = {
      fee: '1,000đ',
      to: 'Vietnam',
      itemsTotal: '10,000đ',
      subTotal: '8,000đ',
      discount: '2,000đ',
      total: '9,000đ'
    }
  }

  fetchShop(shopId?: string): IShop {
    return {
      "id": '123',
      "name": "RozaliaCrafts",
      "description": "Tea Favors, Bath Salts, Mint to be favor, Almond Favors",
      "address": "Bursa Province, Türkiye",
      "logoUrl": "https://i.etsystatic.com/isla/4d3aef/41092406/isla_75x75.41092406_53vn2j44.jpg?version=0"
    }
  }

  fetchProduct(): IProduct {
    return {
      picture: 'https://i.etsystatic.com/23712985/r/il/c7a5f7/2419940834/il_794xN.2419940834_isyp.jpg',
      name: '10 Loose Leaf Tea Sampler Gift Set, Birthday Day Gift Box, Gift for Her, Mom, Sister, Herbal Tea, Tea Lover Gift, Coworker, Christmas, Xmas',
      description: 'Tea Favors, Bath Salts, Mint to be favor, Almond Favors',
      link: "https://www.etsy.com/listing/827166796/10-loose-leaf-tea-sampler-gift-set",
      price: '8,000đ',
      rating: 4.5,
      brand: 'RozaliaCrafts',
      category: 'Favors',
      tags: ['tea', 'favors', 'bath salts', 'mint', 'almond'],
      type: 'Box Options: With Kraft Box',
      discount: '20% off',
      originalPrice: '10,000đ'
    }
  }
}
