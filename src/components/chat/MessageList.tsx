"use client";

import React from "react";
import { Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { MessageItem } from "./MessageItem";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { Sparkles, Terminal, Code2, Zap, ArrowRight } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSelectPrompt: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    title: "Stream Optimization",
    description: "How does SSE token streaming differ from WebSockets in modern AI UIs?",
    icon: Zap,
    prompt: "Compare SSE (Server-Sent Events) and WebSockets for AI token streaming. Give me a clear comparison table, pros/cons, and recommended frontend patterns.",
  },
  {
    title: "Qualification Chat",
    description: "Ask me 3 technical questions to assess Next.js 15 and AI SDK skills.",
    icon: Code2,
    prompt: "Act as an elite frontend interviewer. Ask me 3 challenging qualification questions about streaming UI, race conditions, and auto-scroll heuristics in AI chat interfaces.",
  },
  {
    title: "Audit Summary Stream",
    description: "Generate a sample architectural audit report with markdown code.",
    icon: Terminal,
    prompt: "Generate an audit summary report for a streaming chat application. Include performance benchmarks, security best practices (keeping API keys server-side), and TypeScript code snippets.",
  },
];

export function MessageList({
  messages,
  isLoading,
  onSelectPrompt,
}: MessageListProps) {
  const lastMessage = messages[messages.length - 1];
  const isAssistantThinking =
    isLoading && (!lastMessage || lastMessage.role === "user" || !lastMessage.content);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Empty State / Welcome Screen */}
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 select-none my-auto"
        >
          {/* Glowing Brand Icon */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 shadow-[0_0_24px_rgba(99,102,241,0.2)]">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              FlyRank Streaming AI Interface
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Experience real-time token-by-token streaming, robust stop & resume lifecycle, stream-safe markdown, and auto-scroll heuristics.
            </p>
          </div>

          {/* Starter Suggestion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl pt-2">
            {STARTER_PROMPTS.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelectPrompt(item.prompt)}
                  className="flex flex-col text-left p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-200 group focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 mb-1 group-hover:text-white">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      ) : (
        /* Rendered Conversation Messages */
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isLatest = index === messages.length - 1;
            return (
              <MessageItem
                key={message.id || index}
                message={message}
                isLatestAssistantMessage={isLatest && message.role === "assistant"}
                isStreaming={isLoading && isLatest}
              />
            );
          })}

          {/* Thinking Indicator Handoff */}
          <AnimatePresence>
            {isAssistantThinking && (
              <div className="max-w-3xl">
                <ThinkingIndicator statusText="Analyzing & generating tokens..." />
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
