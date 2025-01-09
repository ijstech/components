interface IProduct {
  id: string;
  name: string;
  image: string;
  price?: string;
  reviews?: number | null;
  seller?: string;
  originalPrice?: string;
  quantity?: string;
  discount?: string;
  publishedAt?: string;
}

export {
  IProduct
}