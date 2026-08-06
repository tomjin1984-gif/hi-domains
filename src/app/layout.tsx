import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hi.domains | AI Domain Intelligence Platform",
  description: "Analyze, value and manage your domains with AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-slate-50 text-slate-950">{children}</body>
    </html>
  );
}
