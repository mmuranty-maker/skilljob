import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface InlineAffirmationProps {
  message: string;
  /** Resets timing when this changes (e.g. step key) */
  resetKey?: string | number;
  durationMs?: number;
}

/**
 * Small celebratory pill rendered above the next question's headline.
 * Auto-fades in on mount, auto-dismisses after `durationMs`.
 * Renders nothing when `message` is empty.
 */
export function InlineAffirmation({ message, resetKey, durationMs = 2800 }: InlineAffirmationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), durationMs);
    return () => clearTimeout(t);
  }, [message, resetKey, durationMs]);

  if (!message || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 animate-fade-in border border-primary/20 max-w-full"
    >
      <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
      <span className="truncate sm:whitespace-normal sm:truncate-none">{message}</span>
    </div>
  );
}
