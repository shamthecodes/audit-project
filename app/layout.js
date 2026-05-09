import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"] });

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
      <body className={geist.className} suppressHydrationWarning>
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              background: "#1f2937",
              border: "1px solid #374151",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
