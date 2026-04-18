

## The problem

Current hero has 4 competing elements fighting for attention:
1. Headline + subhead
2. Primary CTA + secondary link
3. **Industry tile grid (10 tiles)** — visually dense
4. **Animated ticker** (right column) — motion grabs the eye

Plus testimonials, How It Works, Trustpilot below. The eye doesn't know where to land. Monster (and Indeed, LinkedIn) keep the hero to: headline + one input + maybe a few popular chips. That clarity is what makes them feel "trustworthy and serious."

But we shouldn't go fully plain — our differentiator IS that we're skill-based, not title-based. The ticker proves that ("Barista → Customer Success Manager"). Killing it loses our story.

So the question is: **what to cut, what to demote, what to keep front-and-center.**

## Three directions to choose from

### Option A — Monster-style minimal (most aggressive cut)
- Headline + subhead
- One big "Start the quiz" button + "Search directly" link
- Below: 6 popular skill chips ("Customer service", "Writing", "Project management"…) as quick-start
- **Remove**: industry grid, ticker animation entirely
- Move ticker into How It Works section as proof
- Move industry grid into the quiz only (Step 1)

Pro: cleanest, most familiar pattern. Con: loses our "live product" feel above the fold.

### Option B — Single hero focus + ticker as proof strip (recommended)
- Headline + subhead + **one** primary CTA ("Start the quiz · 2 min")
- "Search directly" as small link below
- **Remove industry grid from hero** (it duplicates Step 1 of the quiz; users feel forced to commit twice)
- **Keep ticker** but slim it: shorter (3 visible rows instead of 5), full width below the CTA as a thin "live proof" strip — "Real matches happening now" with the rotating roles
- Testimonials stay below

Pro: keeps our differentiator visible, cuts ~half the visual weight, single clear action.
Con: ticker as horizontal strip needs a redesign.

### Option C — Two-column but quiet the right side
- Keep current structure
- **Remove the industry grid** from the left column (biggest density offender)
- Keep ticker on the right but make it smaller and less animated (slower, more muted colors, no "Just matched" sparkle)
- Left becomes: headline, subhead, CTA, secondary link — that's it

Pro: minimal change, preserves layout. Con: still two competing zones, just quieter.

## My recommendation

**Option B.** The industry grid on the homepage is the single biggest source of noise — it's 10 tiles of color and copy that essentially duplicate Step 1 of the quiz. Removing it makes the CTA the unambiguous next step. The ticker stays (it's our proof) but reformatted as a horizontal strip so it reads as "social proof" not "second product surface."

## Questions before I build

I want to confirm the direction and a couple of details.
<lov-plan>

<questions--ask_questions><lov-plan>

## The problem

Current hero stacks 4 competing elements:
1. Headline + subhead
2. Primary CTA + secondary link
3. **Industry tile grid (10 colored tiles)** — visually dense, duplicates Step 1 of the quiz
4. **Animated ticker** (right column) — motion grabs the eye

Plus testimonials, How It Works, and Trustpilot below. The eye doesn't know where to land. Monster, Indeed, LinkedIn keep their hero to: headline + one input + a few popular chips. That clarity reads as "trustworthy and serious."

But going fully plain costs us our differentiator — the ticker proves we're skill-based ("Barista → Customer Success Manager"). Killing it loses the story.

## Three directions

### Option A — Monster-style minimal (most aggressive)
- Headline + subhead
- Big "Start the quiz" button + small "Search directly" link
- 6 popular skill chips below ("Customer service", "Writing", "Project management"…) as quick-start
- **Remove** industry grid AND ticker from hero
- Move ticker into How It Works as proof
- Industry grid lives only inside the quiz Step 1

Pro: cleanest, most familiar. Con: loses live-product feel above the fold.

### Option B — Single hero focus + ticker as proof strip (recommended)
- Headline + subhead + **one** primary CTA ("Start the quiz · 2 min · Free")
- "Already know your skills? Search directly →" as small link below
- **Remove industry grid from hero** — biggest noise offender, duplicates quiz Step 1
- **Keep ticker** but reformat as a slim horizontal "Real matches happening now" strip below the CTA (3 visible rows, full width, single line each)
- Testimonials, How It Works, Trustpilot stay below

Pro: keeps our differentiator visible, cuts ~half the visual weight, single clear action.
Con: ticker needs a horizontal redesign.

### Option C — Quiet the existing layout
- Keep two-column structure
- **Remove the industry grid** from the left column (biggest density offender)
- Keep ticker on the right but slow it down, mute colors, drop the "Just matched" sparkle
- Left becomes: headline, subhead, CTA, secondary link only

Pro: minimal change. Con: still two competing zones.

## My recommendation: Option B

The industry grid is the single biggest source of noise — 10 colored tiles essentially duplicating Step 1 of the quiz, asking users to commit before they've understood the value. Removing it makes the CTA unambiguous. The ticker survives as a thin proof strip, not a second product surface.

## What I'd change in code (Option B)

- `src/components/HeroSearch.tsx`: delete the embedded industry tile grid block; tighten the CTA stack; render `HeroDemo` full-width below the CTA instead of as a right column.
- `src/components/HeroDemo.tsx`: convert from vertical 420px tall ticker to a horizontal slim strip (~140px tall), 3 rows visible, full-width centered, edge fades on the sides if we go horizontal — or keep vertical but shorten to ~200px.
- `src/pages/Index.tsx`: layout becomes single-column, centered, narrower max-width — feels closer to Monster/Indeed restraint.
- Industry deep-linking still works via the quiz itself; we don't lose any functionality.

<questions--ask_questions>
[Direction + ticker format, asked after plan approval]
</questions--ask_questions>

