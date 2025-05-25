import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Professional Experience',
  description: 'Explore Artem Dyachuk\'s professional experience including roles at Brightland Homes, Avacomtech Inc., and Ufeelgood LLC. Over a decade of experience in digital product management and full-stack development.',
  openGraph: {
    title: 'Professional Experience - Artem Dyachuk',
    description: 'Explore Artem Dyachuk\'s professional experience including roles at Brightland Homes, Avacomtech Inc., and Ufeelgood LLC. Over a decade of experience in digital product management and full-stack development.',
    url: 'https://artemdyachuk.com/experience',
  },
  twitter: {
    title: 'Professional Experience - Artem Dyachuk',
    description: 'Explore Artem Dyachuk\'s professional experience in digital product management and full-stack development.',
  },
  alternates: {
    canonical: '/experience',
  },
};

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 