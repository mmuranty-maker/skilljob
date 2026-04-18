

## What's wrong with the current pattern

Each AffirmationScreen is a **full-screen takeover** (`fixed inset-0 z-30 bg-background`) that:
- Hides the progress bar and context
- Makes the user wait 2.2s on a blank screen with one sentence
- Forces a "clear → wait → reveal" rhythm that breaks momentum
- Feels like an interstitial ad — the user wonders "did I just submit?"

We want the same emotional payoff (acknowledgment + warmth) without freezing the flow.

## Three lighter ways to celebrate progress

### Option A — Inline toast above the next question (recommended)
The next step renders immediately. A small celebratory pill animates in **above the headline** of the next question (e.g. "✓ Hospitality — one of the most transferable skill bases. Nice starting point.") and fades out after ~2.5s. The user reads the next question while the affirmation lands in their peripheral vision.

- Zero wait time
- Affirmation still personal and contextual
- Feels like a coach murmuring approval, not a popup

### Option B — Animated progress dot + micro-confetti
When a step completes, the progress dot fills with a small burst (sparkle particles around it) and the dot label briefly swaps to a 2-3 word affirmation ("Nice start", "Good one", "Strong stuff") for ~1.5s, then settles back to "Step 2 of 5". The next question is already on screen.

- Most subtle, almost game-like
- Loses the longer industry-specific copy though
- Best paired with Option A's toast for the longer messages

### Option C — Slide-in side card + subtle haptic
The next question loads, and a small card slides in from the bottom-right corner with the affirmation copy and a checkmark. Auto-dismisses after 3s, can be dismissed manually. Doesn't block anything.

- Familiar pattern (toast notifications)
- Slight risk of being ignored if user is reading the question
- More chrome than Option A

## My recommendation: Option A + Option B combined

- **Inline toast** carries the contextual affirmation copy ("Hospitality — one of the most transferable skill bases…")
- **Progress dot micro-burst** provides the kinetic "yes, that registered" feedback at the moment of click
- **Headline personalization** — the next question's headline uses the firstName once, naturally ("Nice one, Sarah — what do you actually do at work?") instead of forcing a separate screen for it

Result: zero blocking screens, momentum preserved, celebration feels woven into the flow rather than bolted on.

## Implementation sketch

**Files to touch:**
- `src/pages/FunnelQuiz.tsx` — remove the `affirmation` overlay; replace `showAffirmation(msg, next)` with a new `celebrate(msg, next)` that calls `next()` immediately AND queues `msg` into a small inline toast state shown on the next phase. Also fire the dot-burst.
- `src/components/funnel/SegmentedProgress.tsx` — add a `pulseIndex` prop; when set, the matching dot plays a short sparkle/scale burst (CSS keyframes).
- `src/components/funnel/InlineAffirmation.tsx` (new) — small pill rendered above each step's `<h1>`. Auto-fades in/out. Accepts `message` prop; renders nothing when empty.
- `src/components/funnel/AffirmationScreen.tsx` — keep the file but stop using it (or delete; recommend delete to reduce surface area).

**Behavioral details:**
- Toast pill: rounded full, `bg-primary/10 text-primary`, with a small ✓ icon, `animate-fade-in` on mount, auto-dismisses at 3s with `animate-fade-out`.
- Dot burst: 3-4 small dots scaling outward from the just-completed dot, ~600ms, primary color at 50% opacity. Pure CSS.
- Headline personalization (one-time): on the activities step only, prepend "Nice one, {firstName} — " when firstName exists. Avoids overusing the name.
- After Q0 (name), instead of a full-screen "Lovely, Sarah…", we go straight to the path step with the toast "✓ Lovely to meet you, Sarah." above the headline.
- Skip button + tap-to-skip become unnecessary — nothing to skip.

**What we keep:**
- All the existing affirmation copy strings (industry-specific, etc.) — they're good writing, just delivered differently.
- Final celebration screen is unchanged (it's the legit reward, not a transition).

**What we remove:**
- `AffirmationScreen` full-screen overlay component usage
- The 2.2s blocking wait between every step
- `affirmation` state in FunnelQuiz

