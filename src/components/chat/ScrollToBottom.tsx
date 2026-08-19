"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollToBottomProps {
  isVisible: boolean;
  hasNewContent: boolean;
  onClick: () => void;
}

export function ScrollToBottom({
  isVisible,
  hasNewContent,
  onClick,
}: ScrollToBottomProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-4 right-6 z-20"
        >
          <button
            type="button"
            onClick={onClick}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-full shadow-lg border backdrop-blur-md transition-all duration-200",
              "bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500",
              hasNewContent && "border-indigo-500/80 shadow-[0_0_15px_rgba(99,102,241,0.35)]"
            )}
            title="Jump to latest messages"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium">
              {hasNewContent ? "New tokens below" : "Jump to latest"}
            </span>

            {hasNewContent && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
