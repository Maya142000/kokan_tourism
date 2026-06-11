This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Razorpay payment flow

The checkout lives at `/payment/test` and is backed by the API at `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:7777`).

### Architecture

| Step | Caller | Endpoint | Purpose |
| --- | --- | --- | --- |
| 1 | Browser | `POST /api/v1/payment/create` | Backend creates an internal order + Razorpay order, stamps `internalOrderId` into `notes` |
| 2 | Browser | Razorpay checkout.js modal | User pays |
| 3 | Browser | `window.location` redirect to `/payment/success?orderId=...` | UX feedback only — no DB write here |
| 4 | **Razorpay servers** | `POST /api/v1/payment/webhook/razorpay` | Signature-verified, updates `payment.status` to `SUCCESS` / `FAILED`, triggers post-payment side-effects |

The browser **does not** call the webhook — Razorpay does, server-to-server. The webhook secret never reaches the browser.

### Setup

1. Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_API_BASE_URL`.
2. Start the backend on `:7777`.
3. `npm run dev`.
4. Open <http://localhost:3000/payment/test>.

### Configuring the webhook in production

1. Razorpay Dashboard → **Settings → Webhooks → Add new webhook**.
2. URL: `https://<your-backend>/api/v1/payment/webhook/razorpay`.
3. Events: `payment.captured`, `payment.failed`.
4. Set the **Webhook Secret** to the same value the backend's `projectConfig` returns for `verifyRazorpayWebhook`.

### Testing the webhook locally with ngrok

Razorpay's servers can't reach `http://localhost:7777`, so the webhook never fires in pure-local development. Expose the backend with ngrok.

**One-time setup**

1. Install ngrok — <https://ngrok.com/download> (or `winget install ngrok.ngrok` on Windows).
2. Authenticate once: `ngrok config add-authtoken <your-token>`.

**Each session**

```powershell
npm run tunnel
```

That runs [scripts/ngrok-tunnel.mjs](scripts/ngrok-tunnel.mjs), which spawns `ngrok http 7777`, waits for the tunnel to come up, and prints:

```
==================== NGROK TUNNEL ====================
Public URL:           https://abc123.ngrok-free.app
Razorpay webhook:     https://abc123.ngrok-free.app/api/v1/payment/webhook/razorpay
=====================================================
```

Copy the `Razorpay webhook:` URL into Razorpay Dashboard → Settings → Webhooks (events: `payment.captured`, `payment.failed`; secret must match your backend's `projectConfig`).

Run a real test payment via `/payment/test` with card `4111 1111 1111 1111`. Watch the ngrok inspector at <http://127.0.0.1:4040> to see Razorpay's signed POST hit your backend in real time.

Override the defaults if your backend runs elsewhere:

```powershell
$env:BACKEND_PORT="7777"; $env:WEBHOOK_PATH="/webhooks/razorpay"; npm run tunnel
```

Tips:

- Free ngrok URLs change every restart — re-register in the Razorpay Dashboard each time, or upgrade to a reserved domain.
- The Razorpay Dashboard has a "Test webhook" button on each webhook that sends a synthetic event — useful for hammering the handler without a real card flow.
- If signature verification fails, double-check the secret matches and that the body is read raw (your `verifyRazorpayWebhook` uses `JSON.stringify(payload)` — make sure your Express server doesn't double-parse).

### Webhook NOT firing? Checklist

- Is the URL reachable from the public internet? (`curl https://...ngrok-free.app/...` should hit your backend.)
- Is the webhook enabled and the right events selected in the Razorpay Dashboard?
- Does the webhook secret in the Dashboard match the one your `projectConfig` returns?
- Does the Razorpay order's `notes` include `projectType` and `internalOrderId`? The webhook handler rejects with 400 if `projectType` is missing.
- For repeated test cards, payments may go straight to `payment.captured` — if you only listen for `payment.authorized`, you'll miss them. Listen for `payment.captured` and `payment.failed`.
