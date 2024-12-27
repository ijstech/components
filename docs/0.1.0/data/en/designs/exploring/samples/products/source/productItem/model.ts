import { IProduct } from "../types";

export class ProductModel {
  private _product: IProduct;

  constructor() { }

  get product() {
    return this._product;
  }

  set product(value: IProduct) {
    this._product = value;
  }
}
