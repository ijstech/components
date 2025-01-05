import { IOption, IProduct, IProductFilter } from './types';

export class ProductModel {
  private _products: IProduct[] = [];
  private _filteredProducts: IProduct[] = [];
  private _topProducts: IProduct[] = [];
  private _options: IOption[] = [];

  constructor() {
    this._products = this.fetchProducts();
  }

  get products() {
    return this._products || [];
  }

  set products(value: IProduct[]) {
    this._products = value || [];
  }

  get filteredProducts() {
    return this._filteredProducts || [];
  }

  set filteredProducts(value: IProduct[]) {
    this._filteredProducts = value || [];
  }

  get topProducts() {
    return this._topProducts || [];
  }

  set topProducts(value: IProduct[]) {
    this._topProducts = value || [];
  }

  get options() {
    return this._options || [];
  }

  set options(value: IOption[]) {
    this._options = value || [];
  }

  fetchProducts = (): IProduct[] => {
    return [
      {
        "name": "Watch Me",
        "price": "946,950₫",
        "rating": null,
        "reviews": null,
        "seller": "Etsy seller",
        "format": "Digital Download",
        "image": "https://i.etsystatic.com/46493468/c/1904/1904/95/56/il/6b8ec0/5691822639/il_600x600.5691822639_o6i0.jpg",
        "link": "https://example.com/product/watch-me",
        "location": "vn",
        "material": ["solid_yellow_gold"]
      },
      {
        "name": "Cute Cartoon Cat Apple Watch Wallpaper",
        "price": "83,289₫",
        "rating": 4.3,
        "reviews": 6,
        "seller": "Etsy seller",
        "format": "Digital Download",
        "image": "https://i.etsystatic.com/46493468/c/1904/1904/95/56/il/6b8ec0/5691822639/il_600x600.5691822639_o6i0.jpg",
        "link": "https://example.com/product/cute-cartoon-cat-apple-watch-wallpaper",
        "location": "vn",
        "material": ["solid_white_gold"]
      },
      {
        "name": "Anime Apple Watch Wallpaper Landscape",
        "price": "87,798₫",
        "rating": 5.0,
        "reviews": 30,
        "seller": "Etsy seller",
        "format": "Digital Download",
        "image": "https://i.etsystatic.com/46493468/c/1904/1904/95/56/il/6b8ec0/5691822639/il_600x600.5691822639_o6i0.jpg",
        "link": "https://example.com/product/anime-apple-watch-wallpaper-landscape",
        "material": ["solid_white_gold"]
      },
      {
        "name": "6 Christmas Watch Faces, Watch Wallpapers",
        "price": "139,257₫",
        "rating": 5.0,
        "reviews": 514,
        "seller": "Etsy seller",
        "format": "Digital Download",
        "image": "https://i.etsystatic.com/46493468/c/1904/1904/95/56/il/6b8ec0/5691822639/il_600x600.5691822639_o6i0.jpg",
        "link": "https://example.com/product/6-christmas-watch-faces-watch-wallpapers",
        material: ["solid_white_gold"]
      },
      {
        "name": "Watch Box SVG 3mm",
        "price": "68,966₫",
        "originalPrice": "92,042₫",
        "discount": "25% off",
        "rating": 4.8,
        "reviews": 259,
        "seller": "Olgouhadesign",
        "format": "Digital Download",
        "image": "https://i.etsystatic.com/46493468/c/1904/1904/95/56/il/6b8ec0/5691822639/il_600x600.5691822639_o6i0.jpg",
        "link": "https://example.com/product/watch-box-svg-3mm"
      },
      {
        "name": "Snowman Apple Watch Wallpaper",
        "price": "194,695₫",
        "originalPrice": "389,056₫",
        "discount": "50% off",
        "rating": 5.0,
        "reviews": 5,
        "seller": "PixelPeeledDesigns",
        "format": "Digital Download",
        "image": "https://i.etsystatic.com/46493468/c/1904/1904/95/56/il/6b8ec0/5691822639/il_600x600.5691822639_o6i0.jpg",
        "link": "https://example.com/product/snowman-apple-watch-wallpaper"
      },
      {
        "name": "Christmas Santa Apple Watch Wallpaper",
        "price": "40,872₫",
        "originalPrice": "58,388₫",
        "discount": "30% off",
        "rating": 4.9,
        "reviews": 122,
        "seller": "BenCreativeMedia",
        "format": "Digital Download",
        "image": "https://i.etsystatic.com/46493468/c/1904/1904/95/56/il/6b8ec0/5691822639/il_600x600.5691822639_o6i0.jpg",
        "link": "https://example.com/product/christmas-santa-apple-watch-wallpaper"
      },
      {
        "name": "Aesthetic Apple Watch Design Set",
        "price": "53,581₫",
        "originalPrice": "89,125₫",
        "discount": "40% off",
        "rating": 4.8,
        "reviews": 213,
        "seller": "FunkyScreen",
        "format": "Digital Download",
        "image": "https://i.etsystatic.com/46493468/c/1904/1904/95/56/il/6b8ec0/5691822639/il_600x600.5691822639_o6i0.jpg",
        "link": "https://example.com/product/aesthetic-apple-watch-design-set"
      }
    ]
  }

