/**
 * ============================================================================
 * AI Model & System Configuration Module (FlyRank FE-06 Capstone Core)
 * ============================================================================
 *
 * This module centralizes all AI model parameters, system prompts, and provider
 * defaults in a single, well-documented location.
 *
 * NOTE FOR FE-07 EXTENSION:
 * This module is designed to be easily extensible for tool calling, structured outputs,
 * and multi-modal attachments in subsequent assignments (FE-07).
 */

export interface ModelProviderConfig {
  id: string;
  name: string;
  provider: "google" | "anthropic" | "openai";
  modelName: string;
  description: string;
  isFreeTier: boolean;
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
}

/**
 * Supported Model Catalog
 * Defaults to Google Gemini 3.6 Flash / 3.7 Flash (Free Tier with high throughput)
 * with seamless fallbacks for Anthropic Claude and OpenAI.
 */
export const SUPPORTED_MODELS: Record<string, ModelProviderConfig> = {
  "gemini-3.6-flash": {
    id: "gemini-3.6-flash",
    name: "Gemini 3.6 Flash",
    provider: "google",
    modelName: "gemini-3.6-flash",
    description: "Ultra-fast, state-of-the-art token streaming with generous free-tier API limits.",
    isFreeTier: true,
    maxOutputTokens: 4096,
    temperature: 0.7,
    topP: 0.95,
  },
  "gemini-3.7-flash": {
    id: "gemini-3.7-flash",
    name: "Gemini 3.7 Flash",
    provider: "google",
    modelName: "gemini-3.7-flash",
    description: "Cutting-edge reasoning and instant token emission from Google.",
    isFreeTier: true,
    maxOutputTokens: 4096,
    temperature: 0.7,
    topP: 0.95,
  },
  "gemini-3.5-flash": {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    provider: "google",
    modelName: "gemini-3.5-flash",
    description: "High efficiency, multi-turn conversational reasoning.",
    isFreeTier: true,
    maxOutputTokens: 4096,
    temperature: 0.7,
    topP: 0.95,
  },
  "claude-3-5-sonnet": {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "anthropic",
    modelName: "claude-3-5-sonnet-20241022",
    description: "Industry standard for nuanced reasoning, coding excellence, and technical precision.",
    isFreeTier: false,
    maxOutputTokens: 4096,
    temperature: 0.7,
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    modelName: "gpt-4o-mini",
    description: "Fast, cost-efficient, and highly capable generalist model from OpenAI.",
    isFreeTier: false,
    maxOutputTokens: 4096,
    temperature: 0.7,
  },
};

/**
 * Active Default Model Key
 * Uses Gemini 3.6 Flash by default (Free tier).
 */
export const DEFAULT_MODEL_ID = "gemini-3.6-flash";

/**
 * System Instructions for the AI Interaction Agent
 *
 * Configured as an elite AI Engineering & Qualification Assistant for FlyRank AI Internship:
 * - Visually formats code, tables, and architectural breakdowns.
 * - Adheres to token efficiency and streaming-friendly markdown structure.
 * - Maintains multi-turn context cleanly.
 */
export const SYSTEM_PROMPT = `You are FlyRank Assistant, an elite AI Engineer and technical qualification partner for the FlyRank AI Internship.
Your goal is to provide insightful, accurate, and structured technical responses in real-time.

Guidelines:
1. Formatting & Code:
   - Always use proper GitHub-flavored Markdown for code snippets with language tags (e.g. \`\`\`typescript, \`\`\`python).
   - Use clean bullet points, numbered steps, and bold headings to make streamed content effortless to read.
   - For tabular comparisons or metrics, use clean markdown tables.

2. Tone & Persona:
   - Professional, concise, technically rigorous, and encouraging.
   - Avoid unnecessary preamble or repetitive introductory fluff. Jump straight into the high-value answer.

3. Streaming Excellence:
   - Structure responses logically so the user sees value from the very first streamed chunk.
   - If generating code, explain the high-level architecture before and after the code block.

Current Context: FlyRank AI Capstone Streaming Interface.`;

/**
 * Default AI generation hyperparameters
 */
export const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  maxTokens: 4000,
};
