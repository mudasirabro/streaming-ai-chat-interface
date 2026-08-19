import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes with clsx conditionals
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a timestamp into a clean readable string (e.g., '10:45 AM')
 */
export function formatTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
 * Auto-balances streamed markdown by closing dangling unclosed code blocks,
 * asterisks, or underscores to prevent visual layout breaking mid-stream.
 */
export function sanitizeStreamedMarkdown(text: string): string {
  if (!text) return "";

  let processed = text;

  // Count code block backticks (```)
  const codeBlockMatches = processed.match(/```/g);
  const codeBlockCount = codeBlockMatches ? codeBlockMatches.length : 0;

  // If there's an odd number of ``` fences, close the pending code fence
  if (codeBlockCount % 2 !== 0) {
    processed += "\n```";
  }

  return processed;
}
