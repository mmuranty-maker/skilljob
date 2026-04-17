const TESTIMONIALS = [
  {
    quote: "Found 7 roles I'd never have searched for.",
    name: "Priya",
    role: "Operations Lead",
    initial: "P",
    bg: "hsl(212, 80%, 92%)",
    fg: "hsl(212, 70%, 38%)",
  },
  {
    quote: "Turns out my hospitality experience qualifies me for way more than I thought.",
    name: "Tom",
    role: "Former barista",
    initial: "T",
    bg: "hsl(28, 90%, 92%)",
    fg: "hsl(28, 80%, 38%)",
  },
  {
    quote: "Skilljob reads between the lines of your experience.",
    name: "Sarah",
    role: "Customer Success",
    initial: "S",
    bg: "hsl(272, 70%, 93%)",
    fg: "hsl(272, 55%, 42%)",
  },
];

export function Testimonials() {
  return (
    <section className="py-14 px-4 md:px-8 lg:px-16 bg-background border-t border-border">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-primary mb-8">
          People love what they find
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all"
            >
              <blockquote className="text-base text-foreground leading-relaxed font-medium">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: t.bg, color: t.fg }}
                  aria-hidden
                >
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
