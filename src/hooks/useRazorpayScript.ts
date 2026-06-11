"use client";

import { useCallback, useEffect, useState } from "react";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const SCRIPT_ID = "razorpay-checkout-script";

type Status = "idle" | "loading" | "ready" | "error";

export function useRazorpayScript() {
  const [status, setStatus] = useState<Status>("idle");

  const load = useCallback(() => {
    if (typeof window === "undefined") return;

    if (window.Razorpay) {
      setStatus("ready");
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") {
        setStatus("ready");
      } else {
        setStatus("loading");
        existing.addEventListener("load", () => setStatus("ready"), { once: true });
        existing.addEventListener("error", () => setStatus("error"), { once: true });
      }
      return;
    }

    setStatus("loading");
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      setStatus("ready");
    };
    script.onerror = () => setStatus("error");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { status, reload: load };
}
