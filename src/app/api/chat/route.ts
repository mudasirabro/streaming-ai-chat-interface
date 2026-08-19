import { streamText } from "ai";
import { getLanguageModel } from "@/lib/ai/models";
import { SYSTEM_PROMPT, GENERATION_CONFIG, DEFAULT_MODEL_ID } from "@/lib/ai/config";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, modelId = DEFAULT_MODEL_ID } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: 'messages' array is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Resolve model based on server configuration and API keys
    const model = getLanguageModel(modelId);

    // Call streamText with full conversational history and system instructions
    const result = streamText({
      model,
      system: SYSTEM_PROMPT,
      messages,
      temperature: GENERATION_CONFIG.temperature,
      topP: GENERATION_CONFIG.topP,
      maxTokens: GENERATION_CONFIG.maxTokens,
    });

    // Return the SSE data stream response for the client useChat hook
    return result.toDataStreamResponse();
  } catch (error: unknown) {
    console.error("[API Chat Error]:", error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";

    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
