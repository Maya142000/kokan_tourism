// Razorpay client-side types ─────────────────────────────────────────────

export type RazorpayPrefill = {
  name?: string;
  email?: string;
  contact?: string;
};

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: string;
};

export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RazorpayFailedResponse = {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: { order_id?: string; payment_id?: string };
  };
};

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  image?: string;
  prefill?: RazorpayPrefill;
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  modal?: { ondismiss?: () => void };
};

export interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", cb: (resp: RazorpayFailedResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// Backend contract: POST /api/v1/payment/create ───────────────────────────

export type ProjectType = "SHOPPING" | "FCH" | (string & {});

export type PaymentItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type DeliveryAddress = {
  fullName: string;
  mobileNo: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type CreatePaymentRequest = {
  projectType: ProjectType;
  userId: string;
  mobileNo: string;
  amount: number;
  TotalCartPrice: number;
  DiscountCartPrice: number;
  ShippingCharges: number;
  FinalCartPrice: number;
  paymentMode: "ONLINE" | string;
  category: string;
  items: PaymentItem[];
  deliveryAddress: DeliveryAddress;
  couponCode?: string;
};

type BaseCreateResponse = {
  success: true;
  orderId: string; // internal e.g. ORD-...
  originalAmount: number;
  walletUsed: number;
  couponDiscount: number;
  amount: number;
  callbackUrl: string;
  raw?: unknown;
};

export type RazorpayCreateResponse = BaseCreateResponse & {
  gateway: "RAZORPAY";
  gatewayOrderId: string; // razorpay order id, e.g. order_xxx
  keyId: string;
  currency: string;
};

export type PaytmCreateResponse = BaseCreateResponse & {
  gateway: "PAYTM";
  gatewayOrderId: string; // internal order id, used as Paytm orderId
  txnToken: string;
  redirectUrl: string; // e.g. https://securestage.paytmpayments.com/theia/processTransaction
  mid: string;
  checksum: string;
};

export type CreatePaymentResponse = RazorpayCreateResponse | PaytmCreateResponse;

export {};
