"use client";

import React, { useState } from "react";
import { Sparkles, Trash2, Download, Cpu, RefreshCw, Check, ShieldCheck } from "lucide-react";
import { SUPPORTED_MODELS, DEFAULT_MODEL_ID } from "@/lib/ai/config";

interface ChatHeaderProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  isLoading: boolean;
  onClearChat: () => void;
  onExportChat: () => void;
  hasMessages: boolean;
}

export function ChatHeader({
  selectedModel,
  onSelectModel,
  isLoading,
  onClearChat,
  onExportChat,
  hasMessages,
}: ChatHeaderProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const currentModelConfig = SUPPORTED_MODELS[selectedModel] || SUPPORTED_MODELS[DEFAULT_MODEL_ID];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      {/* Brand Title & Capstone Tag */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              FlyRank AI Stream
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              FE-06 Capstone
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Token-by-Token Streaming · Robust Stop & Recovery · Server-Side Key Security
          </p>
        </div>
      </div>

      {/* Model & Action Toolbar */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Model Selector Dropdown */}
        <div className="relative flex items-center">
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs">
            <Cpu className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              disabled={isLoading}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              {Object.values(SUPPORTED_MODELS).map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                  {m.name} {m.isFreeTier ? "(Free Tier)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Streaming Pulse Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              isLoading ? "bg-emerald-400 animate-ping" : "bg-slate-500"
            }`}
          />
          <span className="text-[11px] text-slate-400 font-mono">
            {isLoading ? "Streaming" : "Ready"}
          </span>
        </div>

        {/* Export Chat Button */}
        {hasMessages && (
          <button
            type="button"
            onClick={onExportChat}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors text-xs flex items-center space-x-1"
            title="Export conversation as Markdown"
            aria-label="Export chat"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>
        )}

        {/* Clear Chat Button / Confirmation */}
        {hasMessages && (
          <>
            {showClearConfirm ? (
              <div className="flex items-center space-x-1 animate-fade-in">
                <button
                  type="button"
                  onClick={() => {
                    onClearChat();
                    setShowClearConfirm(false);
                  }}
                  className="px-2 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-medium transition-colors"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-1.5 py-1 rounded-md bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                disabled={isLoading}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors text-xs flex items-center space-x-1 disabled:opacity-50"
                title="Clear conversation"
                aria-label="Clear chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Clear</span>
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}
