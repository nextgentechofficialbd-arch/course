import React from "react";
import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AGENCY_NAME, AGENCY_TAGLINE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: {
    default: `${AGENCY_NAME} | ${AGENCY_TAGLINE}`,
    template: `%s | ${AGENCY_NAME}`,
  },
  description: "A premium EdTech platform for mastering digital skills through professional training.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${hindSiliguri.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}