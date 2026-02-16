import { HeroSection } from "@/components/hero-section"
import { SignalsSection } from "@/components/signals-section"
import { WorkSection } from "@/components/work-section"
import { PrinciplesSection } from "@/components/principles-section"
import { ColophonSection } from "@/components/colophon-section"
import { SideNav } from "@/components/side-nav"

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <SideNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <HeroSection />
        <section className="relative py-12 pl-6 md:pl-28 pr-6 md:pr-12">
          <div className="flex flex-wrap gap-4">
            <a
              href="/battle"
              className="border border-border/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors duration-200"
            >
              Open Battle
            </a>
            <a
              href="/direct"
              className="border border-border/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors duration-200"
            >
              Open Direct Chat
            </a>
            <a
              href="/side-by-side"
              className="border border-border/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors duration-200"
            >
              Open Side-by-side
            </a>
            <a
              href="/rankings"
              className="border border-border/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors duration-200"
            >
              View Rankings
            </a>
          </div>
        </section>
        <SignalsSection />
        <WorkSection />
        <PrinciplesSection />
        <ColophonSection />
      </div>
    </main>
  )
}
