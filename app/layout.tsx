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
  title: {
    template: '%s | Artem Dyachuk',
    default: 'Artem Dyachuk - Digital Product Manager & Full-Stack Developer',
  },
  description: "Results-oriented Digital Product Manager with over a decade of experience transforming digital marketing efforts and product landscapes. Full-Stack Web Developer supporting over $1 billion in annual revenue.",
  authors: [{ name: 'Artem Dyachuk' }],
  creator: 'Artem Dyachuk',
  publisher: 'Artem Dyachuk',
  metadataBase: new URL('https://artemdyachuk.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://artemdyachuk.com',
    siteName: 'Artem Dyachuk Portfolio',
    title: 'Artem Dyachuk - Digital Product Manager & Full-Stack Developer',
    description: 'Results-oriented Digital Product Manager with over a decade of experience transforming digital marketing efforts and product landscapes. Full-Stack Web Developer supporting over $1 billion in annual revenue.',
    images: [
      {
        url: '/avatars/artem-dyachuk-xs.webp',
        width: 400,
        height: 400,
        alt: 'Artem Dyachuk - Digital Product Manager & Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artem Dyachuk - Digital Product Manager & Full-Stack Developer',
    description: 'Results-oriented Digital Product Manager with over a decade of experience transforming digital marketing efforts and product landscapes.',
    images: ['/avatars/artem-dyachuk-xs.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // verification: {
  //   google: 'your-google-verification-code', // Replace with actual verification code when available
  // },
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
