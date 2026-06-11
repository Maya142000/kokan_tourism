"use client";

import { useMemo, useState } from "react";
import { useRazorpayScript } from "@/src/hooks/useRazorpayScript";
import { startPayment } from "@/src/services/paymentservice";
import type {
  CreatePaymentRequest,
  DeliveryAddress,
  PaymentItem,
  ProjectType,
} from "@/src/types/razorpay";

type Props = {
  defaults?: Partial<CreatePaymentRequest>;
};

const PROJECT_TYPES: { value: ProjectType; label: string; gatewayHint: string }[] = [
  { value: "SHOPPING", label: "SHOPPING", gatewayHint: "→ Razorpay" },
  { value: "FCH", label: "FCH", gatewayHint: "→ Paytm" },
];

const DEFAULT_REQUEST: CreatePaymentRequest = {
  projectType: "SHOPPING",
  userId: "69aad625e9bd023550a50919",
  mobileNo: "9876543210",
  amount: 500,
  TotalCartPrice: 500,
  DiscountCartPrice: 50,
  ShippingCharges: 40,
  FinalCartPrice: 490,
  paymentMode: "ONLINE",
  category: "MEDICINE",
  items: [
    {
      productId: "64f123abc123abc123abc123",
      productName: "Paracetamol 500mg",
      quantity: 2,
      unitPrice: 50,
      totalPrice: 100,
    },
  ],
  deliveryAddress: {
    fullName: "Mahesh Mohite",
    mobileNo: "9876543210",
    addressLine1: "House No 123, MG Road",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
  },
  couponCode: "NEW50",
};

const inputCls =
  "w-full bg-white border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:border-black";
const labelCls =
  "text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-1 block";

