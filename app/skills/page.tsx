"use client";

import styles from "./page.module.css";

export default function Skills() {
  return (
    <main className={styles.main}>
      <section className={styles.skills}>
        <div className={styles.container}>
          <h1 className={styles.title}>Skills & Expertise</h1>

          <div className={styles.skillsGrid}>
            {/* Web Development */}
            <div className={styles.skillCategory}>
              <h2 className={styles.categoryTitle}>Web Development</h2>
              <div className={styles.skillList}>
                <div className={styles.skillGroup}>
                  <h3>Front-End</h3>
                  <ul>
                    <li>HTML5 & CSS3</li>
                    <li>JavaScript (ES6+)</li>
                    <li>React & Next.js</li>
                    <li>Responsive Design</li>
                  </ul>
                </div>
                <div className={styles.skillGroup}>
                  <h3>Back-End</h3>
                  <ul>
                    <li>Node.js & Express</li>
                    <li>RESTful APIs</li>
                    <li>MongoDB & Mongoose</li>
                    <li>PHP & WordPress</li>
                    <li>Database Design</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Product Management */}
            <div className={styles.skillCategory}>
              <h2 className={styles.categoryTitle}>Product Management</h2>
              <div className={styles.skillList}>
                <div className={styles.skillGroup}>
                  <h3>Core Skills</h3>
                  <ul>
                    <li>Product Strategy</li>
                    <li>Roadmap Planning</li>
                    <li>User Experience</li>
                    <li>Agile Methodologies</li>
                    <li>Cross-functional Leadership</li>
                  </ul>
                </div>
                <div className={styles.skillGroup}>
                  <h3>Tools & Platforms</h3>
                  <ul>
                    <li>JIRA & Confluence</li>
                    <li>HubSpot CRM</li>
                    <li>Google Analytics</li>
                    <li>Data Studio</li>
                    <li>Git Version Control</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Digital Marketing */}
            <div className={styles.skillCategory}>
              <h2 className={styles.categoryTitle}>Digital Marketing</h2>
              <div className={styles.skillList}>
                <div className={styles.skillGroup}>
                  <h3>Marketing Tools</h3>
                  <ul>
                    <li>HubSpot Marketing</li>
                    <li>Google Ads & Analytics</li>
                    <li>Facebook Ads</li>
                    <li>Email Marketing</li>
                    <li>SEO & SEM</li>
                  </ul>
                </div>
                <div className={styles.skillGroup}>
                  <h3>E-commerce</h3>
                  <ul>
                    <li>Magento</li>
                    <li>Shopify</li>
                    <li>Amazon Seller Central</li>
                    <li>Inventory Management</li>
                    <li>Marketplace Integration</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className={styles.skillCategory}>
              <h2 className={styles.categoryTitle}>Languages</h2>
              <div className={styles.skillList}>
                <div className={styles.skillGroup}>
                  <h3>Proficiency</h3>
                  <ul>
                    <li>English (Fluent)</li>
                    <li>Ukrainian (Native)</li>
                    <li>Russian (Native)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 