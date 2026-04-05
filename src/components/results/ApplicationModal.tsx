import { useState, useRef, useCallback } from "react";
import { X, Upload, CheckCircle2, Sparkles, FileText, Plus } from "lucide-react";
import type { Job } from "@/data/jobs";
import type { ScoredPosting } from "@/lib/quizScoring";

interface ApplicationModalProps {
  job: Job;
  scored: ScoredPosting | null;
  querySkills: string[];
  onClose: () => void;
}

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  availability: string;
  linkedin: string;
  coverNote: string;
  cvFile: File | null;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  experience: "",
  availability: "",
  linkedin: "",
  coverNote: "",
  cvFile: null,
};

export function ApplicationModal({ job, scored, querySkills, onClose }: ApplicationModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initial = job.company.charAt(0).toUpperCase();

  const matchedSkills = scored
    ? scored.matchedSkills
    : job.skills.filter((s) => querySkills.some((q) => s.toLowerCase().includes(q)));
  const gapSkills = scored
    ? scored.gapSkills
    : job.skills.filter((s) => !querySkills.some((q) => s.toLowerCase().includes(q)));
  const matchPercent = scored
    ? scored.matchScore
    : Math.round((matchedSkills.length / job.skills.length) * 100);

  const canSubmit = form.fullName.trim() && form.email.trim() && form.cvFile;

  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext || "")) return;
    if (file.size > 5 * 1024 * 1024) return;
    setForm((prev) => ({ ...prev, cvFile: file }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-10 text-center animate-scale-in">
          <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Application submitted!</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Your application for <span className="font-semibold text-foreground">{job.title}</span> at{" "}
            <span className="font-semibold text-foreground">{job.company}</span> has been sent. Good luck!
          </p>
          <button
            onClick={onClose}
            className="h-11 px-8 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
          >
            View more matching roles →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-md"
      >
        <X className="h-4 w-4 text-foreground" />
      </button>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header gradient strip */}
        <div className="h-[180px] md:h-[180px] h-[100px] bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-60" />
        </div>

        {/* Form card */}
        <div className="max-w-[640px] mx-auto px-4 md:px-6 -mt-24 pb-10 relative">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-10">
            {/* Job context */}
            <div className="flex items-center gap-3.5 mb-5">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-foreground truncate">{job.title}</h2>
                <p className="text-[13px] text-muted-foreground truncate">
                  {job.company} · {job.location}
                </p>
              </div>
            </div>
            <hr className="border-[#F0F0EC] mb-6" />

            {/* Your details */}
            <h3 className="text-sm font-medium text-foreground mb-4">Your details</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className="w-full h-11 rounded-lg border border-[#E0E0D8] bg-background px-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full h-11 rounded-lg border border-[#E0E0D8] bg-background px-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full h-11 rounded-lg border border-[#E0E0D8] bg-background px-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              <input
                type="text"
                placeholder="City, Country"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                className="w-full h-11 rounded-lg border border-[#E0E0D8] bg-background px-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>

            <hr className="border-[#F0F0EC] my-6" />

            {/* Your experience */}
            <h3 className="text-sm font-medium text-foreground mb-4">Your experience</h3>
            <div className="space-y-3">
              <div className="relative">
                <select
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                  className="w-full h-11 rounded-lg border border-[#E0E0D8] bg-background px-3.5 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                >
                  <option value="" disabled>Years of experience in this field</option>
                  <option value="<1">Less than 1 year</option>
                  <option value="1-2">1–2 years</option>
                  <option value="3-5">3–5 years</option>
                  <option value="5-10">5–10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div className="relative">
                <select
                  value={form.availability}
                  onChange={(e) => update("availability", e.target.value)}
                  className="w-full h-11 rounded-lg border border-[#E0E0D8] bg-background px-3.5 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                >
                  <option value="" disabled>Availability to start</option>
                  <option value="immediately">Immediately</option>
                  <option value="2weeks">Within 2 weeks</option>
                  <option value="1month">Within 1 month</option>
                  <option value="3months">Within 3 months</option>
                  <option value="open">Open to discussion</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <hr className="border-[#F0F0EC] my-6" />

            {/* Your CV */}
            <h3 className="text-sm font-medium text-foreground mb-4">Your CV</h3>

            {!form.cvFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  dragOver ? "border-primary bg-primary/5" : "border-[#D0D0C8] hover:border-primary/40"
                }`}
              >
                <Upload className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-foreground font-medium">Drag your CV here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX or TXT · Max 5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E0E0D8] bg-[#F8F8F6]">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">{form.cvFile.name}</span>
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <button
                  onClick={() => setForm((prev) => ({ ...prev, cvFile: null }))}
                  className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-[#E8E8E4] transition-colors shrink-0"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            )}

            <div className="mt-3">
              <input
                type="url"
                placeholder="https://linkedin.com/in/yourname"
                value={form.linkedin}
                onChange={(e) => update("linkedin", e.target.value)}
                className="w-full h-11 rounded-lg border border-[#E0E0D8] bg-background px-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>

            <hr className="border-[#F0F0EC] my-6" />

            {/* Cover note */}
            <textarea
              placeholder="Add a short note to the employer (optional) — what makes you a great fit for this role?"
              value={form.coverNote}
              onChange={(e) => update("coverNote", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#E0E0D8] bg-background px-3.5 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
            />

            {/* Skill match summary */}
            {matchPercent > 0 && (
              <div className="mt-6 rounded-lg bg-[#E8F7F2] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Matched by Skilljob
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-[13px] font-semibold text-foreground">
                    Your skill match for this role:{" "}
                    <span className="text-primary">{matchPercent}%</span>
                  </span>
                </div>
                {matchedSkills.length > 0 && (
                  <p className="text-[13px] text-muted-foreground">
                    <span className="text-foreground/70">You have:</span>{" "}
                    {matchedSkills.join(" · ")}
                  </p>
                )}
                {gapSkills.length > 0 && (
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    <span className="text-foreground/70">You're missing:</span>{" "}
                    {gapSkills.join(" · ")}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="mt-6 w-full h-12 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit application →
            </button>

            <p className="text-center text-xs text-muted-foreground mt-3 leading-relaxed">
              By applying you agree to share your details with the employer.
              <br />
              Skilljob does not store your CV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
