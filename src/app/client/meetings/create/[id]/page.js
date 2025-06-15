'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../create.module.css';

const EditMeeting = () => {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: 60,
    maxParticipants: 15,
    therapist: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/clt/meetings/${id}`);
        if (!response.ok) throw new Error('Meeting not found');
        const data = await response.json();
        
        setFormData({
          title: data.title,
          description: data.description,
          date: new Date(data.date).toISOString().slice(0, 16),
          duration: data.duration,
          maxParticipants: data.maxParticipants,
          therapist: data.therapist
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeeting();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/clt/meetings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action: 'update',
          ...formData,
          date: new Date(formData.date).toISOString()
        }),
      });
      
      if (response.ok) {
        router.push(`/client/meetings/${id}`);
      } else {
        throw new Error('Failed to update meeting');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1>Edit Meeting</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Date & Time</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="15"
              max="240"
              required
            />
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Max Participants</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              max="50"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Host/Therapist</label>
            <input
              type="text"
              name="therapist"
              value={formData.therapist}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => router.push(`/client/meetings/${id}`)}
          >
            Cancel
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMeeting;