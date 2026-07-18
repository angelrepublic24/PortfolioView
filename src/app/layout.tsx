import type { Metadata } from "next";
import { Poppins, Signika, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const signika = Signika({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-signika" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

// Drawing-set faces: mono is the draftsman's lettering, sans is for prose.
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });

const DESCRIPTION =
  "Angel Almonte — New Jersey–based full-stack software developer and founder with 6+ years building complete products end to end: the web app, the mobile app, and the backend, database, payments and operations beneath them.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.almonteportfolio.com"),
  title: {
    default: "Angel Almonte — Full-Stack Software Developer & Founder",
    template: "%s — Angel Almonte",
  },
  description: DESCRIPTION,
  keywords: [
    "Angel Almonte", "full-stack developer", "software engineer", "software founder",
    "New Jersey", "Next.js", "NestJS", "React", "React Native", "Node.js",
    "MongoDB", "PostgreSQL", "TypeScript", "Stripe", "Three.js", "portfolio",
  ],
  authors: [{ name: "Angel Almonte" }],
  creator: "Angel Almonte",
  alternates: { canonical: "/" },
  // favicon is provided by app/icon.svg (Drawing-Set amber AA)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.almonteportfolio.com",
    siteName: "Angel Almonte",
    title: "Angel Almonte — Full-Stack Software Developer & Founder",
    description: DESCRIPTION,
    // og:image is provided by app/opengraph-image.tsx (Drawing-Set styled card)
  },
  twitter: {
    card: "summary_large_image",
    title: "Angel Almonte — Full-Stack Software Developer & Founder",
    description: DESCRIPTION,
    // twitter:image is provided by app/twitter-image.tsx
  },
  robots: { index: true, follow: true },
};

const themeScript = `(function(){try{var t=localStorage.getItem('ds-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${signika.variable} ${poppins.variable} ${plexMono.variable} ${inter.variable} font-poppins antialiased bg-zinc-950 leading-relaxed text-zinc-300`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Toaster position="top-right" richColors />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
