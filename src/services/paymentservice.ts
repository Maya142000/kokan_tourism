"use client";

import axios from "axios";
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaytmCreateResponse,
  RazorpayCreateResponse,
  RazorpayFailedResponse,
  RazorpayPrefill,
  RazorpaySuccessResponse,
} from "@/src/types/razorpay";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:7777";

export type StartPaymentArgs = {
  request: CreatePaymentRequest;
  prefill?: RazorpayPrefill;
  companyName?: string;
  description?: string;
  themeColor?: string;
  successRedirect?: (orderId: string) => string;
  failureRedirect?: (orderId: string) => string;
  onDismiss?: () => void;
  onFailure?: (resp: RazorpayFailedResponse) => void;
};

export async function createPayment(
  body: CreatePaymentRequest
): Promise<CreatePaymentResponse> {
  const { data } = await axios.post<CreatePaymentResponse>(
    `${API_BASE_URL}/api/v1/payment/create`,
    body,
    { headers: { "Content-Type": "application/json", accept: "*/*" } }
  );
  if (!data.success) {
    throw new Error("Backend returned success=false");
  }
  return data;
}

/**
 * Calls the backend to create an order, then dispatches to the correct
 * gateway based on `gateway` in the response:
 *
 *   RAZORPAY → opens the Razorpay checkout.js modal
 *   PAYTM    → form-POSTs to Paytm's hosted page (full-page redirect)
 *
 * For Razorpay the browser stays on the page and gets a `handler` callback.
 * For Paytm the browser leaves; the backend webhook + callback take over.
 */
export async function startPayment(args: StartPaymentArgs): Promise<void> {
  const created = await createPayment(args.request);

  switch (created.gateway) {
    case "RAZORPAY":
      return openRazorpay(created, args);
    case "PAYTM":
      return openPaytm(created);
    default: {
      const unknown = (created as { gateway: string }).gateway;
      throw new Error(`Unsupported gateway returned by backend: ${unknown}`);
    }
  }
}

function openRazorpay(
  created: RazorpayCreateResponse,
  args: StartPaymentArgs
): void {
  if (typeof window === "undefined" || !window.Razorpay) {
    throw new Error(
      "Razorpay script not loaded. Call useRazorpayScript() before startPayment()."
    );
  }

  const successUrl = (orderId: string) =>
    args.successRedirect
      ? args.successRedirect(orderId)
      : `/payment/success?orderId=${encodeURIComponent(orderId)}`;

  const failureUrl = (orderId: string) =>
    args.failureRedirect
      ? args.failureRedirect(orderId)
      : `/payment/failure?orderId=${encodeURIComponent(orderId)}`;

  const rzp = new window.Razorpay({
    key: created.keyId,
    amount: created.amount,
    currency: created.currency,
    order_id: created.gatewayOrderId,
    name: args.companyName ?? "Onelife Capital",
    description: args.description ?? `Order ${created.orderId}`,
    prefill: args.prefill,
    theme: { color: args.themeColor ?? "#0d6efd" },
    // Backend webhook (POST /api/v1/payment/webhook/razorpay) confirms
    // the payment server-to-server. Browser just redirects for UX.
    handler: (_response: RazorpaySuccessResponse) => {
      window.location.href = successUrl(created.orderId);
    },
    modal: {
      ondismiss: () => {
        args.onDismiss?.();
      },
    },
  });

  rzp.on(
    "payment.failed",
    (resp: { error: RazorpayFailedResponse["error"] }) => {
      args.onFailure?.(resp);
      window.location.href = failureUrl(created.orderId);
    }
  );

  rzp.open();
}

/**
 * Paytm uses a form-POST handoff to its hosted checkout. After the user
 * completes payment on Paytm, Paytm POSTs back to the `callbackUrl` set
 * by the backend (`POST /api/v1/payment/callback`); the backend then
 * redirects to its configured `successRedirectUrl?orderId=X&status=Y`.
 */
function openPaytm(created: PaytmCreateResponse): void {
  if (typeof document === "undefined") {
    throw new Error("openPaytm called outside the browser");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = created.redirectUrl;
  form.style.display = "none";

  const fields: Record<string, string> = {
    mid: created.mid,
    orderId: created.gatewayOrderId,
    txnToken: created.txnToken,
  };

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}

export type { RazorpaySuccessResponse, RazorpayFailedResponse };
