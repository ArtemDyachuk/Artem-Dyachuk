import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Key Achievements',
  description: 'Discover Artem Dyachuk\'s key achievements including $300K+ cost savings, revenue growth support, performance improvements, and successful product launches across multiple companies.',
  openGraph: {
    title: 'Key Achievements - Artem Dyachuk',
    description: 'Discover Artem Dyachuk\'s key achievements including $300K+ cost savings, revenue growth support, performance improvements, and successful product launches across multiple companies.',
    url: 'https://artemdyachuk.com/achievements',
  },
  twitter: {
    title: 'Key Achievements - Artem Dyachuk',
    description: 'Discover Artem Dyachuk\'s key achievements including $300K+ cost savings and revenue growth support.',
  },
  alternates: {
    canonical: '/achievements',
  },
};

export default function AchievementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 