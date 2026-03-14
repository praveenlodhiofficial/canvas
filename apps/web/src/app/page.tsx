import React from "react";

import Link from "next/link";

import {
  ChevronDown,
  Circle,
  Eraser,
  GraduationCap,
  Keyboard,
  LayoutDashboard,
  Lightbulb,
  LogIn,
  Minus,
  MousePointer2,
  Palette,
  Pencil,
  Share2,
  Sparkles,
  Square,
  Triangle,
  Type,
  UserPlus,
  UserPlus2,
  Users,
  Video,
  ZoomIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen antialiased">
      {/* Gradient + grid background */}
      <div
        className="from-primary/5 via-background to-background fixed inset-0 -z-10 bg-linear-to-b"
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

      <header className="border-border/60 bg-background/70 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
              <Pencil className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight md:text-2xl">
              Canvas
            </span>
          </Link>

          <nav className="text-muted-foreground hidden items-center gap-8 text-sm font-medium md:flex md:text-base">
            <Link
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#use-cases"
              className="hover:text-foreground transition-colors"
            >
              Use cases
            </Link>
            <Link
              href="#faq"
              className="hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-sm md:text-base" asChild>
              <Link href="/sign-in" className="gap-2">
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
            </Button>
            <Button className="text-sm md:text-base" asChild>
              <Link href="/sign-up" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — full viewport */}
        <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-24">
          <div className="mx-auto mt-20 max-w-4xl text-center">
            <p className="text-muted-foreground mb-6 text-sm font-medium tracking-widest uppercase">
              Collaborative whiteboard
            </p>
            <h1 className="mb-8 text-5xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl">
              Draw together{" "}
              <span className="from-primary via-primary to-primary/80 bg-linear-to-r bg-clip-text text-transparent">
                in real time
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-14 max-w-2xl text-lg leading-relaxed sm:text-xl">
              Create rooms, invite your team, and sketch with shapes, pencil,
              text, and more. Everything syncs instantly. Undo, zoom, and
              keyboard shortcuts included.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 w-full px-8 text-base font-semibold sm:w-auto"
                asChild
              >
                <Link href="/sign-up">Get started free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full px-8 text-base font-semibold sm:w-auto"
                asChild
              >
                <Link href="/sign-in">Open dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Hero mockup — canvas preview */}
          <div className="relative mx-auto mt-16 w-full max-w-5xl md:mt-24">
            <div className="from-primary/15 via-primary/5 absolute -inset-8 rounded-3xl bg-linear-to-br to-transparent blur-3xl" />
            <div className="border-border/80 bg-card ring-primary/5 relative overflow-hidden rounded-2xl border shadow-2xl ring-1">
              <div className="from-muted/40 to-muted/20 flex aspect-video min-h-[280px] flex-col bg-linear-to-b">
                {/* Fake toolbar */}
                <div className="border-border bg-card/95 flex items-center gap-2 border-b px-4 py-3 backdrop-blur">
                  <div className="border-border bg-background flex items-center gap-1 rounded-lg border p-1.5">
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
                        className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Fake canvas with shapes */}
                <div className="relative flex-1 p-8">
                  <div className="border-foreground/20 bg-background/50 absolute top-14 left-16 h-16 w-24 rounded border-2" />
                  <div className="border-foreground/20 bg-background/50 absolute top-20 left-48 h-20 w-20 rounded-full border-2" />
                  <div className="bg-foreground/20 absolute top-24 right-24 h-1 w-32 rotate-12 rounded-full" />
                  <div className="border-foreground/20 bg-background/50 text-foreground/80 absolute top-32 left-1/2 -translate-x-1/2 rounded border px-3 py-1.5 text-sm font-medium">
                    Type here...
                  </div>
                  <div className="border-border bg-card/90 absolute right-12 bottom-8 flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="border-background bg-primary/80 h-7 w-7 rounded-full border-2"
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground text-xs font-medium">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-border relative overflow-hidden border-t py-24 md:py-32"
        >
          <div className="from-muted/30 via-muted/10 to-background absolute inset-0 -z-10 bg-linear-to-b" />
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center md:mb-20">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need to collaborate
              </h2>
              <p className="text-muted-foreground mx-auto max-w-xl text-lg">
                A full-featured whiteboard with real-time sync, rooms, and
                theme-aware canvas.
              </p>
            </div>

            <div className="relative mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Real-time sync"
                description="Every shape, move, and delete is broadcast to everyone in the room. Join a room and draw together instantly."
              />
              <FeatureCard
                icon={<Share2 className="h-6 w-6" />}
                title="Rooms & sharing"
                description="Create rooms, share links, and see who's in the room. Canvas state is saved when the room is empty and restored on join."
              />
              <FeatureCard
                icon={<Square className="h-6 w-6" />}
                title="Shapes & tools"
                description="Rectangle, ellipse, line, triangle, freehand pencil, text, and eraser. Select and drag to move shapes."
              />
              <FeatureCard
                icon={<Keyboard className="h-6 w-6" />}
                title="Keyboard shortcuts"
                description="Undo (Ctrl+Z), redo (Ctrl+Y), cut/copy/paste, delete. Use keys 1–8 to switch tools without touching the mouse."
              />
              <FeatureCard
                icon={<ZoomIn className="h-6 w-6" />}
                title="Zoom & pan"
                description="Mouse wheel or trackpad to zoom in and out; zoom is centered on the cursor. All tools work correctly when zoomed."
              />
              <FeatureCard
                icon={<Palette className="h-6 w-6" />}
                title="Light & dark theme"
                description="Canvas colors follow your app theme. Toggle theme and the whiteboard updates to match."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="relative overflow-hidden py-24 md:py-32"
        >
          <div className="from-background via-muted/5 to-muted/20 absolute inset-0 -z-10 bg-linear-to-b" />
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center md:mb-20">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                How it works
              </h2>
              <p className="text-muted-foreground mx-auto max-w-xl text-lg">
                Get your team on the same canvas in three simple steps.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3 md:gap-10 lg:gap-20">
              <StepCard
                step={1}
                icon={<UserPlus2 className="h-7 w-7" />}
                title="Sign up"
                description="Create a free account with your email. No credit card required."
              />
              <StepCard
                step={2}
                icon={<LayoutDashboard className="h-7 w-7" />}
                title="Create a room"
                description="From your dashboard, create a new room and copy the share link to invite others."
              />
              <StepCard
                step={3}
                icon={<Pencil className="h-7 w-7" />}
                title="Draw together"
                description="Everyone in the room sees the same canvas. Shapes, moves, and edits sync in real time."
              />
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section
          id="use-cases"
          className="relative overflow-hidden py-24 md:py-32"
        >
          <div className="from-muted/20 via-muted/10 to-background absolute inset-0 -z-10 bg-linear-to-b" />
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center md:mb-20">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Perfect for
              </h2>
              <p className="text-muted-foreground mx-auto max-w-xl text-lg">
                From quick sketches to structured workshops — one canvas for
                every need.
              </p>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <UseCaseCard
                icon={<Lightbulb className="h-6 w-6" />}
                title="Team brainstorming"
                description="Capture ideas as they flow. Shapes, text, and freehand in one shared space."
              />
              <UseCaseCard
                icon={<Video className="h-6 w-6" />}
                title="Remote meetings"
                description="Replace static slides with a live whiteboard everyone can edit."
              />
              <UseCaseCard
                icon={<GraduationCap className="h-6 w-6" />}
                title="Teaching & workshops"
                description="Explain concepts visually. Students can follow along or contribute."
              />
              <UseCaseCard
                icon={<Sparkles className="h-6 w-6" />}
                title="Quick sketches"
                description="Wireframes, flowcharts, or doodles. Fast tools and keyboard shortcuts."
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative overflow-hidden py-24 md:py-32">
          <div className="from-background via-primary/5 to-muted/10 absolute inset-0 -z-10 bg-linear-to-b" />
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center md:mb-20">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
                Frequently asked questions
              </h2>
              <p className="text-muted-foreground mx-auto max-w-xl text-lg">
                Quick answers to common questions.
              </p>
            </div>
            <div className="mx-auto max-w-2xl space-y-4">
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
          <div className="from-background via-primary/5 to-primary/10 absolute inset-0 -z-10 bg-linear-to-b" />
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to draw?
            </h2>
            <p className="text-muted-foreground mx-auto mb-10 max-w-md text-lg">
              Sign up, create a room, and start sketching. No credit card
              required.
            </p>
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold"
              asChild
            >
              <Link href="/sign-up">Get started free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-border from-muted/10 to-muted/30 border-t bg-linear-to-b py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <Pencil className="h-4 w-4" />
            </div>
            <span className="font-bold">Canvas</span>
          </Link>
          <div className="text-muted-foreground flex flex-wrap justify-center gap-6 text-sm sm:gap-8">
            <Link
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#use-cases"
              className="hover:text-foreground transition-colors"
            >
              Use cases
            </Link>
            <Link
              href="#faq"
              className="hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/sign-in"
              className="hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="hover:text-foreground transition-colors"
            >
              Sign up
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
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
    <div className="group border-border/80 bg-card/80 hover:border-primary/20 from-card to-card/50 rounded-2xl border bg-linear-to-b p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg md:p-8">
      <div className="from-primary/15 to-primary/5 text-primary group-hover:from-primary/20 group-hover:to-primary/10 mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br transition-colors">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
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
    <div className="border-border/80 bg-card/80 relative rounded-2xl border p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md md:p-8">
      <div className="bg-primary/10 text-primary mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl">
        {icon}
      </div>
      <span className="from-primary/20 to-primary text-muted-foreground/30 absolute -top-3 left-3 z-10 bg-linear-to-tl bg-clip-text text-[5rem] font-black md:-top-15 md:-left-6 md:text-[7rem] lg:-top-25 lg:-left-12 lg:text-[10rem]">
        {step}
      </span>
      <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
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
    <div className="border-border/80 bg-card/60 hover:border-primary/15 rounded-xl border p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
        {icon}
      </div>
      <h3 className="mb-1.5 font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-border/80 bg-card/80 overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm">
      <summary className="text-foreground hover:bg-muted/30 flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium transition-colors [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <ChevronDown className="text-muted-foreground h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <p className="text-muted-foreground border-border/60 border-t px-5 pt-4 pb-4 text-sm leading-relaxed">
        {answer}
      </p>
    </details>
  );
}
