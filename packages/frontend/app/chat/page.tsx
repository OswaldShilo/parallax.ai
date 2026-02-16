"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type ChatMode = "direct" | "side_by_side" | "blind"

type DirectMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: number
}

type PairTurn = {
  id: string
  user: { content: string; createdAt: number }
  a: { content: string; createdAt: number }
  b: { content: string; createdAt: number }
  picked?: "A" | "B"
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function Page() {
  const [mode, setMode] = useState<ChatMode>("direct")
  const [input, setInput] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>(() => [
    {
      id: "seed-1",
      role: "assistant",
      content:
        "Direct Chat (local demo). Connect this to your backend to run interactive studies and record structured outcomes.",
      createdAt: Date.now(),
    },
  ])

  const [pairTurns, setPairTurns] = useState<PairTurn[]>(() => [
    {
      id: "seed-pair-1",
      user: { content: "Give me a concise explanation of preference-based evaluation.", createdAt: Date.now() },
      a: {
        content:
          "Model A: Preference-based evaluation uses human (or proxy) choices between outputs to estimate which system better matches user intent.",
        createdAt: Date.now(),
      },
      b: {
        content:
          "Model B: It measures quality by collecting pairwise judgments, then aggregating them into rankings or calibrated scores under a protocol.",
        createdAt: Date.now(),
      },
    },
  ])

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const canSend = useMemo(() => input.trim().length > 0 && !isReplying, [input, isReplying])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [directMessages.length, pairTurns.length, mode])

  const resetInputFocus = () => requestAnimationFrame(() => inputRef.current?.focus())

  const send = async () => {
    const content = input.trim()
    if (!content || isReplying) return

    setInput("")
    setIsReplying(true)

    const now = Date.now()

    if (mode === "direct") {
      setDirectMessages((prev) => [
        ...prev,
        {
          id: `u-${now}`,
          role: "user",
          content,
          createdAt: now,
        },
      ])

      await new Promise((r) => setTimeout(r, 450))

      const replyAt = Date.now()
      setDirectMessages((prev) => [
        ...prev,
        {
          id: `a-${replyAt}`,
          role: "assistant",
          content:
            "(Placeholder response)\n\nWire this to your model gateway and log: prompt_id, policy_id, model_id, transcript, and evaluator outcomes.",
          createdAt: replyAt,
        },
      ])
      setIsReplying(false)
      resetInputFocus()
      return
    }

    setPairTurns((prev) => [
      ...prev,
      {
        id: `t-${now}`,
        user: { content, createdAt: now },
        a: { content: "…", createdAt: now },
        b: { content: "…", createdAt: now },
      },
    ])

    await new Promise((r) => setTimeout(r, 500))

    const replyAt = Date.now()
    setPairTurns((prev) => {
      const next = [...prev]
      const last = next[next.length - 1]
      if (!last) return prev

      const aLabel = mode === "blind" ? "A" : "Model A"
      const bLabel = mode === "blind" ? "B" : "Model B"

      last.a = {
        content: `${aLabel}: (Placeholder response)\n\nConnect this panel to a selectable model id.`,
        createdAt: replyAt,
      }
      last.b = {
        content: `${bLabel}: (Placeholder response)\n\nSide-by-side is best for controlled comparisons and ablations.`,
        createdAt: replyAt,
      }
      return next
    })

    setIsReplying(false)
    resetInputFocus()
  }

  const pickBlindWinner = (turnId: string, picked: "A" | "B") => {
    setPairTurns((prev) => prev.map((t) => (t.id === turnId ? { ...t, picked } : t)))
  }

  const modeMeta = useMemo(() => {
    if (mode === "direct") {
      return {
        label: "Direct Chat",
        tagline: "Single-model transcript with structured outcomes.",
      }
    }
    if (mode === "side_by_side") {
      return {
        label: "Side-by-side Chat",
        tagline: "Two explicit models in parallel for controlled comparison.",
      }
    }
    return {
      label: "Blind Chat",
      tagline: "Anonymous A/B responses with preference selection.",
    }
  }, [mode])

  return (
    <main className="relative min-h-screen pl-6 md:pl-28 pr-6 md:pr-12 py-20">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Mode / {modeMeta.label}</span>
            <h1 className="mt-4 font-[var(--font-bebas)] text-6xl md:text-8xl tracking-tight leading-none">CHAT INTERFACE</h1>
            <p className="mt-6 max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed">
              {modeMeta.tagline} Keep prompts versioned, capture context windows, and record structured outcomes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/direct"
              className="border border-border/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors duration-200"
            >
              Read Mode
            </a>
            <a
              href="/"
              className="border border-border/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors duration-200"
            >
              Home
            </a>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-6">
          <aside className="border border-border/40 bg-card/20 backdrop-blur-sm">
            <div className="border-b border-border/30 px-6 py-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Chat Modes</div>
            </div>
            <div className="px-6 py-6 space-y-3">
              <ModeButton label="Direct Chat" active={mode === "direct"} onClick={() => setMode("direct")} />
              <ModeButton label="Side-by-side Chat" active={mode === "side_by_side"} onClick={() => setMode("side_by_side")} />
              <ModeButton label="Blind Chat" active={mode === "blind"} onClick={() => setMode("blind")} />

              <div className="pt-6 border-t border-border/30">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Protocol hint</div>
                <p className="mt-3 font-mono text-xs text-muted-foreground leading-relaxed">
                  Blind Chat should hide model identity and require a preference pick (A/B) to produce clean pairwise signals.
                </p>
              </div>
            </div>
          </aside>

          <section className="border border-border/40 bg-card/40 backdrop-blur-sm">
            <div className="border-b border-border/30 px-6 py-4 flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Transcript</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {isReplying ? "Generating" : "Idle"}
              </div>
            </div>

            <div ref={listRef} className="h-[52vh] md:h-[60vh] overflow-y-auto px-6 py-6 space-y-5">
              {mode === "direct" ? (
                directMessages.map((m) => (
                  <article
                    key={m.id}
                    className={cn(
                      "border border-border/40 p-4 md:p-5",
                      m.role === "assistant" ? "bg-background/30" : "bg-accent/5 border-accent/30",
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-6">
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        {m.role === "assistant" ? "Model" : "User"}
                      </div>
                      <time className="font-mono text-[10px] text-muted-foreground/60">{formatTime(m.createdAt)}</time>
                    </div>

                    <pre className="mt-3 whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-foreground/90">
                      {m.content}
                    </pre>
                  </article>
                ))
              ) : (
                pairTurns.map((t) => (
                  <article key={t.id} className="space-y-4">
                    <div className={cn("border border-border/40 p-4 md:p-5", "bg-accent/5 border-accent/30")}>
                      <div className="flex items-baseline justify-between gap-6">
                        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">User</div>
                        <time className="font-mono text-[10px] text-muted-foreground/60">{formatTime(t.user.createdAt)}</time>
                      </div>
                      <pre className="mt-3 whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-foreground/90">
                        {t.user.content}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-border/40 p-4 md:p-5 bg-background/30">
                        <div className="flex items-baseline justify-between gap-6">
                          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            {mode === "blind" ? "Response A" : "Model A"}
                          </div>
                          <time className="font-mono text-[10px] text-muted-foreground/60">{formatTime(t.a.createdAt)}</time>
                        </div>
                        <pre className="mt-3 whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-foreground/90">
                          {t.a.content}
                        </pre>
                      </div>

                      <div className="border border-border/40 p-4 md:p-5 bg-background/30">
                        <div className="flex items-baseline justify-between gap-6">
                          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                            {mode === "blind" ? "Response B" : "Model B"}
                          </div>
                          <time className="font-mono text-[10px] text-muted-foreground/60">{formatTime(t.b.createdAt)}</time>
                        </div>
                        <pre className="mt-3 whitespace-pre-wrap font-mono text-xs md:text-sm leading-relaxed text-foreground/90">
                          {t.b.content}
                        </pre>
                      </div>
                    </div>

                    {mode === "blind" ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Pick winner</span>
                        <button
                          type="button"
                          onClick={() => pickBlindWinner(t.id, "A")}
                          className={cn(
                            "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-200",
                            t.picked === "A"
                              ? "border-accent/60 text-accent"
                              : "border-border/40 text-muted-foreground hover:text-accent hover:border-accent/60",
                          )}
                        >
                          A
                        </button>
                        <button
                          type="button"
                          onClick={() => pickBlindWinner(t.id, "B")}
                          className={cn(
                            "border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-200",
                            t.picked === "B"
                              ? "border-accent/60 text-accent"
                              : "border-border/40 text-muted-foreground hover:text-accent hover:border-accent/60",
                          )}
                        >
                          B
                        </button>
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {t.picked ? `Recorded: ${t.picked}` : "Unselected"}
                        </span>
                      </div>
                    ) : null}
                  </article>
                ))
              )}
            </div>

            <div className="border-t border-border/30 px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Message</label>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault()
                        void send()
                      }
                    }}
                    placeholder="Type a message. Ctrl+Enter to send."
                    className="mt-3 w-full min-h-[90px] resize-none bg-background/40 border border-border/40 px-4 py-3 font-mono text-xs md:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-accent/60"
                  />
                  <div className="mt-2 font-mono text-[10px] text-muted-foreground/60">
                    For studies: log prompt_id, policy_id, model_ids, transcript, and preference picks.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={!canSend}
                  className={cn(
                    "border px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-200",
                    canSend
                      ? "border-foreground/20 text-foreground hover:border-accent hover:text-accent"
                      : "border-border/30 text-muted-foreground/50 cursor-not-allowed",
                  )}
                >
                  {isReplying ? "Sending" : "Send"}
                </button>
              </div>
            </div>
          </section>

          <aside className="border border-border/40 bg-card/20 backdrop-blur-sm">
            <div className="border-b border-border/30 px-6 py-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Study Notes</div>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div>
                <div className="font-[var(--font-bebas)] text-3xl tracking-tight">Capture</div>
                <p className="mt-2 font-mono text-xs text-muted-foreground leading-relaxed">
                  Store full transcripts with versioned prompts and evaluation policies.
                </p>
              </div>
              <div>
                <div className="font-[var(--font-bebas)] text-3xl tracking-tight">Judge</div>
                <p className="mt-2 font-mono text-xs text-muted-foreground leading-relaxed">
                  Add lightweight rubrics (helpfulness, correctness, style) and collect structured feedback.
                </p>
              </div>
              <div>
                <div className="font-[var(--font-bebas)] text-3xl tracking-tight">Publish</div>
                <p className="mt-2 font-mono text-xs text-muted-foreground leading-relaxed">
                  Aggregate outcomes into rankings with transparent sampling assumptions.
                </p>
              </div>

              <div className="border-t border-border/30 pt-6">
                <a
                  href="/rankings"
                  className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  View Rankings
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function ModeButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-200",
        active
          ? "border-accent/60 text-accent bg-accent/5"
          : "border-border/40 text-muted-foreground hover:text-accent hover:border-accent/60",
      )}
    >
      {label}
    </button>
  )
}
