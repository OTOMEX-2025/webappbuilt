'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './Home2.module.css';
import { useTheme } from '../../../context/ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  const [highlights, setHighlights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await fetch('/api/clt/highlights');
        const data = await response.json();
        setHighlights(data);
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

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

      {/* Highlights Section */}
      <section className={styles.highlights}>
        {/* AI Chat Highlight */}
        {highlights?.aiChat && (
          <div className={styles.highlightCard}>
            <div className={styles.highlightContent}>
              <h2 className={styles.highlightTitle}>{highlights.aiChat.title}</h2>
              <p className={styles.highlightText}>{highlights.aiChat.description}</p>
              <div className={styles.featureGrid}>
                {highlights.aiChat.features.map((feature, index) => (
                  <div key={index} className={styles.featureItem}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className={styles.stats}>
                <span>Helped {highlights.aiChat.stats.usersHelped}+ users</span>
                <span>{highlights.aiChat.stats.conversations}+ conversations</span>
              </div>
              <button className={styles.ctaButton}>Try AI Companion</button>
            </div>
            <div className={styles.highlightImage}>
              <Image
                src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff"
                alt="AI Chatbot"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
        )}

        {/* Meetings Highlights */}
        <div className={styles.sectionTitle}>Upcoming Meetings</div>
        <div className={styles.meetingsGrid}>
          {highlights?.meetings?.upcoming.map((meeting) => (
            <div key={meeting.id} className={styles.meetingCard}>
              <div className={styles.meetingImage}>
                <Image
                  src={meeting.image}
                  alt={meeting.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.meetingContent}>
                <h3>{meeting.title}</h3>
                <p className={styles.meetingTherapist}>With {meeting.therapist}</p>
                <p className={styles.meetingDate}>
                  {new Date(meeting.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p>{meeting.description}</p>
                <div className={styles.meetingStats}>
                  <span>{meeting.participants}/{meeting.maxParticipants} spots filled</span>
                </div>
                <button className={styles.secondaryButton}>Join Meeting</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sectionTitle}>Recent Meetings</div>
        <div className={styles.meetingsGrid}>
          {highlights?.meetings?.past.map((meeting) => (
            <div key={meeting.id} className={styles.meetingCard}>
              <div className={styles.meetingImage}>
                <Image
                  src={meeting.image}
                  alt={meeting.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.meetingContent}>
                <h3>{meeting.title}</h3>
                <p className={styles.meetingTherapist}>With {meeting.therapist}</p>
                <p className={styles.meetingDate}>
                  {new Date(meeting.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p>{meeting.description}</p>
                {meeting.recordingAvailable && (
                  <button className={styles.secondaryButton}>Watch Recording</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* News Highlights */}
        <div className={styles.sectionTitle}>Latest News & Articles</div>
        <div className={styles.newsGrid}>
          {highlights?.news?.map((article) => (
            <div key={article.id} className={styles.newsCard}>
              <div className={styles.newsImage}>
                <Image
                  src={article.image}
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.newsContent}>
                <h3>{article.title}</h3>
                <p className={styles.newsMeta}>
                  {article.author} • {new Date(article.date).toLocaleDateString()}
                </p>
                <p>{article.summary}</p>
                <button className={styles.textButton}>Read More →</button>
              </div>
            </div>
          ))}
        </div>

        {/* Music Highlights */}
        <div className={styles.sectionTitle}>Relaxing Music Playlists</div>
        <div className={styles.musicGrid}>
          {highlights?.music?.map((playlist) => (
            <div key={playlist.id} className={styles.musicCard}>
              <div className={styles.musicImage}>
                <Image
                  src={playlist.image}
                  alt={playlist.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.musicContent}>
                <h3>{playlist.title}</h3>
                <p>{playlist.description}</p>
                <div className={styles.musicMeta}>
                  <span>{playlist.tracks.length} tracks</span>
                  <span>{playlist.duration}</span>
                </div>
                <button className={styles.secondaryButton}>Listen Now</button>
              </div>
            </div>
          ))}
        </div>

        {/* Games Highlights */}
        <div className={styles.sectionTitle}>Mindfulness Games</div>
        <div className={styles.gamesGrid}>
          {highlights?.games?.map((game) => (
            <div key={game.id} className={styles.gameCard}>
              <div className={styles.gameImage}>
                <Image
                  src={game.image}
                  alt={game.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.gameContent}>
                <h3>{game.title}</h3>
                <p>{game.description}</p>
                <div className={styles.gameMeta}>
                  <span>{game.category}</span>
                  <span>{game.duration} min</span>
                </div>
                <button className={styles.secondaryButton}>Play Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;