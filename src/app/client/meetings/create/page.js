'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { CalendarIcon, ClockIcon, UsersIcon } from '@/components/Icons';
import styles from './create.module.css';

const CreateMeeting = () => {
    const { id } = useParams();
  const isEditMode = !!id;
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: 60,
    maxParticipants: 15,
    therapist: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/clt/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
          participants: 0,
          status: 'scheduled'
        }),
      });
      
      if (response.ok) {
        router.push('/client/meetings');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Create New Meeting</h1>
        <p className={styles.subheading}>Schedule a new virtual therapy session</p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionHeading}>Meeting Details</h2>
          <div className={styles.formGroup}>
            <label htmlFor="title">Meeting Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={styles.input}
              placeholder="e.g. Weekly Therapy Session"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              rows={4}
              placeholder="Add any details participants should know..."
            />
          </div>
        </div>
        
        <div className={styles.formSection}>
          <h2 className={styles.sectionHeading}>Date & Time</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Start Date & Time *</label>
              <div className={styles.inputWithIcon}>
                <CalendarIcon className={styles.inputIcon} />
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="duration">Duration (minutes) *</label>
              <div className={styles.inputWithIcon}>
                <ClockIcon className={styles.inputIcon} />
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="15"
                  max="240"
                  required
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.formSection}>
          <h2 className={styles.sectionHeading}>Participants</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="maxParticipants">Maximum Participants *</label>
              <div className={styles.inputWithIcon}>
                <UsersIcon className={styles.inputIcon} />
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  required
                  className={styles.input}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="therapist">Host/Therapist *</label>
              <input
                type="text"
                id="therapist"
                name="therapist"
                value={formData.therapist}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter therapist name"
              />
            </div>
          </div>
        </div>
        
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => router.push('/client/meetings')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMeeting;