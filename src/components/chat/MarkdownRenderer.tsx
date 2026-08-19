"use client";

import React, { useState, memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Terminal } from "lucide-react";
import { sanitizeStreamedMarkdown } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock = memo(function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code block:", err);
    }
  };

  if (inline) {
    return (
      <code
        className="px-1.5 py-0.5 mx-0.5 text-xs sm:text-sm font-mono rounded bg-slate-800/80 text-indigo-300 border border-slate-700/60"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-3 rounded-lg overflow-hidden border border-slate-700/70 bg-slate-950 shadow-md group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 select-none">
        <div className="flex items-center space-x-2 font-mono">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300 lowercase">
            {language || "code"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors duration-150 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500"
          title="Copy code to clipboard"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
        <code>{children}</code>
      </pre>
    </div>
  );
});

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  isStreaming = false,
}: MarkdownRendererProps) {
  // Sanitize potentially unclosed markdown fences while streaming
  const processedContent = isStreaming
    ? sanitizeStreamedMarkdown(content)
    : content;

  return (
    <div className="prose prose-invert max-w-none text-slate-100 text-sm sm:text-base leading-relaxed break-words space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock as any,
          p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 mb-2.5 space-y-1 text-slate-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 mb-2.5 space-y-1 text-slate-200">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-bold text-white mt-4 mb-2 pb-1 border-b border-slate-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-3 mb-1.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-semibold text-slate-200 mt-2 mb-1">
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500/80 bg-slate-900/60 pl-3.5 py-1.5 my-2.5 rounded-r text-slate-300 italic">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-slate-800 shadow">
              <table className="min-w-full divide-y divide-slate-800 text-left text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-900/90 text-slate-200 font-semibold">
              {children}
            </thead>
          ),
          th: ({ children }) => <th className="px-3.5 py-2">{children}</th>,
          td: ({ children }) => (
            <td className="px-3.5 py-2 border-t border-slate-800/60 text-slate-300">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
});
