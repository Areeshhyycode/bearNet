import "server-only";

/**
 * Minimal Groq client.
 *
 * Server-only on purpose: the API key must never reach the browser, so
 * every call goes through a route handler rather than straight from a
 * component. `server-only` makes an accidental client import a build error.
 */

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-oss-120b";

export type ChatRole = "system" | "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

export class GroqError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GroqError";
  }
}

export function isConfigured() {
  return Boolean(process.env.GROQ_API_KEY);
}

/**
 * Sends a chat completion and returns the assistant text.
 *
 * `gpt-oss` models split their output into `reasoning` and `content`; with a
 * tight token budget the whole allowance can go to reasoning and leave
 * `content` empty, so keep effort low and fall back to reasoning text.
 */
export async function chat({
  messages,
  temperature = 0.4,
  maxTokens = 900,
  json = false,
  signal,
}: {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
  signal?: AbortSignal;
}): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqError(
      "GROQ_API_KEY is not set. Copy .env.example to .env.local and add your key.",
      503,
    );
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      reasoning_effort: "low",
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
    signal,
  });

  if (!response.ok) {
    const detail = await response.text();
    let message = `Groq request failed (${response.status})`;
    try {
      const parsed = JSON.parse(detail);
      if (parsed?.error?.message) message = parsed.error.message;
    } catch {
      // Non-JSON error body — keep the generic message.
    }
    throw new GroqError(message, response.status);
  }

  const data = await response.json();
  const choice = data?.choices?.[0]?.message;
  const text: string = choice?.content?.trim() || choice?.reasoning?.trim() || "";

  if (!text) {
    throw new GroqError("The model returned an empty response.", 502);
  }

  return text;
}

/** Parses a JSON-mode reply, tolerating stray prose or code fences. */
export function parseJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new GroqError("Could not read the model's JSON response.", 502);
  }
}
