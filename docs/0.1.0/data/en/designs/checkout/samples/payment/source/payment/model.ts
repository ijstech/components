import { IInvoice } from "../types";

export class DataModel {
  private _data: IInvoice = {
    id: "",
    status: "",
    createdAt: "",
    payment: undefined,
    invoiceId: "",
    orderId: "",
    customerEmail: "",
    shippingAddress: "",
    billingAddress: "",
    shippingMethod: "",
    items: [],
    discount: 0
  };

  get data(): IInvoice {
    return this._data;
  }

  set data(value: IInvoice) {
    this._data = value;
  }

  constructor() {}

  getData(): IInvoice {
    return {
      id: "1",
      status: "",
      createdAt: "",
      payment: {
        id: "1",
        name: "Bitcoin",
        description: "Bitcoin",
        icon: "https://cdn.bitrefill.com/primg/i1w48h48/viettel-mobile-vietnam.webp",
        price: '0.00000887',
        currency: "BTC",
        address: "bc1qxk3vu9hmu4y2w97qs9gy29yj6azvve9ae9wpsr"
      },
      invoiceId: "4742c94e-b1b4-4750-949b-2d862467e461",
      orderId: "",
      customerEmail: "abc@gmail.com",
      shippingAddress: "",
      billingAddress: "",
      shippingMethod: "",
      items: [
        {
          id: "1",
          name: "Viettel Mobile Vietnam",
          price: '20000',
          description: "20000.00 VND value",
          image: "https://cdn.bitrefill.com/primg/i1w48h48/viettel-mobile-vietnam.webp"
        }
      ],
      discount: 0
    }
  }
}