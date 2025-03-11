import React from 'react';
import { Heart, Brain, Cog as Yoga, BookOpen, Users } from 'lucide-react';
import styles from '../styles/Home.module.css';

function App() {
  const features = [
    { 
      title: '1:1 Coaching', 
      description: 'Get personalized guidance from a professional', 
      icon: <Users className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&q=80&w=800'
    },
    { 
      title: 'Physical Health', 
      description: 'Stay active with workouts, yoga, and more', 
      icon: <Heart className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800'
    },
    { 
      title: 'Meditation', 
      description: 'Calm your mind with guided meditation', 
      icon: <Brain className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&q=80&w=800'
    },
    { 
      title: 'Journaling', 
      description: 'Reflect and relax with daily prompts', 
      icon: <BookOpen className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800'
    },
    { 
      title: 'Yoga', 
      description: 'Improve flexibility, strength, and balance', 
      icon: <Yoga className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=800'
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1920"
            alt="Peaceful meditation background"
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to <span className={styles.heroHighlight}>Mind-Pal</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Your Mental Health is our Priority
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton}>Get Started</button>
            <button className={styles.secondaryButton}>Sign In</button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>Explore our Features</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureImageContainer}>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className={styles.featureImage}
                  />
                </div>
                <div className={styles.featureContent}>
                  <div className={styles.featureIconContainer}>
                    {feature.icon}
                  </div>
                  <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                  <p className={styles.featureCardDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Don't let stress take over your life</h2>
          <p className={styles.ctaSubtitle}>
            Start your journey to a healthier, happier you today
          </p>
          <button className={styles.ctaButton}>Get Started</button>
        </div>
      </section>
    </div>
  );
}

export default App;