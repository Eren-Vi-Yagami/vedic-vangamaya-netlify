/**
 * Root Layout Component for Vaidika Vangamaya
 * 
 * This is the main layout component that wraps all pages in the application.
 * It sets up the HTML structure, global fonts, metadata, and navigation.
 * 
 * Key Features:
 * - Sets up Inter font for modern readability
 * - Defines SEO metadata for better search visibility
 * - Includes global navigation component
 * - Applies consistent theming across all pages
 * 
 * @component
 * @module layout
 */

import type { Metadata } from "next";
import { Inter, Playfair_Display, Ubuntu } from "next/font/google";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import FloatingEngine from "@/components/FloatingEngine";
import "./globals.css";

/**
 * Font Configuration
 * 
 * Inter is used as the primary font for its excellent readability
 * and modern appearance, suitable for both digital and scholarly content.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-ubuntu",
  display: "swap",
});

/**
 * SEO Metadata Configuration
 * 
 * Defines how the application appears in search engines and social media.
 * These values are crucial for discoverability and user engagement.
 */
export const metadata: Metadata = {
  title: "Vaidika Vangamaya – Digital Library",
  description: "Explore and read thousands of Vaidika scriptures online with a premium, glass‑morphic UI.",
  keywords: ["Vaidika", "scriptures", "digital library", "ancient texts", "Hindu scriptures"],
  authors: [{ name: "Vaidika Vangamaya Team" }],
  viewport: "width=device-width, initial-scale=1",
  // Open Graph metadata for social media sharing
  openGraph: {
    title: "Vaidika Vangamaya – Digital Library",
    description: "Explore thousands of Vaidika scriptures with a premium reading experience",
    type: "website",
  },
};

/**
 * Root Layout Component Props
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root Layout Component
 * 
 * The top-level layout component that provides the HTML structure
 * and global styling for the entire application.
 * 
 * @param {RootLayoutProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The root layout structure
 */
export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${ubuntu.variable}`}
      suppressHydrationWarning // Prevents hydration mismatch warnings
    >
      <body className="bg-background text-foreground antialiased relative">
        {/* Global Navigation - Present on all pages */}
        <Navbar />

        {/* Main Content Area - Where pages are rendered */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Floating Engine Logo Element */}

        {/* Floating Engine Logo Element */}
        <FloatingEngine />


      </body>
    </html>
  );
}
