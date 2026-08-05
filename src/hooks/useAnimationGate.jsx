import { useCallback, useEffect, useState } from 'react';

/* Temporarily enables animations after user interaction
and prevents transitions from playing during state hydration. */

export function useAnimationGate(duration = 300) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    const timeoutId = window.setTimeout(() => {
      setIsAnimating(false);
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [isAnimating, duration]);

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
  }, []);

  return {
    isAnimating,
    triggerAnimation,
  };
}
