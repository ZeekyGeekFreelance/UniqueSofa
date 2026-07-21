import { useRef } from "react";

const THRESHOLD = 40;

type SwipeHandlers = {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
};

export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void): SwipeHandlers {
  const startX = useRef<number | null>(null);

  return {
    onTouchStart: (e) => {
      startX.current = e.changedTouches[0].clientX;
    },
    onTouchEnd: (e) => {
      if (startX.current === null) return;
      const delta = e.changedTouches[0].clientX - startX.current;
      startX.current = null;
      if (Math.abs(delta) < THRESHOLD) return;
      if (delta < 0) onSwipeLeft();
      else onSwipeRight();
    },
  };
}
