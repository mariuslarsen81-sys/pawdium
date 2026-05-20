import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pawdium — The Digital Show Record for Serious Dog People",
  description:
    "Log your wins. Build your ribbon rack. Share your story. Pawdium is the achievement platform for dog show exhibitors, handlers and breeders.",
  keywords: ["dog show", "dog exhibitor", "ribbon rack", "show dog", "dog sport", "breeder", "kennel"],
  openGraph: {
    title: "Pawdium — The Digital Show Record for Serious Dog People",
    description: "Log your wins. Build your ribbon rack. Share your story.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pawdium — The Digital Show Record for Serious Dog People",
    description: "Log your wins. Build your ribbon rack. Share your story.",
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
  themeColor: "#05080F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-navy-950 text-cream">
        {children}
      </body>
    </html>
  );
}
