"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine } from 'react-icons/ri';
import styles from '../SessionsPage.module.css';

export default function NewSessionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    duration: '50 mins',
    type: 'Cognitive Behavioral Therapy',
    notes: ''
  });
  const [patients, setPatients] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/prof/patients');
        const data = await res.json();
        setPatients(data.active);
      } catch (err) {
        setError('Failed to load patients');
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const selectedPatient = patients.find(p => p.id == formData.patientId);
      
      if (!selectedPatient) {
        throw new Error('Please select a patient');
      }
      
      const response = await fetch('/api/prof/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          patient: selectedPatient.name,
          patientId: selectedPatient.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to create session');
      router.push('/prof/sessions');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.sessionsContainer}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <RiArrowLeftLine /> Back
        </button>
        <h1>Schedule New Session</h1>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.sessionForm}>
        <div className={styles.formGroup}>
          <label>Patient</label>
          <select
            className={styles.patientSelect}
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            <option value="">Select a patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.primaryDiagnosis})
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="duration">Duration</label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className={styles.formInput}
          >
            <option value="30 mins">30 minutes</option>
            <option value="45 mins">45 minutes</option>
            <option value="50 mins">50 minutes</option>
            <option value="60 mins">60 minutes</option>
            <option value="90 mins">90 minutes</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="type">Session Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className={styles.formInput}
          >
            <option value="Cognitive Behavioral Therapy">Cognitive Behavioral Therapy</option>
            <option value="Psychotherapy">Psychotherapy</option>
            <option value="Trauma Therapy">Trauma Therapy</option>
            <option value="Mood Stabilization">Mood Stabilization</option>
            <option value="Couples Therapy">Couples Therapy</option>
            <option value="Family Therapy">Family Therapy</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className={styles.formTextarea}
          />
        </div>
        
        <div className={styles.formButtons}>
          <button
            type="button"
            onClick={() => router.push('/prof/sessions')}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
          </button>
        </div>
      </form>
    </div>
  );
}