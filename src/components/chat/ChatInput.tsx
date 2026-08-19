"use client";

import React, { useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { ArrowUp, Square, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  stop: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  placeholder = "Ask FlyRank AI assistant anything... (Enter to send, Shift+Enter for new line)",
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea height based on content
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 160);
    textarea.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  // Focus textarea on load
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim().length > 0) {
        handleSubmit();
      }
    }
  };

  const hasText = input.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isLoading) {
            stop();
          } else if (hasText) {
            handleSubmit(e);
          }
        }}
        className={cn(
          "relative flex flex-col rounded-2xl border transition-all duration-200 bg-slate-900/90 backdrop-blur-md shadow-xl",
          isLoading
            ? "border-indigo-500/50 ring-1 ring-indigo-500/30"
            : hasText
            ? "border-indigo-500/70 ring-1 ring-indigo-500/20"
            : "border-slate-800 focus-within:border-slate-700 hover:border-slate-700/80"
        )}
      >
        {/* Text Area */}
        <div className="relative flex items-center px-4 pt-3 pb-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Generating response... (Click stop or wait)" : placeholder}
            disabled={disabled}
            className="w-full resize-none bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none scrollbar-thin scrollbar-thumb-slate-700 max-h-40 leading-relaxed"
            style={{ minHeight: "44px" }}
          />
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between px-4 pb-2.5 pt-1 border-t border-slate-800/40 text-xs text-slate-500 select-none">
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-flex items-center text-slate-400 font-mono text-[11px]">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 mr-1">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 mx-1">
                Shift + Enter
              </kbd>{" "}
              for newline
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Character Count */}
            {hasText && (
              <span className="text-[11px] text-slate-400 mr-2 font-mono">
                {input.length} chars
              </span>
            )}

            {/* Five-State Dynamic Action Button */}
            {isLoading ? (
              <motion.button
                key="stop-button"
                type="button"
                onClick={stop}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-medium text-xs sm:text-sm bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors shadow-[0_0_12px_rgba(244,63,94,0.25)] focus:outline-none focus:ring-2 focus:ring-rose-400"
                title="Stop generation"
                aria-label="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </motion.button>
            ) : (
              <motion.button
                key="send-button"
                type="submit"
                disabled={!hasText || disabled}
                whileHover={hasText ? { scale: 1.05 } : {}}
                whileTap={hasText ? { scale: 0.95 } : {}}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                  hasText
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                )}
                title={hasText ? "Send message" : "Type a message to send"}
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
