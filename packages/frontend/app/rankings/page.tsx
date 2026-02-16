export default function Page() {
  return (
    <main className="relative min-h-screen pl-6 md:pl-28 pr-6 md:pr-12 py-24">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">02 / Rankings</span>
        <h1 className="mt-4 font-[var(--font-bebas)] text-6xl md:text-8xl tracking-tight leading-none">PUBLIC LEADERBOARDS</h1>

        <p className="mt-10 font-mono text-sm text-muted-foreground leading-relaxed">
          Parallax.ai aggregates human judgments into public rankings. The goal is not to maximize a single benchmark score, but to provide
          a fair, reproducible instrument for tracking model performance under clearly defined evaluation protocols.
        </p>

        <div className="mt-12 border border-border/40 p-6">
          <h2 className="font-[var(--font-bebas)] text-3xl tracking-tight">What you can publish</h2>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="font-mono text-xs text-muted-foreground">Pairwise win-rates</div>
            <div className="font-mono text-xs text-muted-foreground">Task-specific rankings</div>
            <div className="font-mono text-xs text-muted-foreground">Sampling & dataset versions</div>
            <div className="font-mono text-xs text-muted-foreground">Evaluation policy versions</div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-8">
          <a
            href="/#work"
            className="inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
          >
            Back to Outcomes
          </a>
          <a
            href="/#principles"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Read Method
          </a>
        </div>
      </div>
    </main>
  )
}
