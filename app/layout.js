import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SpendLens — Free AI Spend Audit for Startups",
  description:
    "Find out if your team is overpaying for AI tools. Free instant audit. No signup required.",
  openGraph: {
    title: "SpendLens — Free AI Spend Audit",
    description: "Find out if your team is overpaying for AI tools.",
    siteName: "SpendLens",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SpendLens — Free AI Spend Audit",
    description: "Find out if your team is overpaying for AI tools.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
