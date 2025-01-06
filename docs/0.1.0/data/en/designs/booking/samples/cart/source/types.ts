interface IShop {
  name: string;
  id: string;
  description?: string;
  address?: string;
  logoUrl?: string;
}

interface IProduct {
  picture: string;
  name: string;
  description: string;
  link: string;
  price: string;
  rating: number;
  brand: string;
  category: string;
  tags: string[];
  type: string;
  discount: string;
  originalPrice: string;
}

interface IOption {
  value: string;
  label: string;
}

interface IShippingInfo {
  fee: string;
  to: string;
  itemsTotal: string;
  discount: string;
  total: string;
  subTotal: string;
}

export {
  IProduct,
  IShop,
  IOption,
  IShippingInfo
}