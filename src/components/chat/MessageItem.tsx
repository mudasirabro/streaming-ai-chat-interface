"use client";

import React, { useState, memo } from "react";
import { motion } from "framer-motion";
import { Bot, User, Copy, Check, Sparkles } from "lucide-react";
import type { Message } from "ai";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  isLatestAssistantMessage?: boolean;
  isStreaming?: boolean;
}

export const MessageItem = memo(function MessageItem({
  message,
  isLatestAssistantMessage = false,
  isStreaming = false,
}: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group relative flex w-full gap-3 sm:gap-4 px-3 sm:px-4 py-4 rounded-2xl transition-colors",
        isUser
          ? "bg-slate-900/40 border border-slate-800/60 ml-auto max-w-2xl"
          : "bg-slate-900/80 border border-slate-800 shadow-sm max-w-3xl"
      )}
    >
      {/* Avatar Icon */}
      <div
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl select-none",
          isUser
            ? "bg-slate-800 text-slate-200 border border-slate-700"
            : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content & Actions */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Header line: Role name + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-300">
              {isUser ? "You" : "FlyRank AI Assistant"}
            </span>
            {!isUser && isStreaming && isLatestAssistantMessage && (
              <span className="flex items-center space-x-1 text-[10px] text-indigo-400 font-mono bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/60 animate-pulse">
                <Sparkles className="w-2.5 h-2.5" />
                <span>streaming</span>
              </span>
            )}
          </div>

          {/* Quick Copy Button */}
          {message.content && (
            <button
              type="button"
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all text-xs"
              title="Copy message"
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {/* Content Body */}
        {isUser ? (
          <p className="text-sm sm:text-base text-slate-100 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        ) : (
          <MarkdownRenderer
            content={message.content}
            isStreaming={isStreaming && isLatestAssistantMessage}
          />
        )}
      </div>
    </motion.div>
  );
});
