import { useCallback, useEffect, useState } from 'react';

/**
 * Temporarily enables animations after user interaction
 * and prevents transitions from playing during state hydration.
 *
 * @param {number} duration - duration in milliseconds.
 * @returns {{
 *   isAnimating: boolean,
 *   triggerAnimation: () => void
 * }}
 */

export function UseAnimationGate(duration) {
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
