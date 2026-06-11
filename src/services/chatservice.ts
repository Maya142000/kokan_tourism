"use client";

import axios from "axios";

/**
 * Chat backend lives on its own service (default :5000), separate from the
 * payment backend. Override with NEXT_PUBLIC_CHAT_API_BASE_URL if needed.
 */
const CHAT_API_BASE_URL =
  process.env.NEXT_PUBLIC_CHAT_API_BASE_URL ?? "http://localhost:5000";

export type ChatRequest = {
  question: string;
  sessionId: string;
  userId: string;
  project: string;
};

/**
 * The backend response shape isn't fixed, so we accept anything and pull the
 * answer out of the most common fields below.
 */
type ChatResponse = Record<string, unknown>;

const DEFAULTS = {
  userId: "674eb0aa9971ef6abe8cd7a2",
  project: "fch",
} as const;

/** Pulls a human-readable answer out of whatever shape the backend returns. */
function extractAnswer(data: ChatResponse): string {
  const candidate =
    data.answer ??
    data.response ??
    data.message ??
    data.reply ??
    data.text ??
    (data.data as ChatResponse | undefined)?.answer ??
    (data.data as ChatResponse | undefined)?.response;

  if (typeof candidate === "string" && candidate.trim()) return candidate;
  if (typeof data.data === "string" && data.data.trim()) return data.data;

  // Last resort: stringify so nothing is silently dropped.
  return JSON.stringify(data);
}

export async function sendChatMessage(args: {
  question: string;
  sessionId: string;
  userId?: string;
  project?: string;
}): Promise<string> {
  const body: ChatRequest = {
    question: args.question,
    sessionId: args.sessionId,
    userId: args.userId ?? DEFAULTS.userId,
    project: args.project ?? DEFAULTS.project,
  };

  const { data } = await axios.post<ChatResponse>(
    `${CHAT_API_BASE_URL}/api/v1/chat`,
    body,
    { headers: { "Content-Type": "application/json", accept: "*/*" } }
  );

  return extractAnswer(data);
}
