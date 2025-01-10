interface IPayment {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: string;
  currency: string;
  address: string;
}

interface IInvoice {
  id: string;
  status: string;
  createdAt: string;
  payment?: IPayment;
  invoiceId: string;
  orderId: string;
  customerEmail: string;
  shippingAddress: string;
  billingAddress: string;
  shippingMethod: string;
  items: IInvoiceItem[];
  discount: number;
}

interface IInvoiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export {
  IPayment,
  IInvoice,
  IInvoiceItem
}