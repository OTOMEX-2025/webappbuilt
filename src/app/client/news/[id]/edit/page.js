'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import styles from './ArticleForm.module.css';

const ArticleForm = () => {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    image: '',
    category: 'Research',
    tags: '',
    readTime: '5 min read'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchArticle = async () => {
        try {
          const response = await fetch(`/api/clt/news/${id}`);
          if (!response.ok) throw new Error('Failed to fetch article');
          const data = await response.json();
          setFormData({
            ...data,
            tags: data.tags.join(', ')
          });
        } catch (err) {
          setError(err.message);
        }
      };
      fetchArticle();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim())
      };

      const url = isEdit ? `/api/clt/news/${id}` : '/api/clt/news/create';
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        throw new Error(isEdit ? 'Failed to update article' : 'Failed to create article');
      }

      router.push(isEdit ? `/client/news/${id}` : '/client/news');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>{isEdit ? 'Edit Article' : 'Create New Article'}</h1>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={10}
            required
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Research">Research</option>
              <option value="Technology">Technology</option>
              <option value="Self-Help">Self-Help</option>
              <option value="News">News</option>
            </select>
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="readTime">Read Time</label>
            <input
              type="text"
              id="readTime"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => router.push(isEdit ? `/client/news/${id}` : '/client/news')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;