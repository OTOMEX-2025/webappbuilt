"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from '../../../styles/ResetPassword.module.css';

export default function ResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dummy verification code for demo purposes
  const DUMMY_CODE = "123456";

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // In a real app, you would send this email to your backend
      // For demo, we'll just simulate this
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate email format
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Please enter a valid email address");
      }
      
      // Simulate sending code to email
      console.log(`Sending verification code ${DUMMY_CODE} to ${email}`);
      
      setStep(2);
      setSuccess(`A verification code has been sent to ${email}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Validate code
      if (code !== DUMMY_CODE) {
        throw new Error("Invalid verification code");
      }
      
      setStep(3);
      setSuccess("Code verified. Please set your new password.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Validate passwords
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      // In a real app, you would send this to your backend to update
      console.log(`Password updated for ${email}`);
      
      setSuccess("Password updated successfully! Redirecting to login...");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.resetBox}>
        <h1 className={styles.title}>
          {step === 1 && "Reset Password"}
          {step === 2 && "Verify Code"}
          {step === 3 && "New Password"}
        </h1>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        {step === 1 && (
          <form onSubmit={handleSubmitEmail} className={styles.form}>
            <p className={styles.description}>
              Enter your email address and we'll send you a verification code.
            </p>
            
            <input
              type="email"
              placeholder="Email address"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className={styles.button}
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending..." : "Send Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmitCode} className={styles.form}>
            <p className={styles.description}>
              Enter the 6-digit code sent to {email}
            </p>
            
            <input
              type="text"
              placeholder="Verification code"
              className={styles.input}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
            />

            <button
              type="submit"
              className={styles.button}
              disabled={isLoading || !code}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <p className={styles.resend}>
              Didn't receive a code?{" "}
              <button 
                type="button" 
                className={styles.linkButton}
                onClick={handleSubmitEmail}
              >
                Resend code
              </button>
            </p>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmitNewPassword} className={styles.form}>
            <input
              type="password"
              placeholder="New password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />

            <input
              type="password"
              placeholder="Confirm new password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />

            <button
              type="submit"
              className={styles.button}
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <Link href="/auth/login" className={styles.link}>
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}