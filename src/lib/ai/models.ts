import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { SUPPORTED_MODELS, DEFAULT_MODEL_ID, ModelProviderConfig } from "./config";
import type { LanguageModel } from "ai";

/**
 * Returns an instance of the configured LanguageModel based on modelId and server environment variables.
 *
 * All API keys are resolved STRICTLY on the server side to protect secrets from client exposure.
 */
export function getLanguageModel(modelId: string = DEFAULT_MODEL_ID): LanguageModel {
  const modelConfig: ModelProviderConfig = SUPPORTED_MODELS[modelId] || SUPPORTED_MODELS[DEFAULT_MODEL_ID];

  switch (modelConfig.provider) {
    case "google": {
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Missing Google Gemini API Key. Please set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY in your .env.local file."
        );
      }
      const google = createGoogleGenerativeAI({
        apiKey: apiKey.trim(),
      });
      return google(modelConfig.modelName);
    }

    case "anthropic": {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Missing Anthropic API Key. Please set ANTHROPIC_API_KEY in your .env.local file or select a free Google Gemini model."
        );
      }
      const anthropic = createAnthropic({
        apiKey: apiKey.trim(),
      });
      return anthropic(modelConfig.modelName);
    }

    case "openai": {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Missing OpenAI API Key. Please set OPENAI_API_KEY in your .env.local file or select a free Google Gemini model."
        );
      }
      const openai = createOpenAI({
        apiKey: apiKey.trim(),
      });
      return openai(modelConfig.modelName);
    }

    default:
      throw new Error(`Unsupported model provider: ${modelConfig.provider}`);
  }
}
