import React from "react";
import { Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AGENCY_NAME } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata = {
  title: AGENCY_NAME,
  description: "Master digital skills with premium training.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${hindSiliguri.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}