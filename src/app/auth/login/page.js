'use client' ;
import React from 'react';
import styles from '../../../styles/Login.module.css';

function LoginPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome Back</h1>
      <form className={styles.form}>
        <input type="email" placeholder="Email" className={styles.input} required />
        <input type="password" placeholder="Password" className={styles.input} required />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      <p className={styles.link}>Don't have an account? <a href="/auth/register">Register</a></p>
    </div>
  );
}

export default LoginPage;
