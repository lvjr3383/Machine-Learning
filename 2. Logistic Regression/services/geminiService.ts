
import { ChatMessage } from "../types";

type OracleResponse = {
  text?: string;
};

const OFFLINE_MESSAGE = "Service unavailable.";
const EMPTY_MESSAGE = "No response returned.";

export const getGeminiChatResponse = async (
  message: string,
  history: ChatMessage[],
  currentStep: number
) => {
  try {
    const response = await fetch("/api/oracle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, currentStep })
    });

    if (!response.ok) {
      const errorText = await readErrorMessage(response);
      console.error("Assistant API error:", errorText);
      return OFFLINE_MESSAGE;
    }

    const data = (await response.json()) as OracleResponse;
    const text = typeof data?.text === "string" ? data.text : "";
    const cleaned = text.replace(/\*/g, "").replace(/#/g, "").trim();
    return cleaned || EMPTY_MESSAGE;
  } catch (error) {
    console.error("Assistant API error:", error);
    return OFFLINE_MESSAGE;
  }
};

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    if (data?.error) return data.error;
  } catch (error) {
    // Ignore JSON parsing errors and fall back to status text.
  }
  return response.statusText || "Request failed";
}
