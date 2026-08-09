import type { Metadata } from "next";
import { Space_Grotesk, Chakra_Petch, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KLΘT NOMAD — Victory Through Harmony",
  description:
    "The KLΘT NOMAD barefoot shoe. Zero-drop, five-toe, Nsibidi-inspired. Designed in Lagos. Preorder now.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${chakraPetch.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:font-technical focus:text-sm focus:font-medium focus:text-void"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
