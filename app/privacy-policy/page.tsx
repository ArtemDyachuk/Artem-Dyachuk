import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Artem Dyachuk&apos;s portfolio website. Learn how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy - Artem Dyachuk',
    description: 'Privacy Policy for Artem Dyachuk&apos;s portfolio website. Learn how we collect, use, and protect your personal information.',
    url: 'https://www.artemdyachuk.com/privacy-policy',
  },
  twitter: {
    title: 'Privacy Policy - Artem Dyachuk',
    description: 'Privacy Policy for Artem Dyachuk&apos;s portfolio website.',
  },
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicy() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: May 27, 2025</p>

          <p className={styles.text}>
            Welcome to my portfolio website artemdyachuk.com (&quot;Site&quot;), operated by Artem Dyachuk (&quot;I,&quot; &quot;me,&quot; or &quot;my&quot;). This Privacy Policy explains how I collect, use, and protect your information when you visit my Site. I use basic analytics to understand Site usage and may use data for basic marketing purposes, such as ads or emails. I do not sell your data. Please read this policy carefully.
          </p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information I Collect</h2>
            <p className={styles.text}>I collect limited information to improve my Site and support basic marketing:</p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Automatically Collected Information:</strong> When you visit my Site, I collect data through cookies and similar technologies, including:
                <ul className={styles.subList}>
                  <li>Log Data: IP address, browser type, device type, and visit timestamps.</li>
                  <li>Usage Data: Pages viewed, time spent on the Site, and browsing behavior.</li>
                  <li>Cookies: Small files stored on your device for analytics and marketing purposes.</li>
                </ul>
              </li>
              <li className={styles.listItem}>
                <strong>Voluntarily Provided Information:</strong> If you sign up for email updates (e.g., newsletters), I collect your email address and any other information you provide.
              </li>
              <li className={styles.listItem}>
                <strong>Analytics Tools:</strong> I use the following third-party services for analytics and marketing:
                <ul className={styles.subList}>
                  <li><strong>Google Analytics:</strong> Tracks page views and user interactions using cookies. See <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer">How Google uses data</a>.</li>
                  <li><strong>Google Tag Manager:</strong> Manages tags for analytics and marketing scripts, which may set cookies.</li>
                  <li><strong>Google Search Console:</strong> Collects data on search queries and Site performance to improve visibility.</li>
                  <li><strong>Vercel Analytics:</strong> Tracks page views and device information to monitor Site performance.</li>
                </ul>
              </li>
              <li className={styles.listItem}>
                <strong>Future Tools:</strong> I may add heatmap tools (e.g., Hotjar) to track clicks and scrolls. I will update this policy and obtain consent if required before using such tools.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How I Use Your Information</h2>
            <p className={styles.text}>I use the collected information to:</p>
            <ul className={styles.list}>
              <li>Understand how visitors use my Site to improve its design and content.</li>
              <li>Monitor Site performance and search engine visibility.</li>
              <li>Ensure the Site functions properly.</li>
              <li>Conduct basic marketing, such as displaying targeted ads or sending promotional emails about my portfolio or services (with your consent where required).</li>
            </ul>
            <p className={styles.text}>I do not sell your data to third parties.</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Cookies and Tracking</h2>
            <p className={styles.text}>
              My Site uses cookies for analytics and basic marketing. Cookies are small files stored on your device to track usage and personalize ads. You can control cookies via my Site&apos;s cookie banner (if applicable) or your browser settings. To opt out of Google Analytics tracking, install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-Out Browser Add-On</a>.
            </p>
            <p className={styles.text}>I use:</p>
            <ul className={styles.list}>
              <li><strong>Necessary Cookies:</strong> Essential for Site functionality.</li>
              <li><strong>Analytics Cookies:</strong> Track usage for performance insights (e.g., Google Analytics, Vercel Analytics).</li>
              <li><strong>Marketing Cookies:</strong> Support targeted ads or tracking for marketing campaigns.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Email Communications</h2>
            <p className={styles.text}>
              If you sign up for my email updates (e.g., newsletters), I may send you promotional emails about my portfolio or services. You can opt out at any time using the unsubscribe link in the emails or by contacting me at contact@artemdyachuk.com.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Sharing Your Information</h2>
            <p className={styles.text}>I share data only with:</p>
            <ul className={styles.list}>
              <li>
                <strong>Service Providers:</strong> Google and Vercel process data for analytics and marketing services. Their servers may be in the United States or other countries. See Google&apos;s <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and Vercel&apos;s <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              </li>
              <li>
                <strong>Legal Requirements:</strong> If required by law to protect my rights or comply with regulations.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Your Rights</h2>
            <p className={styles.text}>You may have rights depending on your location, such as:</p>
            <ul className={styles.list}>
              <li><strong>Access:</strong> Request details about your data.</li>
              <li><strong>Deletion:</strong> Request removal of your data.</li>
              <li><strong>Opt-Out:</strong> Disable analytics and marketing cookies via the cookie banner, browser settings, or the Google Analytics Opt-Out Add-On. For emails, use the unsubscribe link or contact me.</li>
              <li><strong>Consent Withdrawal:</strong> Withdraw consent for marketing or analytics data processing (EU users).</li>
            </ul>
            <p className={styles.text}>
              Contact me at contact@artemdyachuk.com to exercise these rights. As I do not sell data, no &quot;Do Not Sell My Personal Information&quot; option is needed under CCPA.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Consent for Cookies and Marketing</h2>
            <p className={styles.text}>
              For visitors in the EU, I obtain explicit consent for non-essential cookies (e.g., analytics and marketing) and email communications via a cookie banner or sign-up forms, as required by GDPR. You can update your preferences at any time via the cookie settings link (if available) or by contacting me.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Data Security and Retention</h2>
            <p className={styles.text}>
              I use reasonable measures to protect your data. Data is retained only as long as needed for analytics and marketing purposes (e.g., Google Analytics data is kept for 2 months for GA4) or as required by law.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. International Data Transfers</h2>
            <p className={styles.text}>
              Data processed by Google and Vercel may be transferred to the United States or other countries. I rely on their compliance with data protection laws, such as GDPR&apos;s standard contractual clauses.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Changes to This Policy</h2>
            <p className={styles.text}>
              I may update this Privacy Policy to reflect changes in my practices or laws. The updated policy will be posted on my Site with a revised &quot;Last Updated&quot; date.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Contact Me</h2>
            <p className={styles.text}>For questions about this Privacy Policy, contact me at:</p>
            <p className={styles.text}>
              Artem Dyachuk<br />
              contact@artemdyachuk.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 