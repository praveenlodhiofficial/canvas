"use client";

type AuthPageShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthPageShell({
  title,
  subtitle,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <div className="bg-background text-foreground flex h-screen items-center justify-center p-4">
      <div className="animate-in fade-in w-full max-w-5xl duration-300">
        <div className="border-border bg-card flex max-h-[calc(100vh-200px)] flex-col overflow-hidden rounded-xl border border-dashed shadow-lg md:flex-row">
          {/* Left: image / branding placeholder (~2/3) */}
          <div className="bg-muted/50 border-border flex min-h-[240px] flex-1 items-center justify-center border-r border-b border-dashed md:min-h-0 md:border-b-0">
            <span
              className="text-muted-foreground -rotate-12 text-lg font-medium select-none"
              aria-hidden
            >
              Image
            </span>
          </div>

          {/* Right: form (~1/3) */}
          <div className="hide-scrollbar flex w-full shrink-0 flex-col overflow-y-auto p-8 md:w-[450px] md:p-10">
            <div className="mb-6">
              <h1 className="text-foreground text-2xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
            </div>

            {children}

            <div className="border-border mt-6 border-t border-dashed pt-6">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
