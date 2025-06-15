import React from 'react';
import { MessageCircle, User, Newspaper, Gamepad2, Headphones } from 'lucide-react';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

function LandingPage() {
  const features = [
    { 
      title: 'AI Chatbot', 
      description: 'Get instant support and guidance from our AI-powered mental health chatbot, available 24/7.', 
      icon: <MessageCircle className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1617042375876-a13e36732a04?auto=format&fit=crop&q=80&w=800'
    },
    { 
      title: '1:1 Sessions', 
      description: 'Book personalized one-on-one sessions with certified mental health professionals.', 
      icon: <User className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1580894732930-0babd100d356?auto=format&fit=crop&q=80&w=800'
    },
    { 
      title: 'Mental Health Articles', 
      description: 'Stay informed with the latest mental health news, articles, and newsletters curated by experts.', 
      icon: <Newspaper className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'
    },
    { 
      title: 'Mental Health Games', 
      description: 'Engage in fun and therapeutic games designed to improve mental well-being and reduce stress.', 
      icon: <Gamepad2 className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&q=80&w=800'
    },
    { 
      title: '8D Music for Relaxation', 
      description: 'Immerse yourself in 8D audio experiences designed to relax your mind and enhance focus.', 
      icon: <Headphones className={styles.featureIcon} />,
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800'
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
            <Link href="/auth/register">
              <button className={styles.primaryButton}>Get Started</button>
            </Link>
            <Link href="/auth/login">
              <button className={styles.secondaryButton}>Sign In</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>Explore our Features</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.cardImage}>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className={styles.featureImage}
                  />
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.featureIconContainer}>
                    {feature.icon}
                  </div>
                  <h3 className={styles.cardTitle}>{feature.title}</h3>
                  <p className={styles.cardText}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Don't let stress take over your life</h2>
          <p className={styles.ctaSubtitle}>
            Start your journey to a healthier, happier you today
          </p>
          <Link href="/auth/register">
            <button className={styles.ctaButton}>Get Started</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;