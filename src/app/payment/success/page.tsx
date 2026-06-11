import Link from "next/link";

export const metadata = { title: "Payment Status" };

type SearchParams = Promise<{
  orderId?: string | string[];
  status?: string | string[];
}>;

const pickFirst = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const orderId = pickFirst(params.orderId);
  const status = pickFirst(params.status)?.toUpperCase();

  // Paytm backend redirects with status=FAILED when payment fails on its
  // hosted page. Razorpay flow has no status param (always lands here on
  // its handler firing) — treat absent status as success.
  const isFailure = status === "FAILED" || status === "FAILURE";

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="bg-white max-w-md w-full px-8 py-12 shadow-2xl text-center">
        <h1 className="text-2xl md:text-3xl font-serif italic text-black mb-4">
          {isFailure ? "Payment failed" : "Payment received"}
        </h1>
        <p className="text-gray-600 mb-2">
          {isFailure
            ? "Your payment didn't go through. If you were charged, the amount will be refunded within 5-7 business days."
            : "Your payment has been accepted. Final confirmation is being processed by the server (usually within a few seconds). You will receive an email and SMS once it's complete."}
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-8">
            Order ID:{" "}
            <span className="font-mono text-black">{orderId}</span>
          </p>
        )}
        {status && (
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-6">
            Status: {status}
          </p>
        )}
        <div className="flex gap-3 justify-center mt-4">
          {isFailure && (
            <Link
              href="/payment/test"
              className="inline-block border border-black text-black px-6 py-3 text-sm tracking-widest uppercase"
            >
              Try again
            </Link>
          )}
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 text-sm tracking-widest uppercase"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
