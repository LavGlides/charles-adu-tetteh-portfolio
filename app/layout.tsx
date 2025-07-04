import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_PORTFOLIO_URL?.startsWith("http")
      ? process.env.NEXT_PUBLIC_PORTFOLIO_URL
      : "http://localhost:3000"
  ),
  title: "Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert",
  description:
    "Skilled full-stack developer and AWS Cloud specialist with a background in Computer Science, delivering scalable web and mobile solutions. Available for hire in Ghana and globally.",
  keywords: [
    "Charles Adu Tetteh",
    "Full-Stack Developer",
    "AWS Cloud Expert",
    "React Developer",
    "Next.js Developer",
    "Mobile App Development",
    "Technical Training",
    "Computer Science Graduate",
    "Ghana Developer",
    "Freelance Developer",
    "Web Development",
    "Cloud Solutions",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Python",
    "Software Engineer",
  ],
  authors: [{ name: "Charles Adu Tetteh" }],
  creator: "Charles Adu Tetteh",
  publisher: "Charles Adu Tetteh",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "Portfolio",
  classification: "Business",
  openGraph: {
    title: "Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert",
    description:
      "React & Next.js specialist building high-performance apps with AWS cloud integration. Hire Charles Adu Tetteh for modern software development needs. Available for hire globally.",
    url: "/",
    siteName: "Charles Adu Tetteh Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/charles_big.jpg",
        width: 1200,
        height: 630,
        alt: "Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert",
        type: "image/jpeg",
      },
      {
        url: "/charles_passport_size.png",
        width: 800,
        height: 600,
        alt: "Charles Adu Tetteh Profile Picture",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@hon_adutette",
    creator: "@hon_adutette",
    title: "Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert",
    description:
      "Experienced full-stack developer with expertise in web development, AWS, and mobile-first development, based in Ghana. Available for hire globally.",
    images: [
      {
        url: "/charles_big.jpg",
        alt: "Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#1e293b",
    "msapplication-TileColor": "#1e293b",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1e293b" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Charles Adu Tetteh",
              jobTitle: "Full-Stack Developer & AWS Cloud Expert",
              description:
                "Dynamic Computer Science graduate with expertise in full-stack web and mobile app development, AWS cloud solutions, and technical training.",
              url:
                process.env.NEXT_PUBLIC_PORTFOLIO_URL ||
                "http://localhost:3000",
              image: {
                "@type": "ImageObject",
                url: "/charles_big.jpg",
                width: "1200",
                height: "630",
              },
              sameAs: [
                "https://www.linkedin.com/in/charles-adu-tetteh-00546a109",
                "https://github.com/LavGlides",
              ],
              alumniOf: {
                "@type": "Organization",
                name: "Garden City University College",
              },
              knowsAbout: [
                "Full-Stack Development",
                "AWS Cloud Solutions",
                "React",
                "Next.js",
                "Mobile App Development",
                "Technical Training",
                "JavaScript",
                "TypeScript",
                "Node.js",
                "Python",
              ],
              hasOccupation: {
                "@type": "Occupation",
                name: "Software Developer",
                occupationLocation: {
                  "@type": "Place",
                  name: "Ghana",
                },
              },
              worksFor: {
                "@type": "Organization",
                name: "Freelance",
              },
            }),
          }}
        />

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
