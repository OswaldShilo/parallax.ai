export default function Page() {
  return (
    <main className="relative min-h-screen pl-6 md:pl-28 pr-6 md:pr-12 py-24">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Mode / Direct Chat</span>
        <h1 className="mt-4 font-[var(--font-bebas)] text-6xl md:text-8xl tracking-tight leading-none">SINGLE-MODEL STUDIES</h1>

        <p className="mt-10 font-mono text-sm text-muted-foreground leading-relaxed">
          Direct Chat is designed for interactive evaluation sessions: a user chats with one model and provides structured feedback that can
          be analyzed across tasks, prompts, and time.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border/40 p-6">
            <h2 className="font-[var(--font-bebas)] text-3xl tracking-tight">Task framing</h2>
            <p className="mt-3 font-mono text-xs text-muted-foreground leading-relaxed">
              Define rubrics and success criteria that map to your research question.
            </p>
          </div>
          <div className="border border-border/40 p-6">
            <h2 className="font-[var(--font-bebas)] text-3xl tracking-tight">Outcome capture</h2>
            <p className="mt-3 font-mono text-xs text-muted-foreground leading-relaxed">
              Collect preferences, ratings, and qualitative notes alongside the conversation.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-8">
          <a
            href="/#signals"
            className="inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
          >
            Back to Modes
          </a>
          <a
            href="/side-by-side"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Compare Side-by-side
          </a>
        </div>
      </div>
    </main>
  )
}
