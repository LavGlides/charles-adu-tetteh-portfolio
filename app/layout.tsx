import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert",
  description:
    "Dynamic Computer Science graduate with expertise in full-stack web and mobile app development, AWS cloud solutions, and technical training.",
  keywords: [
    "Full-Stack Developer",
    "AWS",
    "React",
    "Next.js",
    "Mobile Development",
    "Ghana",
    "Technical Training",
  ],
  authors: [{ name: "Charles Adu Tetteh" }],
  openGraph: {
    title: "Charles Adu Tetteh - Full-Stack Developer",
    description: "Expert in React, Next.js, AWS cloud solutions, and technical training",
    url: "https://charlesadutetteh.com",
    siteName: "Charles Adu Tetteh Portfolio",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Add an Open Graph image in your public folder
        width: 1200,
        height: 630,
        alt: "Charles Adu Tetteh Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charles Adu Tetteh - Full-Stack Developer",
    description: "Expert in React, Next.js, AWS cloud solutions, and technical training",
    images: ["/og-image.jpg"],
  },
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@300;400;500;600&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}