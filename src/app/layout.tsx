import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import {ClerkProvider} from '@clerk/nextjs';
import Header from "./_components/Header";
import { Toaster } from "~/components/ui/toaster";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "devBlog",
  description: "A blog for developers to share their knowledge",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col min-h-screen w-screen bg-[#1B262C] font-itim">
        <Header />
        <div className="flex-grow">
        {children}
        </div>
        <Toaster />
        <div className="flex h-[200px] text-center items-center justify-center">
        <Footer />
        </div>
        </body>
    </html>
    </ClerkProvider>
  );
}
