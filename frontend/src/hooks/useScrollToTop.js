import { useEffect } from "react";

export function useScrollToTop() {
  useEffect(() => {
    // Scroll to top on component mount (page load/refresh)
    window.scrollTo(0, 0);
  }, []);
}
