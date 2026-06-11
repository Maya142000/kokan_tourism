#!/usr/bin/env node
// Spawn an ngrok tunnel to the backend and print the public URLs for all
// payment-related endpoints.
//
// Usage: npm run tunnel
//
// Env overrides:
//   BACKEND_PORT  (default 8080)

import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const BACKEND_PORT = process.env.BACKEND_PORT ?? "7777";
const NGROK_API = "http://127.0.0.1:4040/api/tunnels";

const ENDPOINTS = [
  { label: "Razorpay webhook", path: "/api/v1/payment/webhook/razorpay" },
  { label: "Paytm callback",   path: "/api/v1/payment/callback" },
  { label: "Courier webhook",  path: "/api/v1/shopping/shipment/webhook" },
  { label: "Swagger",          path: "/api-docs" },
];

const ngrok = spawn("ngrok", ["http", BACKEND_PORT, "--log=stdout"], {
  stdio: ["ignore", "ignore", "inherit"],
  shell: process.platform === "win32",
});

ngrok.on("error", (err) => {
  console.error(
    "Failed to start ngrok. Install it from https://ngrok.com/download and ensure it is on PATH."
  );
  console.error(err.message);
  process.exit(1);
});

ngrok.on("exit", (code, signal) => {
  if (signal !== "SIGTERM" && signal !== "SIGINT") {
    console.error(`ngrok exited unexpectedly (code=${code}, signal=${signal}).`);
    process.exit(code ?? 1);
  }
});

const cleanup = () => {
  if (!ngrok.killed) ngrok.kill();
  process.exit(0);
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

async function getTunnelUrl() {
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const res = await fetch(NGROK_API);
      if (res.ok) {
        const data = await res.json();
        const https = data.tunnels?.find((t) =>
          t.public_url?.startsWith("https://")
        );
        if (https?.public_url) return https.public_url;
      }
    } catch {
      // ngrok local API not up yet
    }
    await wait(500);
  }
  throw new Error(
    "ngrok did not expose a tunnel within 15 seconds. " +
      "Check that you ran `ngrok config add-authtoken <token>` once."
  );
}

function pad(label, width = 22) {
  return (label + ":").padEnd(width, " ");
}

try {
  const url = await getTunnelUrl();
  const bar = "=".repeat(20);

  console.log();
  console.log(`${bar} NGROK TUNNEL ${bar}`);
  console.log(`${pad("Public URL")}${url}`);
  for (const { label, path } of ENDPOINTS) {
    console.log(`${pad(label)}${url}${path}`);
  }
  console.log(`${bar}===============${bar}`);
  console.log();
  console.log(`Forwarding to http://localhost:${BACKEND_PORT}`);
  console.log("Inspector:            http://127.0.0.1:4040");
  console.log();
  console.log(
    "Where to paste each URL:\n" +
      "  Razorpay webhook  → Razorpay Dashboard → Settings → Webhooks\n" +
      "  Paytm callback    → Paytm Dashboard → Callback URL\n" +
      "  Courier webhook   → Your courier provider's webhook config\n" +
      "  Swagger           → Open in browser to view API docs\n"
  );
  console.log("Press Ctrl+C to stop the tunnel.");
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  cleanup();
}
