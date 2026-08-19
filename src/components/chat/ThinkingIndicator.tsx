"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ThinkingIndicatorProps {
  statusText?: string;
}

export function ThinkingIndicator({
  statusText = "Thinking...",
}: ThinkingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-center space-x-3 py-2 px-1 select-none"
    >
      {/* Animated Glowing Sparkle Icon */}
      <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-950/70 border border-indigo-500/30 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.25)]">
        <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} />
      </div>

      {/* Pulsing Text & Dots */}
      <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-slate-400">
        <span>{statusText}</span>
        <div className="flex items-center space-x-1">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          />
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          />
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
          />
        </div>
      </div>
    </motion.div>
  );
}
