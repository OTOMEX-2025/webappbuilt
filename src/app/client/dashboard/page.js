'use client'; 

import React from 'react';
import Image from 'next/image';
import styles from '../../../styles/Home.module.css';
import { useTheme } from '../../../context/ThemeContext'; // Adjust path as needed

const Home = () => {
  const { theme } = useTheme();

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to <span className={styles.heroHighlight}>MindPal</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your companion for mental wellness and personal growth
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Start Your Journey</h2>
              <p className={styles.cardText}>
                Explore our various features designed to support your mental well-being:
              </p>
              <ul className={styles.cardList}>
                <li className={styles.cardListItem}>Chat with our AI companion</li>
                <li className={styles.cardListItem}>Join virtual support meetings</li>
                <li className={styles.cardListItem}>Read mental health articles</li>
                <li className={styles.cardListItem}>Listen to calming 8D music</li>
                <li className={styles.cardListItem}>Play mindfulness games</li>
              </ul>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.cardImage}>
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
                alt="Peaceful scenery"
                layout="fill"
                objectFit="cover"
                quality={100}
              />
            </div>
            <div className={styles.cardContent}>
              <h2 className={styles.cardTitle}>Daily Inspiration</h2>
              <p className={styles.cardQuote}>
                "The greatest glory in living lies not in never falling, but in rising every time we fall."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to improve your mental wellness?</h2>
        <button className={styles.ctaButton}>Get Started</button>
      </section>
    </div>
  );
};

export default Home;