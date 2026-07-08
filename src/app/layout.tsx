import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";

// Placeholder fonts until original font files are provided
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Ram Pawar - AI Solutions Architect",
  description: "Portfolio of Ram Pawar, AI Solutions Architect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `history.scrollRestoration = "manual";` }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-nourd bg-[#fbfbfb] text-black antialiased`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
