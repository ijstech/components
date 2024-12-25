export interface IOption {
  label: string;
  value: any;
}

export class FilterModel {
  private _data: { [key: string]: any } = {
    itemType: '',
    location: 'all',
    itemFormat: '',
    estyBest: [],
    offer: [],
    material: [],
    price: 'all',
    min: undefined,
    max: undefined,
    customLocation: ''
  };

  constructor() { }

  reset() {
    this._data = {
      itemType: '',
      location: 'all',
      itemFormat: '',
      estyBest: [],
      offer: [],
      material: [],
      price: 'all',
      min: undefined,
      max: undefined,
      customLocation: ''
    }
  }

  get data() {
    return this._data;
  }

  set data(value: { [key: string]: any }) {
    this._data = value;
  }

  setValue(prop: string, value: any) {
    if (prop in this._data)
      this._data[prop] = value;
  }

  getFilters() {
    return [
      {
        title: 'Item format',
        key: 'itemFormat',
        options: this.itemFormats,
        isRadio: true
      },
      {
        title: 'Special offers',
        key: 'offer',
        options: this.offers,
        isRadio: false
      },
      {
        title: "Etsy's best",
        key: 'estyBest',
        options: this.estyBest,
        isRadio: false
      },
      {
        title: 'Materials',
        options: this.materials,
        key: 'material',
        isRadio: false
      }
    ]
  }

  get categories() {
    return [
      { label: "Home & Living", value: "1" },
      { label: "Art & Collectibles", value: "2" },
      { label: "Craft Supplies & Tools", value: "3" },
      { label: "Paper & Party Supplies", value: "4" },
      { label: "Books, Movies & Music", value: "5" },
      { label: "Jewelry", value: "6" },
      { label: "Pet Supplies", value: "7" },
      { label: "Toys & Games", value: "8" },
      { label: "Electronics & Accessories", value: "9" },
      { label: "Weddings", value: "10" },
      { label: "Clothing", value: "11" },
      { label: "Accessories", value: "12" },
      { label: "Bath & Beauty", value: "13" },
      { label: "Bags & Purses", value: "14" },
      { label: "Shoes", value: "15" }
    ];
  }

  get locations() {
    return [
      {
        label: 'Anywhere',
        value: 'all'
      },
      {
        label: "Vietnam",
        value: "vn"
      },
      {
        label: 'Custom',
        value: 'custom'
      }
    ]
  }

  get prices() {
    return [
      {
        label: 'Any price',
        value: 'all'
      },
      {
        label: 'Custom',
        value: 'custom'
      }
    ]
  }

  get itemFormats() {
    return [
      { label: 'All', value: 'all' },
      { label: 'Physical items', value: 'physical' },
      { label: 'Digital downloads', value: 'digital' }
    ]
  }

  get offers() {
    return [
      {
        label: 'Free shipping',
        value: 'free-shiping'
      },
      {
        label: 'On-sale',
        value: 'on-sale'
      }
    ]
  }

  get estyBest() {
    return [
      {
        value: 'pick',
        label: "Etsy's Picks"
      },
      {
        value: 'seller',
        label: 'Star Seller'
      }
    ]
  }

  get materials() {
    return [
      {
        "label": "Solid yellow gold",
        "value": "solid_yellow_gold"
      },
      {
        "label": "Solid white gold",
        "value": "solid_white_gold"
      },
      {
        "label": "Solid rose gold",
        "value": "solid_rose_gold"
      },
      {
        "label": "Sterling silver",
        "value": "sterling_silver"
      },
      {
        "label": "Platinum",
        "value": "platinum"
      },
      {
        "label": "Brass",
        "value": "brass"
      },
      {
        "label": "Gold filled",
        "value": "gold_filled"
      },
      {
        "label": "Gold plated",
        "value": "gold_plated"
      },
      {
        "label": "Gold vermeil",
        "value": "gold_vermeil"
      }
    ]
  }
}