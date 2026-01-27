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
    default: 'Artem Dyachuk - Lead Software Engineer & Product Manager',
  },
  description: "Lead Software Engineer and Technical Product Manager in Dallas, Texas. 6+ years of experience in cloud architecture, full-stack development, IoT solutions, and software engineering at AT&T Connected Solutions.",
  authors: [{ name: 'Artem Dyachuk' }],
  creator: 'Artem Dyachuk',
  publisher: 'Artem Dyachuk',
  metadataBase: new URL('https://www.artemdyachuk.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.artemdyachuk.com',
    siteName: 'Artem Dyachuk Portfolio',
    title: 'Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'Results-oriented Lead Software Engineer with 6+ years of experience building impactful digital solutions. Full-Stack Web Developer leading engineering teams at AT&T.',
    images: [
      {
        url: '/avatars/artem-dyachuk-xs.webp',
        width: 400,
        height: 400,
        alt: 'Artem Dyachuk - Lead Software Engineer & Product Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artem Dyachuk - Lead Software Engineer & Product Manager',
    description: 'Results-oriented Lead Software Engineer with 6+ years of experience building impactful digital solutions and leading engineering teams.',
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
