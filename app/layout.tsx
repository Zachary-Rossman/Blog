import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navigation/Navbar";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

/**
 * =====================================================
 * FONT SETUP (NEXT FONT OPTIMIZATION)
 * =====================================================
 *
 * Geist + Geist Mono:
 * - loaded via next/font/google
 * - optimized at build time (no external network request at runtime)
 * - attached via CSS variables
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * =====================================================
 * GLOBAL METADATA
 * =====================================================
 *
 * Applied across entire application:
 * - SEO title
 * - meta description
 */
export const metadata: Metadata = {
  title: "Developer Journal",
  description:
    "A modern full-stack blogging platform built with Next.js where developers can publish tutorials, share ideas, and grow together.",
};

/**
 * =====================================================
 * ROOT LAYOUT (APP-WIDE WRAPPER)
 * =====================================================
 *
 * THIS IS THE MOST IMPORTANT FILE IN APP ROUTER:
 *
 * Responsibilities:
 * - wraps ALL pages
 * - defines global UI structure
 * - injects providers (AuthProvider)
 * - renders persistent components (Navbar)
 *
 * RENDER TREE:
 * html
 *  └── body
 *       └── AuthProvider
 *            ├── Navbar (persistent)
 *            └── main (page content)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">

        {/* =====================================================
            GLOBAL AUTH CONTEXT PROVIDER
        =====================================================
        - provides user state across entire app
        - handles:
          - login state
          - refreshUser()
          - loading states
        */}
        <AuthProvider>

          {/* =====================================================
              PERSISTENT NAVIGATION
          ===================================================== */}
          <Navbar />

          {/* =====================================================
              PAGE CONTENT SLOT
          ===================================================== */}
          <main className="flex-1 transition-all duration-200">
            {children}
          </main>

        </AuthProvider>

      </body>
    </html>
  );
}