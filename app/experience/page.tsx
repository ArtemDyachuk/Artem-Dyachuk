"use client";

import { useState } from "react";
import styles from "../page.module.css";

export default function Experience() {
  const [activeAccordion, setActiveAccordion] = useState("brightland");

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? "" : id);
  };

  return (
    <main className={styles.main}>
      <section className={styles.experience}>
        <div className={styles.container}>
          <h1 className={styles.sectionTitle}>Professional Experience</h1>
          
          {/* Brightland Homes */}
          <div className={styles.accordionItem}>
            <button
              onClick={() => toggleAccordion("brightland")}
              className={`${styles.accordionButton} ${activeAccordion === "brightland" ? styles.active : ""}`}
            >
              <div className={styles.accordionHeader}>
                <span className={styles.roleTitle}>Digital Product Manager</span>
                <span className={styles.companyInfo}>Brightland Homes, Addison, TX</span>
                <span className={styles.period}>March 2023 - Present</span>
              </div>
            </button>
            
            {activeAccordion === "brightland" && (
              <div className={styles.accordionContent}>
                <div className={styles.achievements}>
                  <h5 className={styles.achievementsTitle}>Key Achievements</h5>
                  <ul className={styles.achievementsList}>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Led development of custom CMS (ARC) and corporate websites supporting $1B+ annual revenue
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Achieved $299K cost savings through TV signage platform transformation
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Engineered integrations with HubSpot, Zillow, Realtor.com, and social platforms
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Doubled PageSpeed Insights scores and increased user engagement by 40%
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Enhanced platform security by 30% and boosted marketing productivity by 15%
                    </li>
                  </ul>
                </div>
                
                <div className={styles.achievementCards}>
                  <div className={styles.card}>
                    <h6 className={styles.cardTitle}>Cost Savings</h6>
                    <ul className={styles.cardList}>
                      <li>$50K annually - Google Maps API optimization</li>
                      <li>$40K - In-house development</li>
                      <li>$30K annually - Reduced vendor dependency</li>
                      <li>$15K - HubSpot rollout</li>
                      <li>$4K annually - API consolidation</li>
                      <li>$1.5K - Redirect services</li>
                    </ul>
                  </div>
                  <div className={styles.card}>
                    <h6 className={styles.cardTitle}>Technical Achievements</h6>
                    <ul className={styles.cardList}>
                      <li>Built REST APIs with Node.js Express</li>
                      <li>Implemented advanced caching strategies</li>
                      <li>Enhanced platform security by 30%</li>
                      <li>Boosted marketing productivity by 15%</li>
                      <li>Developed custom HubSpot modules</li>
                      <li>Created dynamic landing pages</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gehan Homes */}
          <div className={styles.accordionItem}>
            <button
              onClick={() => toggleAccordion("gehan")}
              className={`${styles.accordionButton} ${activeAccordion === "gehan" ? styles.active : ""}`}
            >
              <div className={styles.accordionHeader}>
                <span className={styles.roleTitle}>Web Specialist</span>
                <span className={styles.companyInfo}>Gehan Homes/Brightland Homes, Addison, TX</span>
                <span className={styles.period}>October 2020 - March 2023</span>
              </div>
            </button>
            
            {activeAccordion === "gehan" && (
              <div className={styles.accordionContent}>
                <div className={styles.achievements}>
                  <h5 className={styles.achievementsTitle}>Key Achievements</h5>
                  <ul className={styles.achievementsList}>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Led TV signage platform transformation saving $299K
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Developed custom APIs for HubSpot, Zillow, and Facebook integration
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Implemented GIT version control improving project stability
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Enhanced marketing data clarity by 20%
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      Created product roadmap for custom website and CMS
                    </li>
                  </ul>
                </div>

                <div className={styles.achievementCards}>
                  <div className={styles.card}>
                    <h6 className={styles.cardTitle}>Technical Projects</h6>
                    <ul className={styles.cardList}>
                      <li>Built inventory database using BDX XML feeds</li>
                      <li>Developed marketing tools for exterior packages</li>
                      <li>Created floor plan and room galleries</li>
                      <li>Implemented Google Analytics 4 upgrade</li>
                    </ul>
                  </div>
                  <div className={styles.card}>
                    <h6 className={styles.cardTitle}>Integration Achievements</h6>
                    <ul className={styles.cardList}>
                      <li>HubSpot custom objects implementation</li>
                      <li>Facebook inventory sync program</li>
                      <li>Zillow-HubSpot integration</li>
                      <li>JDE/DASH/HubSpot integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Previous Roles */}
          <div className={styles.accordionItem}>
            <button
              onClick={() => toggleAccordion("previous")}
              className={`${styles.accordionButton} ${activeAccordion === "previous" ? styles.active : ""}`}
            >
              <div className={styles.accordionHeader}>
                <span className={styles.roleTitle}>Previous Roles</span>
                <span className={styles.period}>2015 - 2020</span>
              </div>
            </button>
            
            {activeAccordion === "previous" && (
              <div className={styles.accordionContent}>
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <h6 className={styles.timelineTitle}>Digital Marketing Specialist</h6>
                    <p className={styles.timelineCompany}>NewBlue Inc., San Diego, CA (2019-2020)</p>
                    <ul className={styles.timelineList}>
                      <li>Improved click-through rates by 12%</li>
                      <li>Reduced site errors by 15%</li>
                      <li>Developed custom WordPress modules</li>
                      <li>Accelerated project delivery by 10%</li>
                    </ul>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <h6 className={styles.timelineTitle}>E-Commerce Manager</h6>
                    <p className={styles.timelineCompany}>Avacomtech Inc., National City, CA (2017-2019)</p>
                    <ul className={styles.timelineList}>
                      <li>Achieved 259% sales increase in three months</li>
                      <li>Improved operational efficiency by 20%</li>
                      <li>Managed corporate Magento websites</li>
                      <li>Implemented comprehensive CRM strategies</li>
                    </ul>
                  </div>
                  
                  <div className={styles.timelineItem}>
                    <h6 className={styles.timelineTitle}>E-Commerce Manager</h6>
                    <p className={styles.timelineCompany}>Ufeelgood LLC, Stanhope, NJ (2015-2018)</p>
                    <ul className={styles.timelineList}>
                      <li>Increased revenue by 30% year-over-year</li>
                      <li>Achieved 95% customer satisfaction rate</li>
                      <li>Expanded sales channels to Amazon EU, eBay, Walmart</li>
                      <li>Boosted product visibility by 18%</li>
            </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 