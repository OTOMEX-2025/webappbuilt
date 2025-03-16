'use client';
import { useState } from 'react';
import styles from '../../../styles/Register.module.css';

export default function Register() {
  const [userType, setUserType] = useState('');

  const renderForm = () => {
    switch (userType) {
      case 'client':
        return (
          <form className={styles.form}>
            <input type="text" placeholder="Full Name" className={styles.input} required />
            <input type="email" placeholder="Email" className={styles.input} required />
            <input type="password" placeholder="Password" className={styles.input} required />
            <input type="text" placeholder="What are you struggling with?" className={styles.input} required />
            <button type="submit" className={styles.button}>Register as Client</button>
          </form>
        );
      case 'professional':
        return (
          <form className={styles.form}>
            <input type="text" placeholder="Full Name" className={styles.input} required />
            <input type="email" placeholder="Email" className={styles.input} required />
            <input type="password" placeholder="Password" className={styles.input} required />
            <input type="text" placeholder="License Number" className={styles.input} required />
            <input type="text" placeholder="Specialization" className={styles.input} required />
            <button type="submit" className={styles.button}>Register as Professional</button>
          </form>
        );
      case 'admin':
        return (
          <form className={styles.form}>
            <input type="text" placeholder="Full Name" className={styles.input} required />
            <input type="email" placeholder="Email" className={styles.input} required />
            <input type="password" placeholder="Password" className={styles.input} required />
            <input type="text" placeholder="Organization Name" className={styles.input} required />
            <button type="submit" className={styles.button}>Register as Admin</button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create an Account</h1>
      <div className={styles.selector}>
        <h2>Who are you?</h2>
        <div className={styles.options}>
          <button
            onClick={() => setUserType('client')}
            className={`${styles.optionButton} ${userType === 'client' ? styles.active : ''}`}
          >
            Client
          </button>
          <button
            onClick={() => setUserType('professional')}
            className={`${styles.optionButton} ${userType === 'professional' ? styles.active : ''}`}
          >
            Professional
          </button>
          <button
            onClick={() => setUserType('admin')}
            className={`${styles.optionButton} ${userType === 'admin' ? styles.active : ''}`}
          >
            Admin
          </button>
        </div>
      </div>
      {renderForm()}
      <p className={styles.link}>Already have an account? <a href="/auth/login">Login</a></p>
    </div>
  );
}