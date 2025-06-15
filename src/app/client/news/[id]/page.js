'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen, ThumbsUp, MessageSquare, Share2, Edit, Trash2 } from 'lucide-react';
import styles from './Article.module.css';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/clt/news/${id}`);
        if (!response.ok) throw new Error('Article not found');
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`/api/clt/news/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete article');
        window.location.href = '/client/news';
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div className={styles.loading}>Loading article...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.articleHeader}>
        <Link href="/client/news" className={styles.backLink}>
          ← Back to News
        </Link>
        <div className={styles.articleActions}>
          <Link href={`/client/news/${id}/edit`} className={styles.editButton}>
            <Edit size={16} /> Edit
          </Link>
          <button onClick={handleDelete} className={styles.deleteButton}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <article className={styles.article}>
        <div className={styles.articleMeta}>
          <span className={styles.category}>{article.category}</span>
          <span className={styles.date}>{article.date}</span>
          <span className={styles.readTime}>
            <BookOpen size={16} /> {article.readTime}
          </span>
        </div>

        <h1 className={styles.articleTitle}>{article.title}</h1>
        
        <p className={styles.articleSummary}>{article.summary}</p>
        
        <div className={styles.articleImageContainer}>
          <img
            src={article.image}
            alt={article.title}
            className={styles.articleImage}
          />
        </div>

        <div className={styles.articleContent}>
          {article.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className={styles.articleParagraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className={styles.articleFooter}>
          <div className={styles.authorInfo}>
            <p className={styles.author}>Written by {article.author}</p>
          </div>
          
          <div className={styles.tags}>
            {article.tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
          
          <div className={styles.socialActions}>
            <button className={styles.actionButton}>
              <ThumbsUp size={20} /> Like ({article.likes})
            </button>
            <button className={styles.actionButton}>
              <MessageSquare size={20} /> Comment ({article.comments})
            </button>
            <button className={styles.actionButton}>
              <Share2 size={20} /> Share
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;