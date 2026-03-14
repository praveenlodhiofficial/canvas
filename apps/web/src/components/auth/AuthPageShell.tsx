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
    <div className="h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-5xl animate-in fade-in duration-300">

        <div className="rounded-xl border border-dashed border-border overflow-hidden bg-card shadow-lg flex flex-col md:flex-row max-h-[calc(100vh-200px)]">
          {/* Left: image / branding placeholder (~2/3) */}
          <div className="flex-1 min-h-[240px] md:min-h-0 flex items-center justify-center bg-muted/50 border-b border-r border-dashed border-border md:border-b-0">
            <span
              className="text-muted-foreground font-medium text-lg select-none -rotate-12"
              aria-hidden
            >
              Image
            </span>
          </div>

          {/* Right: form (~1/3) */}
          <div className="shrink-0 w-full md:w-[450px] flex flex-col p-8 md:p-10 hide-scrollbar overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>

            {children}

            <div className="mt-6 pt-6 border-t border-dashed border-border">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
