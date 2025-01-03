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
}

export interface IProductFilter {
  itemType?: string;
  location?: string;
  itemFormat?: string;
  estyBest?: string[];
  offer?: string[];
  material?: string[];
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
}

export type ProductType = 'top' | 'all';
