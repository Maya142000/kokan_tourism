"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendChatMessage } from "@/src/services/chatservice";

type Role = "user" | "bot";

type Message = {
  id: string;
  role: Role;
  text: string;
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const GREETING: Message = {
  id: "greeting",
  role: "bot",
  text: "Hi! Ask me anything about  Konkan.",
};

/* Tailwind-styled renderers for the markdown the bot returns. */
const mdComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-1 mt-2 text-[15px] font-bold first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-1 mt-2 text-[14px] font-bold first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-2 text-[13px] font-bold uppercase tracking-wide text-emerald-800 first:mt-0">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-bold text-black">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/5 px-1 py-0.5 text-[12px]">
      {children}
    </code>
  ),
};

function BotMarkdown({ text }: { text: string }) {
  return (
    <div className="text-[13px] leading-relaxed [&>:first-child]:mt-0 [&>:last-child]:mb-0">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // One stable session id per browser session.
  const sessionIdRef = useRef<string>("");
  if (!sessionIdRef.current) sessionIdRef.current = newId();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    const userMsg: Message = { id: newId(), role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const answer = await sendChatMessage({
        question,
        sessionId: sessionIdRef.current,
      });
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "bot", text: answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-mono">
      {/* ── CHAT WINDOW ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 flex h-[70vh] max-h-[560px] w-[88vw] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#f0ede4] shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between bg-emerald-700 px-4 py-3 text-white">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  Kokan Assistant
                </span>
                <span className="text-[10px] opacity-70">
                  Ask about Konkan & more
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none transition hover:bg-white/20"
              >
                ×
              </button>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  <div
                    className={
                      "max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed " +
                      (m.role === "user"
                        ? "whitespace-pre-wrap rounded-br-sm bg-emerald-700 text-white"
                        : "rounded-bl-sm bg-white text-black shadow-sm")
                    }
                  >
                    {m.role === "bot" ? (
                      <BotMarkdown text={m.text} />
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-3 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 animate-bounce rounded-full bg-emerald-700/60"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* input */}
            <div className="flex items-end gap-2 border-t border-black/10 bg-[#f0ede4] px-3 py-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Type your message…"
                className="max-h-28 flex-1 resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-[13px] outline-none focus:border-emerald-700"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white transition hover:bg-emerald-800 disabled:opacity-40"
                aria-label="Send message"
              >
                ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LAUNCHER BUTTON ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="grid h-14 w-14 place-items-center rounded-full bg-emerald-700 text-white shadow-xl transition hover:scale-105 hover:bg-emerald-800"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
