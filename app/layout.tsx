import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import FabContact from "./components/FabContact";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Artem Dyachuk - Digital Product Manager",
  description: "Digital Product Manager & Full-Stack Developer with over a decade of experience transforming digital marketing efforts and product landscapes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <FabContact />
        {children}
      </body>
    </html>
  );
}
