import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawdium — Every result. Every ribbon. Every run.",
  description:
    "Create a beautiful profile for your dog, track show results and agility runs, collect achievements and share every milestone with the people who understand.",
  keywords: ["dog show", "dog agility", "competitive dogs", "ribbon rack", "show dog", "agility titles", "dog sport", "breeder", "kennel"],
  openGraph: {
    title: "Pawdium — Every result. Every ribbon. Every run.",
    description: "The achievement profile for competitive dogs. Track show results, agility runs, titles and milestones.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pawdium — Every result. Every ribbon. Every run.",
    description: "The achievement profile for competitive dogs. Track show results, agility runs, titles and milestones.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pawdium",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111014",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-plum-900 text-ivory">
        {children}
      </body>
    </html>
  );
}
