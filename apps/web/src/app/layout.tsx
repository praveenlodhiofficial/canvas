import type { Metadata } from "next";
import { Exo_2, Inter } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const exo2 = Exo_2({
  subsets: ["latin"],
  variable: "--font-exo-2",
});

export const metadata: Metadata = {
  title: "Canvas App",
  description: "It is a collaborative canvas for your ideas and your team.",
  icons: {
    icon: "/vercel.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${exo2.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mx-auto">{children}</div>
        </ThemeProvider>
        <Toaster richColors position="top-right" duration={2000} />
        <Analytics />
      </body>
    </html>
  );
}
