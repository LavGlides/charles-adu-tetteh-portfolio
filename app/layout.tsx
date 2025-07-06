import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

// Define metadataBase for absolute URLs
const metadataBase = new URL(
  process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://charles-adu-tetteh.vercel.app" 
);

export const metadata: Metadata = {
  metadataBase,
  title: "Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert",
  description:
    "Dynamic full-stack developer and AWS Cloud expert, ready to transform your ideas into powerful software or launch your website online. With a Computer Science background and expertise in scalable web and mobile solutions, I am here to bring your vision to life. Available for hire in Ghana and globally..",
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
        url: new URL("/charles_big.png", metadataBase).toString(),
        width: 1200,
        height: 630,
        alt: "Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert",
        type: "image/jpeg",
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
        url: new URL("/charles_big.png", metadataBase).toString(),
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

        {/* Open Graph meta tags */}
        <meta
          property="og:image"
          content={new URL("/charles_big.png", metadataBase).toString()}
        />
        <meta
          property="og:image:secure_url"
          content={new URL("/charles_big.png", metadataBase).toString()}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta
          property="og:image:alt"
          content="Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert"
        />

        {/* WhatsApp and LinkedIn specific meta tags */}
        <meta
          property="og:title"
          content="Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert"
        />
        <meta
          property="og:description"
          content="React & Next.js specialist building high-performance apps with AWS cloud integration. Hire Charles Adu Tetteh for modern software development needs. Available for hire globally."
        />

        {/* LinkedIn specific meta tags */}
        <meta property="article:author" content="Charles Adu Tetteh" />
        <meta
          property="article:published_time"
          content="2024-01-01T00:00:00Z"
        />

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
              url: metadataBase.toString(),
              image: {
                "@type": "ImageObject",
                url: new URL("/charles_big.png", metadataBase).toString(),
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
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            type="text/javascript"
          >
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )}

        {children}
        <Toaster />
      </body>
    </html>
  );
}