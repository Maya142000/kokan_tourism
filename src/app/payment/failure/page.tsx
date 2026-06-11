import Link from "next/link";

export const metadata = { title: "Payment Failed" };

type SearchParams = Promise<{ orderId?: string | string[] }>;

export default async function PaymentFailurePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const raw = params.orderId;
  const orderId = Array.isArray(raw) ? raw[0] : raw;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="bg-white max-w-md w-full px-8 py-12 shadow-2xl text-center">
        <h1 className="text-2xl md:text-3xl font-serif italic text-black mb-4">
          Payment failed
        </h1>
        <p className="text-gray-600 mb-2">
          We couldn&apos;t complete your payment. If you were charged, the
          amount will be refunded within 5-7 business days.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-8">
            Order ID:{" "}
            <span className="font-mono text-black">{orderId}</span>
          </p>
        )}
        <div className="flex gap-3 justify-center mt-6">
          <Link
            href="/payment/test"
            className="inline-block border border-black text-black px-6 py-3 text-sm tracking-widest uppercase"
          >
            Try again
          </Link>
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
