import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Users,
  Share2,
  ShieldCheck,
  Zap,
  Layout,
  ArrowRight,
  MousePointer2,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans selection:bg-indigo-100 bg-background text-foreground relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-50/50 via-background to-background" />
      <div
        className="fixed inset-0 -z-10 opacity-[0.03] "
        style={{
          backgroundImage: `radial-gradient(var(--brand) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div
              className="w-9 h-9 flex items-center justify-center sketch-border transition-transform group-hover:rotate-6 bg-brand border-brand text-white"
            >
              <Pencil className="w-5 h-5 transform -rotate-12" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              sketch.io
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <Link
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#templates"
              className="hover:text-foreground transition-colors"
            >
              Templates
            </Link>
            <Link
              href="#pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex gap-2 font-bold text-muted-foreground hover:text-foreground"
            >
              <Link href="/sign-in" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Log in
              </Link>
            </Button>
            <Button
              size="sm"
              className="sketch-border flex gap-2 font-bold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 bg-brand border-brand text-white"
            >
              <Link href="/sign-up" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full mb-10 border border-border shadow-sm">
            <Badge
              variant="secondary"
              className="border-none text-[10px] uppercase tracking-wider font-black px-2 py-0.5 bg-brand text-white"
            >
              Stable
            </Badge>
            <span className="text-sm font-medium">
              Infinite Sketch 2.0 is here
            </span>
            <ArrowRight className="w-3 h-3" />
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 max-w-6xl mx-auto leading-[0.8] text-balance">
            Sketch your{" "}
            <span className="italic font-serif text-brand">
              wildest
            </span>{" "}
            ideas.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed font-semibold">
            A collaborative whiteboard that feels as organic as pencil and
            paper. Zero friction, total privacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
            <Button
              size="lg"
              className="h-16 px-12 text-xl sketch-border shadow-xl transition-all hover:scale-105 active:scale-95 font-bold bg-brand border-brand text-white"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-12 text-xl sketch-border bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all font-bold border-border"
            >
              Try Sandbox
            </Button>
          </div>

          {/* Canvas Preview Area */}
          <div className="relative max-w-6xl mx-auto group">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            <div className="relative aspect-video bg-white border-2 border-border/80 rounded-2xl overflow-hidden shadow-2xl">
              {/* Fake UI Elements */}
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                {[
                  { id: 1, icon: MousePointer2 },
                  { id: 2, icon: Pencil, active: true },
                  { id: 3, icon: Layout },
                  { id: 4, icon: Users },
                  { id: 5, icon: Share2 },
                ].map((tool) => (
                  <div
                    key={tool.id}
                    className={`w-12 h-12 bg-white border-2 sketch-border flex items-center justify-center transition-all cursor-pointer ${tool.active ? "shadow-lg -translate-y-0.5 bg-brand border-brand text-white" : "border-border text-muted-foreground hover:bg-zinc-50 hover:text-foreground"}`}
                  >
                    {React.createElement(tool.icon, { className: "w-6 h-6" })}
                  </div>
                ))}
              </div>

              {/* Central Sketch Simulation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                <div className="relative w-full h-full p-20 flex items-center justify-center">
                  <div
                    className="w-80 h-56 sketch-border border-4 flex flex-col items-center justify-center rotate-2 bg-white shadow-xl border-brand"
                  >
                    <span
                      className="font-mono text-3xl font-bold text-brand"
                    >
                      MVP FLOW
                    </span>
                    <div
                      className="w-48 h-1 mt-6 rounded-full bg-brand/40"
                    />
                    <div
                      className="w-32 h-1 mt-2 rounded-full opacity-50 bg-brand/20"
                    />
                  </div>
                  <div
                    className="absolute top-1/4 right-1/4 w-32 h-32 sketch-border border-4 rounded-full -rotate-12 opacity-30 border-brand"
                  />
                </div>
              </div>

              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-5 py-3 rounded-xl border-2 border-border sketch-border flex items-center gap-4 shadow-xl">
              <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `var(--chart-${i})` }}
                    />
                  ))}
                </div>
                <span className="text-sm font-black text-muted-foreground">
                  Editing Live
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 mt-48">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black tracking-tight mb-6">
              Everything you need to ship ideas
            </h2>
            <p className="text-muted-foreground/80 max-w-xl mx-auto font-medium text-lg leading-relaxed">
              Minimal by design, powerful in execution. No bloat, just the tools
              you love.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Users className="w-6 h-6 text-brand" />}
              title="Real-time Collaboration"
              description="Invite your team and watch as ideas come to life together in real-time."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-brand" />}
              title="Privacy-First"
              description="E2E encrypted by default. We never see your data, it stays in your browser."
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6 text-brand" />}
              title="Instant Export"
              description="PNG, SVG, or share a live link. Your work is accessible everywhere."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-brand" />}
              title="Hand-drawn Feel"
              description="The sketchy look keeps ideas low-fidelity so you can focus on the big picture."
            />
            <FeatureCard
              icon={<Layout className="w-6 h-6 text-brand" />}
              title="Infinite Sketch"
              description="Never run out of space. Your brain doesn't have boundaries, why should your whiteboard?"
            />
            <FeatureCard
              icon={<ArrowRight className="w-6 h-6 text-brand" />}
              title="Open Source"
              description="Built for the community, by the community. Always free, always open."
            />
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-4 mt-40">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Everything you need to ship ideas
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Minimal by design, powerful in execution. No bloat, just the tools
              you love.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Users className="w-6 h-6 text-blue-500" />}
              title="Real-time Collaboration"
              description="Invite your team and watch as ideas come to life together in real-time."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-green-500" />}
              title="Privacy-First"
              description="E2E encrypted by default. We never see your data, it stays in your browser."
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6 text-purple-500" />}
              title="Instant Export"
              description="PNG, SVG, or share a live link. Your work is accessible everywhere."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-500" />}
              title="Hand-drawn Feel"
              description="The sketchy look keeps ideas low-fidelity so you can focus on the big picture."
            />
            <FeatureCard
              icon={<Layout className="w-6 h-6 text-orange-500" />}
              title="Infinite Sketch"
              description="Never run out of space. Your brain doesn't have boundaries, why should your whiteboard?"
            />
            <FeatureCard
              icon={<ArrowRight className="w-6 h-6 text-pink-500" />}
              title="Open Source"
              description="Built for the community, by the community. Always free, always open."
            />
          </div>
        </section>

        {/* Social Proof */}
        <section className="container mx-auto px-4 mt-40 border-t pt-20">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-12">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale">
            <span className="text-2xl font-black">Vercel</span>
            <span className="text-2xl font-black">Meta</span>
            <span className="text-2xl font-black">Adobe</span>
            <span className="text-2xl font-black">Figma</span>
            <span className="text-2xl font-black">Airbnb</span>
          </div>
        </section>
      </main>

      <footer className="border-t py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded flex items-center justify-center sketch-border bg-brand border-brand text-white"
            >
              <Pencil className="w-4 h-4 transform -rotate-12" />
            </div>
            <span className="font-black text-xl">sketch.io</span>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              GitHub
            </Link>
            <Link href="#" className="hover:text-foreground">
              X (Twitter)
            </Link>
          </div>

          <p className="text-sm font-bold text-muted-foreground">
            © 2026 sketch.io Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color?: string
}) {
  return (
    <div className="p-10 rounded-[2.5rem] border border-border/50 bg-white/50 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 sketch-border transition-transform group-hover:rotate-6"
        style={{
          color: color,
          borderColor: color ? `${color}40` : "black",
          backgroundColor: color ? `${color}10` : "white",
        }}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground/80 leading-relaxed font-medium">{description}</p>
    </div>
  )
}

