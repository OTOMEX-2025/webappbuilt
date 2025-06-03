import React from 'react';
import Image from 'next/image';
import styles from '../../../styles/Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
       
        <h1 className={styles.title}>Welcome to MindPal</h1>
        <p className={styles.subtitle}>
          Your companion for mental wellness and personal growth
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Start Your Journey</h2>
          <p className={styles.cardText}>
            Explore our various features designed to support your mental well-being:
          </p>
          <ul className={styles.cardList}>
            <li className={styles.cardListItem}> Chat with our AI companion</li>
            <li className={styles.cardListItem}> Join virtual support meetings</li>
            <li className={styles.cardListItem}> Read mental health articles</li>
            <li className={styles.cardListItem}> Listen to calming 8D music</li>
            <li className={styles.cardListItem}> Play mindfulness games</li>
          </ul>
        </div>

        <div className={styles.card}>
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
            alt="Peaceful scenery"
            className={styles.image}
          />
          <h2 className={styles.cardTitle}>Daily Inspiration</h2>
          <p className={styles.cardText}>
            "The greatest glory in living lies not in never falling, but in rising every time we fall."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;