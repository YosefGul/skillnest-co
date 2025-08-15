import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SKILLNEST - Creative Hub Coming Soon | Games, Art, Design Platform",
  description:
    "SKILLNEST is a revolutionary creative platform launching soon. Join our community for games, art, design, animation, and innovative creative projects. Be part of the creative revolution.",
  keywords: [
    "SKILLNEST",
    "creative platform",
    "games",
    "art",
    "design",
    "animation",
    "creative hub",
    "coming soon",
    "creative community",
  ],
  authors: [{ name: "SKILLNEST Team" }],
  creator: "SKILLNEST",
  publisher: "SKILLNEST",
  robots: "index, follow",
  metadataBase: new URL("https://skillnest.art"),
  alternates: {
    canonical: "https://skillnest.art",
    languages: {
      tr: "https://skillnest.art",
      en: "https://skillnest.art",
      de: "https://skillnest.art",
      es: "https://skillnest.art",
      ar: "https://skillnest.art",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skillnest.art",
    title: "SKILLNEST - Creative Hub Coming Soon",
    description: "Revolutionary creative platform for games, art, design, and animation. Join the creative revolution.",
    siteName: "SKILLNEST",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SKILLNEST - Creative Hub Coming Soon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SKILLNEST - Creative Hub Coming Soon",
    description: "Revolutionary creative platform for games, art, design, and animation. Join the creative revolution.",
    images: ["/twitter-image.png"],
    creator: "@skillnest",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.png", color: "#93E51F" }],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#93E51F",
    "theme-color": "#93E51F",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SKILLNEST",
              url: "https://skillnest.art",
              description: "Revolutionary creative platform for games, art, design, and animation",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://skillnest.art/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              sameAs: [
                "https://twitter.com/skillnest",
                "https://instagram.com/skillnest",
                "https://linkedin.com/company/skillnest",
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
