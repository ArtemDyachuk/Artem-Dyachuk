import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/navigation/header/Header";
import FabContact from "./components/FabContact";
import Footer from "./components/navigation/footer/Footer";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Header />
        <FabContact />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
