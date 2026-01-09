import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { IncomingMessage, ServerResponse } from "http";
import type { ChatMessage } from "../types";
import { STEP_METADATA } from "../constants";

const SYSTEM_PROMPT = `You are a concise linear regression tutor.
Keep responses to at most two short sentences.
Avoid markdown formatting.`;

const MAX_BODY_BYTES = 64 * 1024;
const MAX_MESSAGE_CHARS = 1200;
const MAX_HISTORY_CHARS = 1200;
const MAX_HISTORY_ITEMS = 20;
const STEP_KEYS = Object.keys(STEP_METADATA).map(Number).filter(Number.isFinite);
const DEFAULT_STEP = STEP_KEYS.length > 0 ? Math.min(...STEP_KEYS) : 1;
const ALLOWED_STEPS = new Set(STEP_KEYS.length > 0 ? STEP_KEYS : [DEFAULT_STEP]);

type OracleRequest = {
  message?: string;
  history?: ChatMessage[];
  currentStep?: number;
  useThinking?: boolean;
};

type NormalizedRequest = {
  message: string;
  history: ChatMessage[];
  currentStep: number;
  useThinking: boolean;
};

export function createOracleMiddleware(apiKey: string) {
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  return async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Method not allowed." }, { Allow: "POST" });
      return;
    }

    const contentType = String(req.headers["content-type"] || "");
    if (!contentType.includes("application/json")) {
      sendJson(res, 415, { error: "Unsupported content type." });
      return;
    }

    if (!ai) {
      sendJson(res, 500, { error: "Missing Gemini API key." });
      return;
    }

    try {
      const body = await readJson(req);
      const request = normalizeRequest(body);
      if (!request.message) {
        sendJson(res, 400, { error: "Message required." });
        return;
      }

      const text = await generateOracleResponse(ai, request);
      sendJson(res, 200, { text });
    } catch (error) {
      console.error("Assistant API error:", error);
      sendJson(res, 500, { error: "Assistant service unavailable." });
    }
  };
}

async function generateOracleResponse(ai: GoogleGenAI, request: NormalizedRequest): Promise<string> {
  const modelName = request.useThinking ? "gemini-3-pro-preview" : "gemini-3-flash-preview";
  const stepContext = buildStepContext(request.currentStep);
  const systemInstruction = `${SYSTEM_PROMPT}\n${stepContext}`;

  const config: Record<string, unknown> = { systemInstruction };
  if (request.useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: modelName,
    contents: [
      ...request.history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: "user", parts: [{ text: request.message }] }
    ],
    config
  });

  let text = response.text || "No response returned.";
  text = text.replace(/\*/g, "").replace(/#/g, "").trim();
  return text;
}

function normalizeRequest(body: unknown): NormalizedRequest {
  const payload = (body && typeof body === "object") ? (body as OracleRequest) : {};
  const message = normalizeMessage(payload.message);
  const history = normalizeHistory(payload.history);
  const currentStep = normalizeStep(payload.currentStep);
  const useThinking = Boolean(payload.useThinking);
  return { message, history, currentStep, useThinking };
}

function normalizeMessage(message: unknown): string {
  if (typeof message !== "string") return "";
  const trimmed = message.trim();
  if (!trimmed) return "";
  return trimmed.slice(0, MAX_MESSAGE_CHARS);
}

function normalizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];
  const normalized: ChatMessage[] = [];
  for (const item of history) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as ChatMessage;
    if (candidate.role !== "user" && candidate.role !== "model") continue;
    if (typeof candidate.text !== "string") continue;
    const text = candidate.text.trim();
    if (!text) continue;
    normalized.push({ role: candidate.role, text: text.slice(0, MAX_HISTORY_CHARS) });
    if (normalized.length >= MAX_HISTORY_ITEMS) break;
  }
  return normalized;
}

function normalizeStep(step: unknown): number {
  const value = typeof step === "number" ? Math.floor(step) : Number(step);
  if (!Number.isFinite(value)) return DEFAULT_STEP;
  if (!ALLOWED_STEPS.has(value)) return DEFAULT_STEP;
  return value;
}

function buildStepContext(step: number): string {
  const meta = STEP_METADATA[step as keyof typeof STEP_METADATA] ||
    STEP_METADATA[DEFAULT_STEP as keyof typeof STEP_METADATA];
  return `Current step ${step}: ${meta.title}. Objective: ${meta.description} Mechanics: ${meta.mechanics}`;
}

function sendJson(
  res: ServerResponse,
  status: number,
  payload: Record<string, unknown>,
  headers: Record<string, string> = {}
) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(payload));
}

function readJson(req: IncomingMessage): Promise<unknown> {
  const length = Number(req.headers["content-length"] || 0);
  if (length > MAX_BODY_BYTES) {
    return Promise.reject(new Error("Payload too large"));
  }

  return new Promise((resolve, reject) => {
    let data = "";
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        req.destroy();
        reject(new Error("Payload too large"));
        return;
      }
      data += chunk;
    });

    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}
