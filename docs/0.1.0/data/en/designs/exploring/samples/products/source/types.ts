export interface IProduct {
  name: string;
  image: string;
  price: string;
  reviews: number | null;
  seller: string;
  originalPrice?: string;
  discount?: string;
  rating: number | null;
  format?: string;
  link?: string;
  isAvailable?: boolean;
  location?: string;
  material?: string[];
  freeShipping?: boolean;
}

export interface IProductFilter {
  itemType?: string;
  location?: string;
  itemFormat?: string;
  estyBest?: IOption[];
  offer?: IOption[];
  material?: IOption[];
  price?: string;
  min?: number;
  max?: number;
  customLocation?: string;
}

export interface IProductList {
  products: IProduct[];
}

export interface IOption {
  label: string;
  value: any;
  selected?: boolean;
  group?: string;
}

export type ProductType = 'top' | 'all';
