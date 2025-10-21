import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Microsite",
  description: `A multi-tenant website builder built with Next.js for the College of Information and Communications 
    Technology (CICT) at Bulacan State University (BulSU). It allows student organizations to create and customize their own website.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // clerk for auth
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* top loading bar */}
          <NextTopLoader color="#ff6900" showSpinner={false} />

          {children}

          {/* for showing notifications */}
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
