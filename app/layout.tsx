import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawdium — Every result. Every ribbon. Every dog.",
  description:
    "Create a beautiful profile for your dog, track show results, build a digital ribbon rack and share every win with the people who understand.",
  keywords: ["dog show", "dog exhibitor", "ribbon rack", "show dog", "dog sport", "breeder", "kennel"],
  openGraph: {
    title: "Pawdium — Every result. Every ribbon. Every dog.",
    description: "Create a beautiful profile for your dog, track show results, build a digital ribbon rack and share every win.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pawdium — Every result. Every ribbon. Every dog.",
    description: "Create a beautiful profile for your dog, track show results, build a digital ribbon rack and share every win.",
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
