"use client";

import React, { useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { ScrollToBottom } from "./ScrollToBottom";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { useChatPersistence } from "@/hooks/useChatPersistence";
import { DEFAULT_MODEL_ID } from "@/lib/ai/config";
import { AlertCircle, RotateCcw } from "lucide-react";

export function ChatContainer() {
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Vercel AI SDK useChat Hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    stop: originalStop,
    reload,
    setMessages,
    setInput,
  } = useChat({
    api: "/api/chat",
    body: {
      modelId: selectedModel,
    },
    onError: (err) => {
      console.error("Streaming Chat Error:", err);
      setStreamError(
        err.message || "Failed to generate stream. Please check your API key or connection."
      );
    },
    onFinish: () => {
      setStreamError(null);
    },
  });

  // Local Storage Persistence
  const { clearChat, exportAsMarkdown } = useChatPersistence(messages, setMessages);

  // Auto-scroll controller tracking streaming tokens & scroll position
  const {
    containerRef,
    isAtBottom,
    hasNewMessagesAbove,
    scrollToBottom,
  } = useAutoScroll([messages, isLoading]);

  // Robust Stop Handler: preserves partial tokens and re-enables input immediately
  const handleStop = useCallback(() => {
    originalStop();
    setStreamError(null);
  }, [originalStop]);

  // Safe submit wrapper
  const handleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      setStreamError(null);
      originalHandleSubmit(e);
    },
    [originalHandleSubmit]
  );

  // Select starter prompt
  const handleSelectStarterPrompt = useCallback(
    (promptText: string) => {
      setInput(promptText);
    },
    [setInput]
  );

  return (
    <div className="relative flex flex-col h-[100dvh] w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation & Status Bar */}
      <ChatHeader
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        isLoading={isLoading}
        onClearChat={clearChat}
        onExportChat={exportAsMarkdown}
        hasMessages={messages.length > 0}
      />

      {/* Main Chat Scroll Viewport */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-800 hover:scrollbar-thumb-slate-700"
      >
        {/* Error Banner */}
        {streamError && (
          <div className="sticky top-2 z-20 max-w-2xl mx-auto px-4 my-2 animate-fade-in">
            <div className="flex items-start justify-between p-3.5 rounded-xl bg-rose-950/80 border border-rose-600/40 text-rose-200 text-xs shadow-lg backdrop-blur-md">
              <div className="flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-rose-300">Streaming Error</p>
                  <p className="text-rose-200/90 leading-relaxed">{streamError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStreamError(null);
                  reload();
                }}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-rose-900/60 hover:bg-rose-900 border border-rose-700/50 text-white transition-colors text-xs font-medium ml-3 flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Message Feed / Starter Prompts */}
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onSelectPrompt={handleSelectStarterPrompt}
        />
      </div>

      {/* Floating Scroll to Bottom Button */}
      <ScrollToBottom
        isVisible={!isAtBottom}
        hasNewContent={hasNewMessagesAbove}
        onClick={() => scrollToBottom("smooth")}
      />

      {/* Fixed Bottom Input Area */}
      <div className="relative z-10 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-4">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={handleStop}
        />
      </div>
    </div>
  );
}
