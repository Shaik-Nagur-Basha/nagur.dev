import { useState, useRef, useCallback } from "react";

/**
 * useScrollReveal — fires once when the element enters the viewport.
 * Uses a callback ref to handle elements that are conditionally rendered (e.g. after skeletons).
 *
 * @param {Object} options
 * @param {number}  options.threshold   - 0–1, fraction of element visible before triggering (default 0.12)
 * @param {string}  options.rootMargin  - IntersectionObserver rootMargin (default "0px 0px -60px 0px")
 * @param {number}  options.delay       - Additional JS-side delay in ms before marking visible (default 0)
 *
 * @returns {[(node: Element | null) => void, boolean]} [refCallback, isVisible]
 */
function useScrollReveal({
  threshold = 0.12,
  rootMargin = "0px 0px -60px 0px",
  delay = 0,
} = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  const prefersReduced = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  const ref = useCallback((node) => {
    // If node is null, or already visible, or user prefers reduced motion
    if (!node || isVisible || prefersReduced) {
      if (prefersReduced && !isVisible) {
        setIsVisible(true);
      }
      return;
    }

    // Clean up any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // If node is already in view (e.g. above fold), trigger immediately
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (delay > 0) {
          setTimeout(() => setIsVisible(true), delay);
        } else {
          setIsVisible(true);
        }
        observer.disconnect();
        observerRef.current = null;
      }
    }, {
      threshold,
      rootMargin,
    });

    observer.observe(node);
    observerRef.current = observer;
  }, [threshold, rootMargin, delay, isVisible, prefersReduced]);

  return [ref, isVisible];
}

/**
 * useStaggeredReveal — reveals multiple items staggered, all sharing one observer.
 * Uses a callback ref to handle elements that are conditionally rendered.
 *
 * @param {number} count     - Number of items
 * @param {Object} options   - Same options as useScrollReveal
 * @returns {[(node: Element | null) => void, boolean[]]} [refCallback, visibleArray]
 */
export function useStaggeredReveal(count, options = {}) {
  const { threshold = 0.08, rootMargin = "0px 0px -40px 0px" } = options;
  const [visibleItems, setVisibleItems] = useState(() => Array(count).fill(false));
  const observerRef = useRef(null);

  const prefersReduced = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  const ref = useCallback((node) => {
    const allVisible = visibleItems.every(Boolean);
    if (!node || allVisible || prefersReduced) {
      if (prefersReduced && !allVisible) {
        setVisibleItems(Array(count).fill(true));
      }
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Check if already in viewport
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisibleItems(Array(count).fill(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          Array.from({ length: count }).forEach((_, i) => {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 80);
          });
          observer.disconnect();
          observerRef.current = null;
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    observerRef.current = observer;
  }, [count, threshold, rootMargin, visibleItems, prefersReduced]);

  return [ref, visibleItems];
}

export default useScrollReveal;
