'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import styles from './News.module.css';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/clt/news');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div className={styles.loading}>Loading articles...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Mental Health News & Articles</h1>
        <p>Stay informed with the latest research and insights on mental wellbeing</p>
        <Link href="/client/news/create" className={styles.createButton}>
          Create New Article
        </Link>
      </div>
      
      <div className={styles.articlesList}>
        {articles.map((article) => (
          <article key={article.id} className={styles.articleCard}>
            <Link href={`/client/news/${article.id}`} className={styles.articleLink}>
              <div className={styles.articleContent}>
                <img
                  src={article.image}
                  alt={article.title}
                  className={styles.articleImage}
                />
                <div className={styles.articleText}>
                  <div className={styles.articleHeader}>
                    <span className={styles.category}>{article.category}</span>
                    <span className={styles.readTime}>
                      <BookOpen className={styles.readTimeIcon} />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h2 className={styles.articleTitle}>
                    {article.title}
                  </h2>
                  
                  <p className={styles.articleExcerpt}>
                    {article.summary}
                  </p>
                  
                  <div className={styles.articleFooter}>
                    <span className={styles.author}>
                      By {article.author} • {article.date}
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
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;