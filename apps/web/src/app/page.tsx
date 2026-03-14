import React from "react";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Users,
  Share2,
  Square,
  Type,
  Eraser,
  MousePointer2,
  LogIn,
  UserPlus,
  ZoomIn,
  Keyboard,
  Palette,
  Circle,
  Minus,
  Triangle,
  UserPlus2,
  LayoutDashboard,
  Lightbulb,
  Video,
  GraduationCap,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Gradient + grid background */}
      <div
        className="fixed inset-0 -z-10 bg-linear-to-b from-primary/5 via-background to-background"
        aria-hidden
      />
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--primary)/12%,transparent)]"
        aria-hidden
      />
      <div
        className="fixed inset-0 -z-10 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Pencil className="w-4 h-4" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight">Canvas</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm md:text-base font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#use-cases" className="hover:text-foreground transition-colors">
              Use cases
            </Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-sm md:text-base" asChild>
              <Link href="/sign-in" className="gap-2">
                <LogIn className="w-4 h-4" />
                Log in
              </Link>
            </Button>
            <Button className="text-sm md:text-base" asChild>
              <Link href="/sign-up" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — full viewport */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-24">
          <div className="mt-20 max-w-4xl mx-auto text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6">
              Collaborative whiteboard
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-[1.05] mb-8">
              Draw together{" "}
              <span className="bg-linear-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                in real time
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed">
              Create rooms, invite your team, and sketch with shapes, pencil, text, and more.
              Everything syncs instantly. Undo, zoom, and keyboard shortcuts included.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold" asChild>
                <Link href="/sign-up">Get started free</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-semibold" asChild>
                <Link href="/sign-in">Open dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Hero mockup — canvas preview */}
          <div className="relative w-full max-w-5xl mx-auto mt-16 md:mt-24">
            <div className="absolute -inset-8 rounded-3xl bg-linear-to-br from-primary/15 via-primary/5 to-transparent blur-3xl" />
            <div className="relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden ring-1 ring-primary/5">
              <div className="aspect-video min-h-[280px] bg-linear-to-b from-muted/40 to-muted/20 flex flex-col">
                {/* Fake toolbar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/95 backdrop-blur">
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1.5">
                    {[
                      { Icon: MousePointer2, label: "Select" },
                      { Icon: Square, label: "Rect" },
                      { Icon: Circle, label: "Ellipse" },
                      { Icon: Minus, label: "Line" },
                      { Icon: Triangle, label: "Triangle" },
                      { Icon: Pencil, label: "Draw", active: true },
                      { Icon: Eraser, label: "Eraser" },
                      { Icon: Type, label: "Text" },
                    ].map(({ Icon, label, active }) => (
                      <div
                        key={label}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Fake canvas with shapes */}
                <div className="flex-1 relative p-8">
                  <div className="absolute left-16 top-14 w-24 h-16 rounded border-2 border-foreground/20 bg-background/50" />
                  <div className="absolute left-48 top-20 w-20 h-20 rounded-full border-2 border-foreground/20 bg-background/50" />
                  <div className="absolute right-24 top-24 w-32 h-1 bg-foreground/20 rounded-full rotate-12" />
                  <div className="absolute left-1/2 top-32 -translate-x-1/2 px-3 py-1.5 rounded border border-foreground/20 bg-background/50 text-sm font-medium text-foreground/80">
                    Type here...
                  </div>
                  <div className="absolute bottom-8 right-12 flex items-center gap-2 rounded-lg border border-border bg-card/90 px-3 py-2 shadow-sm">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full border-2 border-background bg-primary/80"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative border-t border-border py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-muted/30 via-muted/10 to-background" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything you need to collaborate
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                A full-featured whiteboard with real-time sync, rooms, and theme-aware canvas.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto relative">
              <FeatureCard
                icon={<Users className="w-6 h-6" />}
                title="Real-time sync"
                description="Every shape, move, and delete is broadcast to everyone in the room. Join a room and draw together instantly."
              />
              <FeatureCard
                icon={<Share2 className="w-6 h-6" />}
                title="Rooms & sharing"
                description="Create rooms, share links, and see who's in the room. Canvas state is saved when the room is empty and restored on join."
              />
              <FeatureCard
                icon={<Square className="w-6 h-6" />}
                title="Shapes & tools"
                description="Rectangle, ellipse, line, triangle, freehand pencil, text, and eraser. Select and drag to move shapes."
              />
              <FeatureCard
                icon={<Keyboard className="w-6 h-6" />}
                title="Keyboard shortcuts"
                description="Undo (Ctrl+Z), redo (Ctrl+Y), cut/copy/paste, delete. Use keys 1–8 to switch tools without touching the mouse."
              />
              <FeatureCard
                icon={<ZoomIn className="w-6 h-6" />}
                title="Zoom & pan"
                description="Mouse wheel or trackpad to zoom in and out; zoom is centered on the cursor. All tools work correctly when zoomed."
              />
              <FeatureCard
                icon={<Palette className="w-6 h-6" />}
                title="Light & dark theme"
                description="Canvas colors follow your app theme. Toggle theme and the whiteboard updates to match."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-muted/5 to-muted/20" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                How it works
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Get your team on the same canvas in three simple steps.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 md:gap-10 lg:gap-20 max-w-4xl mx-auto">
              <StepCard
                step={1}
                icon={<UserPlus2 className="w-7 h-7" />}
                title="Sign up"
                description="Create a free account with your email. No credit card required."
              />
              <StepCard
                step={2}
                icon={<LayoutDashboard className="w-7 h-7" />}
                title="Create a room"
                description="From your dashboard, create a new room and copy the share link to invite others."
              />
              <StepCard
                step={3}
                icon={<Pencil className="w-7 h-7" />}
                title="Draw together"
                description="Everyone in the room sees the same canvas. Shapes, moves, and edits sync in real time."
              />
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-muted/20 via-muted/10 to-background" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Perfect for
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                From quick sketches to structured workshops — one canvas for every need.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <UseCaseCard
                icon={<Lightbulb className="w-6 h-6" />}
                title="Team brainstorming"
                description="Capture ideas as they flow. Shapes, text, and freehand in one shared space."
              />
              <UseCaseCard
                icon={<Video className="w-6 h-6" />}
                title="Remote meetings"
                description="Replace static slides with a live whiteboard everyone can edit."
              />
              <UseCaseCard
                icon={<GraduationCap className="w-6 h-6" />}
                title="Teaching & workshops"
                description="Explain concepts visually. Students can follow along or contribute."
              />
              <UseCaseCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Quick sketches"
                description="Wireframes, flowcharts, or doodles. Fast tools and keyboard shortcuts."
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-primary/5 to-muted/10" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Frequently asked questions
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Quick answers to common questions.
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              <FaqItem
                question="Do I need an account?"
                answer="Yes. Sign up once to create and join rooms. Your rooms and canvas state are tied to your account so you can return anytime."
              />
              <FaqItem
                question="Is it free?"
                answer="Yes. Create rooms, invite others, and use all drawing tools and real-time sync at no cost. No credit card required."
              />
              <FaqItem
                question="How does real-time sync work?"
                answer="When you add, move, or delete a shape, the change is sent over a WebSocket to everyone in the same room. Updates appear within a moment so you can truly draw together."
              />
              <FaqItem
                question="What happens when everyone leaves a room?"
                answer="When the last person leaves, the canvas state is saved to the server. The next time someone joins that room, the same shapes load automatically."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-24 md:py-32">
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-primary/5 to-primary/10" />
          <div className="container mx-auto px-4 text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to draw?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
              Sign up, create a room, and start sketching. No credit card required.
            </p>
            <Button size="lg" className="h-12 px-8 text-base font-semibold" asChild>
              <Link href="/sign-up">Get started free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-linear-to-b from-muted/10 to-muted/30">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-primary-foreground">
              <Pencil className="w-4 h-4" />
            </div>
            <span className="font-bold">Canvas</span>
          </Link>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="#use-cases" className="hover:text-foreground transition-colors">
              Use cases
            </Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link href="/sign-in" className="hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">
              Sign up
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Canvas
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm p-6 md:p-8 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 bg-linear-to-b from-card to-card/50">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br from-primary/15 to-primary/5 text-primary mb-5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold tracking-tight mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center">
      <div className="inline-flex w-14 h-14 rounded-xl items-center justify-center bg-primary/10 text-primary mb-5">
        {icon}
      </div>
      <span className="z-10 absolute lg:-top-25 lg:-left-12 -top-3 md:-left-6 md:-top-15  left-3 text-[5rem] md:text-[7rem] lg:text-[10rem] bg-clip-text bg-linear-to-tl from-primary/20 to-primary font-black text-muted-foreground/30">
        {step}
      </span>
      <h3 className="text-xl font-semibold tracking-tight mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

function UseCaseCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:border-primary/15 transition-all duration-300">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold tracking-tight mb-1.5">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-xl border border-border/80 bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-medium text-foreground hover:bg-muted/30 transition-colors [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <p className="px-5 pb-4 pt-4 text-muted-foreground text-sm leading-relaxed border-t border-border/60">
        {answer}
      </p>
    </details>
  );
}
