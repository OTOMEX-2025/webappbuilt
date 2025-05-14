'use client';
import React from 'react';
import { BookOpen, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import styles from './News.module.css';

const News = () => {
  const articles = [
    {
      title: "Understanding and Managing Anxiety in Daily Life",
      excerpt: "Discover practical strategies for managing anxiety and building resilience in your everyday routine...",
      author: "Dr. Rachel Thompson",
      readTime: "5 min read",
      likes: 128,
      comments: 32,
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "The Science Behind Mindfulness Meditation",
      excerpt: "Recent studies show how mindfulness meditation can physically alter brain structure and reduce stress...",
      author: "Prof. David Anderson",
      readTime: "8 min read",
      likes: 245,
      comments: 56,
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Building Healthy Digital Habits",
      excerpt: "Learn how to maintain a balanced relationship with technology while protecting your mental health...",
      author: "Emma Martinez",
      readTime: "6 min read",
      likes: 189,
      comments: 43,
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=2000"
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mental Health News & Articles</h1>
      
      <div className={styles.articlesList}>
        {articles.map((article, index) => (
          <article key={index} className={styles.articleCard}>
            <div className={styles.articleContent}>
              <img
                src={article.image}
                alt={article.title}
                className={styles.articleImage}
              />
              <div className={styles.articleText}>
                <div className={styles.articleHeader}>
                  <span className={styles.category}>Mental Health</span>
                  <span className={styles.readTime}>
                    <BookOpen className={styles.readTimeIcon} />
                    {article.readTime}
                  </span>
                </div>
                
                <h2 className={styles.articleTitle}>
                  {article.title}
                </h2>
                
                <p className={styles.articleExcerpt}>
                  {article.excerpt}
                </p>
                
                <div className={styles.articleFooter}>
                  <span className={styles.author}>
                    By {article.author}
                  </span>
                  
                  <div className={styles.articleActions}>
                    <button className={styles.actionButton}>
                      <ThumbsUp className={styles.actionIcon} />
                      <span>{article.likes}</span>
                    </button>
                    <button className={styles.actionButton}>
                      <MessageSquare className={styles.actionIcon} />
                      <span>{article.comments}</span>
                    </button>
                    <button className={styles.shareButton}>
                      <Share2 className={styles.actionIcon} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default News;