  getTopProducts = (): IProduct[] => {
    return [
      {
        "name": "iPhone screensaver and Watch",
        "price": "79,667₫",
        "originalPrice": "122,667₫",
        "discount": "35% off",
        "rating": 4.5,
        "reviews": 791,
        "seller": "MildredsDigiArt",
        "link": "https://example.com/product/watch-me",
        "image": "https://i.etsystatic.com/9132895/r/il/35d5fc/3868572182/il_340x270.3868572182_baem.jpg"
      },
      {
        "name": "Snowman Apple Watch Wallpaper",
        "price": "194,695₫",
        "originalPrice": "389,056₫",
        "discount": "50% off",
        "rating": 4.8,
        "reviews": 5,
        "seller": "PixelPeeledDesigns",
        "image": "https://i.etsystatic.com/56056967/r/il/12cd57/6483712748/il_340x270.6483712748_i24m.jpg"
      },
      {
        "name": "12 Vintage Wristwatch Patent Prints",
        "price": "386,104₫",
        "originalPrice": "429,155₫",
        "discount": "10% off",
        "rating": 4.7,
        "reviews": 178,
        "seller": "FARBAxCREATIONS",
        "image": "https://i.etsystatic.com/43395420/r/il/c9dd63/5681219690/il_340x270.5681219690_jyk9.jpg"
      },
      {
        "name": "Green Eucalyptus Wallpaper for Apple Watch",
        "price": "63,667₫",
        "originalPrice": "98,000₫",
        "discount": "35% off",
        "rating": 4.5,
        "reviews": 791,
        "seller": "MildredsDigiArt",
        "image": "https://i.etsystatic.com/9132895/r/il/885a9a/3857003198/il_340x270.3857003198_g8g7.jpg"
      },
      {
        "name": "Watch Box SVG 3mm",
        "price": "68,966₫",
        "originalPrice": "92,042₫",
        "discount": "25% off",
        "rating": 4.6,
        "reviews": 259,
        "seller": "Olgouhadesign",
        "image": "https://i.etsystatic.com/37001696/r/il/37ee7a/5648954443/il_340x270.5648954443_qnuv.jpg"
      },
      {
        "name": "Dried Flowers Minimal Apple Watch",
        "price": "63,667₫",
        "originalPrice": "98,000₫",
        "discount": "35% off",
        "rating": 4.5,
        "reviews": 791,
        "seller": "MildredsDigiArt",
        "image": "https://i.etsystatic.com/9132895/r/il/9241f4/4498808818/il_340x270.4498808818_mrhk.jpg"
      }
    ]
  }

  getOptions = (): IOption[] => {
    return [
      { label: "Vintage", value: "vintage" },
      { label: "Star Seller", value: "star_seller", group: 'estyBest' },
      { label: "Etsy's Picks", value: "etsys_picks", group: 'estyBest' },
      { label: "On sale", value: "on_sale", group: 'offer' },
      { label: "Accepts Etsy gift cards", value: "accepts_gift_cards" },
      { label: "Can be gift-wrapped", value: "gift_wrapped" }
    ];
  }

  handlFilter = (filter: IProductFilter): IProduct[] => {
    const products = this._products;
    let filteredProducts = JSON.parse(JSON.stringify(products));

    if (!filter) return filteredProducts;
    // if (filter.itemType) {
    //   filteredProducts = products.filter(product => product.itemType === filter.itemType);
    // }

    if (filter.location !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.location === filter.location);
    }

    // if (filter.itemFormat) {
    //   filteredProducts = filteredProducts.filter(product => product.itemFormat === filter.itemFormat);
    // }

    // if (filter.estyBest) {
    //   filteredProducts = filteredProducts.filter(product => product.estyBest.includes(filter.estyBest));
    // }

    // if (filter.offer) {
    //   filteredProducts = filteredProducts.filter(product => product.offer.includes(filter.offer));
    // }

    if (filter.material?.length) {
      filteredProducts = filteredProducts.filter(product => product.material?.some(material => filter.material?.includes(material)));
    }

    const getPrice = (price: string) => {
      return Number(price.replace(/[^\d.-]/g, ''));
    }

    if (filter.price === 'custom' && filter.min !== undefined) {
      filteredProducts = filteredProducts.filter(product => getPrice(product.price) >= Number(filter.min));
    }

    if (filter.price === 'custom' && filter.max !== undefined) {
      filteredProducts = filteredProducts.filter(product => getPrice(product.price) <= Number(filter.max));
    }

    if (filter.location === 'custom' && filter.customLocation) {
      filteredProducts = filteredProducts.filter(product => product.location === filter.customLocation);
    }

    return filteredProducts;
  }
}