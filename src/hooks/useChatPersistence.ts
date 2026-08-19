"use client";

import { useEffect, useState, useCallback } from "react";
import type { Message } from "ai";

const STORAGE_KEY = "flyrank_streaming_chat_messages_v1";

export function useChatPersistence(
  messages: Message[],
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void
) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Load stored messages from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load chat history from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, [setMessages]);

  // Sync messages to localStorage whenever they update (after initial load)
  useEffect(() => {
    if (!isLoaded) return;

    try {
      if (messages.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (e) {
      console.warn("Failed to persist messages to localStorage:", e);
    }
  }, [messages, isLoaded]);

  // Clear chat history
  const clearChat = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([]);
    } catch (e) {
      console.warn("Failed to clear chat history:", e);
    }
  }, [setMessages]);

  // Export chat as Markdown
  const exportAsMarkdown = useCallback(() => {
    if (messages.length === 0) return;

    const formatted = messages
      .map(
        (m) =>
          `### ${m.role === "user" ? "👤 User" : "🤖 FlyRank Assistant"}\n\n${m.content}\n\n---`
      )
      .join("\n\n");

    const blob = new Blob([`# FlyRank AI Chat Export\n\n${formatted}`], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flyrank-chat-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  return {
    isLoaded,
    clearChat,
    exportAsMarkdown,
  };
}