export default function CheckoutForm({ defaults }: Props) {
  // Razorpay script only matters when the gateway is RAZORPAY. We start
  // loading it eagerly because it's small and we don't know the gateway
  // until after createPayment returns.
  const { status: razorpayStatus } = useRazorpayScript();

  const initial: CreatePaymentRequest = useMemo(
    () => ({ ...DEFAULT_REQUEST, ...defaults }),
    [defaults]
  );

  const [projectType, setProjectType] = useState<ProjectType>(
    initial.projectType
  );
  const [userId, setUserId] = useState(initial.userId);
  const [mobileNo, setMobileNo] = useState(initial.mobileNo);
  const [paymentMode, setPaymentMode] = useState(initial.paymentMode);
  const [category, setCategory] = useState(initial.category);
  const [couponCode, setCouponCode] = useState(initial.couponCode ?? "");

  const [totalCartPrice, setTotalCartPrice] = useState(
    String(initial.TotalCartPrice)
  );
  const [discountCartPrice, setDiscountCartPrice] = useState(
    String(initial.DiscountCartPrice)
  );
  const [shippingCharges, setShippingCharges] = useState(
    String(initial.ShippingCharges)
  );

  const [items, setItems] = useState<PaymentItem[]>(initial.items);
  const [address, setAddress] = useState<DeliveryAddress>(
    initial.deliveryAddress
  );

  const [prefillName, setPrefillName] = useState(
    initial.deliveryAddress.fullName
  );
  const [prefillEmail, setPrefillEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalCartPrice = useMemo(() => {
    const t = Number(totalCartPrice) || 0;
    const d = Number(discountCartPrice) || 0;
    const s = Number(shippingCharges) || 0;
    return Math.max(0, t - d + s);
  }, [totalCartPrice, discountCartPrice, shippingCharges]);

  const expectedGateway = projectType === "FCH" ? "Paytm" : "Razorpay";
  const gatewayDependencyReady =
    projectType === "FCH" ? true : razorpayStatus === "ready";

  const disabled = !gatewayDependencyReady || submitting;

  const updateItem = <K extends keyof PaymentItem>(
    idx: number,
    key: K,
    value: PaymentItem[K]
  ) => {
    setItems((prev) => {
      const next = [...prev];
      const updated = { ...next[idx], [key]: value };
      if (key === "quantity" || key === "unitPrice") {
        updated.totalPrice =
          Number(updated.quantity) * Number(updated.unitPrice) || 0;
      }
      next[idx] = updated;
      return next;
    });
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateAddress = <K extends keyof DeliveryAddress>(
    key: K,
    value: DeliveryAddress[K]
  ) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const runCheckout = async () => {
    setError(null);

    if (!userId.trim()) return setError("User ID is required");
    if (!mobileNo.trim()) return setError("Mobile number is required");
    if (items.length === 0) return setError("Add at least one item");
    if (finalCartPrice <= 0) return setError("Final cart price must be > 0");

    const request: CreatePaymentRequest = {
      projectType,
      userId: userId.trim(),
      mobileNo: mobileNo.trim(),
      amount: Number(totalCartPrice) || 0,
      TotalCartPrice: Number(totalCartPrice) || 0,
      DiscountCartPrice: Number(discountCartPrice) || 0,
      ShippingCharges: Number(shippingCharges) || 0,
      FinalCartPrice: finalCartPrice,
      paymentMode,
      category,
      items,
      deliveryAddress: address,
      couponCode: couponCode.trim() || undefined,
    };

    setSubmitting(true);
    try {
      await startPayment({
        request,
        prefill: {
          name: prefillName || address.fullName,
          email: prefillEmail || undefined,
          contact: mobileNo,
        },
        description: `${projectType} · ${category}`,
        onDismiss: () => setSubmitting(false),
        onFailure: (resp) => {
          setError(resp.error?.description ?? "Payment failed");
          setSubmitting(false);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void runCheckout();
      }}
      className="flex flex-col gap-6"
    >
      {/* Project type — drives gateway selection on the backend */}
      <section>
        <label className={labelCls}>Project Type (gateway dispatch)</label>
        <div className="grid grid-cols-2 gap-3">
          {PROJECT_TYPES.map((p) => {
            const selected = projectType === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setProjectType(p.value)}
                className={`border px-4 py-3 text-left ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-black"
                }`}
              >
                <div className="text-sm font-semibold tracking-widest">
                  {p.label}
                </div>
                <div
                  className={`text-[10px] tracking-[0.2em] uppercase ${
                    selected ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {p.gatewayHint}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* User + project meta */}
      <section className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Payment Mode</label>
          <input
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>User ID</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className={inputCls}
          />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Mobile</label>
          <input
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            required
            className={inputCls}
          />
        </div>
      </section>

      {/* Items */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm tracking-[0.3em] uppercase text-gray-700">
            Items
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="text-xs underline text-gray-700"
          >
            + Add item
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <div key={idx} className="border border-gray-200 p-3">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  placeholder="Product ID"
                  value={item.productId}
                  onChange={(e) => updateItem(idx, "productId", e.target.value)}
                  className={inputCls}
                />
                <input
                  placeholder="Product Name"
                  value={item.productName}
                  onChange={(e) =>
                    updateItem(idx, "productName", e.target.value)
                  }
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-4 gap-2 items-end">
                <div>
                  <label className={labelCls}>Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(idx, "quantity", Number(e.target.value))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Unit ₹</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(idx, "unitPrice", Number(e.target.value))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Total ₹</label>
                  <input
                    type="number"
                    readOnly
                    value={item.totalPrice}
                    className={`${inputCls} bg-gray-50`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-xs text-red-500 underline justify-self-end"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Totals */}
      <section>
        <h3 className="text-sm tracking-[0.3em] uppercase text-gray-700 mb-3">
          Cart Totals
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Total Cart Price ₹</label>
            <input
              type="number"
              min={0}
              value={totalCartPrice}
              onChange={(e) => setTotalCartPrice(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Discount ₹</label>
            <input
              type="number"
              min={0}
              value={discountCartPrice}
              onChange={(e) => setDiscountCartPrice(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Shipping ₹</label>
            <input
              type="number"
              min={0}
              value={shippingCharges}
              onChange={(e) => setShippingCharges(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Coupon Code</label>
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="col-span-2 border-t border-gray-200 pt-3 flex justify-between text-sm">
            <span className="tracking-[0.3em] uppercase text-gray-500">
              Final Payable
            </span>
            <span className="font-mono text-black">₹ {finalCartPrice}</span>
          </div>
        </div>
      </section>

      {/* Delivery address */}
      <section>
        <h3 className="text-sm tracking-[0.3em] uppercase text-gray-700 mb-3">
          Delivery Address
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls}>Full name</label>
            <input
              value={address.fullName}
              onChange={(e) => updateAddress("fullName", e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Mobile</label>
            <input
              value={address.mobileNo}
              onChange={(e) => updateAddress("mobileNo", e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Pincode</label>
            <input
              value={address.pincode}
              onChange={(e) => updateAddress("pincode", e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Address line 1</label>
            <input
              value={address.addressLine1}
              onChange={(e) => updateAddress("addressLine1", e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>City</label>
            <input
              value={address.city}
              onChange={(e) => updateAddress("city", e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input
              value={address.state}
              onChange={(e) => updateAddress("state", e.target.value)}
              required
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* Razorpay-only prefill */}
      {projectType !== "FCH" && (
        <section>
          <h3 className="text-sm tracking-[0.3em] uppercase text-gray-700 mb-3">
            Razorpay prefill (optional)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Name</label>
              <input
                value={prefillName}
                onChange={(e) => setPrefillName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={prefillEmail}
                onChange={(e) => setPrefillEmail(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </section>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="bg-black text-white px-6 py-3 text-sm tracking-widest uppercase disabled:opacity-50"
      >
        {projectType !== "FCH" && razorpayStatus === "loading"
          ? "Loading checkout…"
          : projectType !== "FCH" && razorpayStatus === "error"
          ? "Razorpay unavailable"
          : submitting
          ? "Creating order…"
          : `Pay ₹ ${finalCartPrice} via ${expectedGateway}`}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
