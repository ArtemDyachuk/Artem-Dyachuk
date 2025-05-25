import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import Header from "./components/navigation/header/Header";
import FabContact from "./components/FabContact";
import Footer from "./components/navigation/footer/Footer";
import { Analytics } from "@vercel/analytics/next"
import { GoogleTagManager } from '@next/third-parties/google'

// Configure fonts with CSS variables for better control
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Artem Dyachuk - Product Manager | Full-Stack Developer",
  description: "Product Manager & Full-Stack Developer with over a decade of experience transforming digital marketing efforts and product landscapes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-KHWLTHMR" />
      <body className={`${inter.variable} ${nunito.variable}`}>
        <Header />
        <FabContact />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
