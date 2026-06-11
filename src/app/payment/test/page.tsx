import CheckoutForm from "@/src/components/Payment/CheckoutForm";

export const metadata = { title: "Payment Test" };

export default function PaymentTestPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16">
      <div className="bg-white max-w-2xl w-full mx-auto px-8 py-12 shadow-2xl">
        <span className="text-[8px] tracking-[0.5em] uppercase text-gray-400 mb-3 block">
          Payment test
        </span>
        <h1 className="text-2xl md:text-3xl font-serif italic text-black mb-3">
          Multi-gateway checkout
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          Backend dispatches by <code>projectType</code>: SHOPPING → Razorpay
          modal, FCH → Paytm hosted page. The frontend reads the{" "}
          <code>gateway</code> field in the response and routes accordingly.
        </p>
        <CheckoutForm />
      </div>
    </main>
  );
}
