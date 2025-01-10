interface IProduct {
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

interface IProductFilter {
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

interface IProductList {
  products: IProduct[];
}

interface IOption {
  label: string;
  value: any;
  selected?: boolean;
  group?: string;
}

interface IFilter {
  title: string;
  key: string;
  options: IOption[];
  isRadio?: boolean;
}

type ProductType = 'top' | 'all';

export {
  IProduct,
  IProductFilter,
  IProductList,
  IOption,
  ProductType,
  IFilter
}
