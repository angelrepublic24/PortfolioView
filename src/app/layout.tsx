import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import {Toaster} from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Angel Almonte | Crafting Modern, Scalable & Efficient Web Solutions",
  description: "Full-Stack Web Developer specializing in scalable web applications, API development, authentication, and high-performance UI/UX. Passionate about building seamless digital experiences using NestJS, Next.js, React, MongoDB, and Tailwind CSS, always learning and innovating",
  icons: {
    icon: "https://res.cloudinary.com/ditz1jg7z/image/upload/v1739338318/logo_y22pya.ico"
  },
  openGraph: {
    title: "Angel Almonte | Crafting Modern, Scalable & Efficient Web Solutions",
    description: "Full-Stack Web Developer specializing in scalable web applications, API development, authentication, and high-performance UI/UX. Passionate about building seamless digital experiences using NestJS, Next.js, React, MongoDB, and Tailwind CSS, always learning and innovating",
    images: [
      {
        url: "https://res.cloudinary.com/ditz1jg7z/image/upload/v1739337807/logo_hktemx.webp",
        width: 1200,
        height: 630,
        alt: "Angel Almonte | FullStack Web Developer"
      }
    ],
    locale: 'en_US',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 leading-relaxed text-slate-400 selection:bg-teal-300 selection:text-teal-900`}
      >
        <Toaster position="top-right" richColors/>
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
