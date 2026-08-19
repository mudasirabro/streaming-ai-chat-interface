import { useState, useEffect, useRef, useCallback } from "react";

interface UseAutoScrollOptions {
  threshold?: number; // Distance in px from bottom to consider 'at bottom'
  smooth?: boolean;
}

export function useAutoScroll<T extends HTMLElement = HTMLDivElement>(
  dependencies: unknown[] = [],
  options: UseAutoScrollOptions = {}
) {
  const { threshold = 80, smooth = true } = options;

  const containerRef = useRef<T | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [hasNewMessagesAbove, setHasNewMessagesAbove] = useState(false);
  const isAutoScrolling = useRef(false);

  // Check if the user is currently at the bottom of the container
  const checkIsAtBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return true;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    return distanceToBottom <= threshold;
  }, [threshold]);

  // Scroll to bottom programmatically
  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = smooth ? "smooth" : "auto") => {
      const el = containerRef.current;
      if (!el) return;

      isAutoScrolling.current = true;
      el.scrollTo({
        top: el.scrollHeight,
        behavior,
      });

      setIsAtBottom(true);
      setHasNewMessagesAbove(false);

      // Reset auto-scroll flag after animation completes
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 350);
    },
    [smooth]
  );

  // Handle scroll events triggered by user or auto-scroll
  const handleScroll = useCallback(() => {
    if (isAutoScrolling.current) return;

    const atBottom = checkIsAtBottom();
    setIsAtBottom(atBottom);

    if (atBottom) {
      setHasNewMessagesAbove(false);
    }
  }, [checkIsAtBottom]);

  // Attach scroll listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Auto-scroll when dependencies update (e.g. new streaming chunks or messages)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isAtBottom) {
      // User is pinned at bottom: scroll down immediately to follow stream
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "auto", // Use instant scroll for token-by-token stream to prevent jitter
      });
    } else {
      // User has scrolled up: respect their position and show 'new content' indicator
      setHasNewMessagesAbove(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    containerRef,
    isAtBottom,
    hasNewMessagesAbove,
    scrollToBottom,
    checkIsAtBottom,
  };
}
