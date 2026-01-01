import type { Metadata } from "next";
import "@/styles/globals.css";
import { Exo_2, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"

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
    <html lang="en">
      <body className={`${inter.className} ${exo2.variable}`}>
        <div className="mx-auto">
          {children}
        </div>
        <Toaster richColors position="top-right" duration={2000} />
      </body>
    </html>
  );
}
