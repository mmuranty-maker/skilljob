import { useEffect } from "react";

interface AffirmationScreenProps {
  message: string;
  onContinue: () => void;
  durationMs?: number;
}

/**
 * Pause-style transition shown between quiz steps.
 * - Auto-advances after `durationMs` (default 2200ms)
 * - Tap/click anywhere to skip immediately
 * - No progress bar — it's a pause, not a step
 */
export function AffirmationScreen({ message, onContinue, durationMs = 2200 }: AffirmationScreenProps) {
  useEffect(() => {
    const t = setTimeout(onContinue, durationMs);
    return () => clearTimeout(t);
  }, [onContinue, durationMs]);

  // Keyboard accessibility: any key skips
  useEffect(() => {
    const onKey = () => onContinue();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinue]);

  return (
    <button
      type="button"
      onClick={onContinue}
      aria-label="Continue"
      className="fixed inset-0 z-30 flex items-center justify-center bg-background px-6 text-center cursor-pointer animate-fade-in"
    >
      <p className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground max-w-2xl leading-snug">
        {message}
      </p>
    </button>
  );
}
