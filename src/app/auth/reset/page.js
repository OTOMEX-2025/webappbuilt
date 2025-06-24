"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import styles from '../../../styles/ResetPassword.module.css';

export default function ResetPassword() {
  const router = useRouter();
  const { resetPassword, updatePassword } = useUser();
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await resetPassword(email);
      
      if (!result.success) {
        throw new Error(result.message || "Failed to send reset code");
      }
      
      setStep(2);
      setSuccess(`A verification code has been sent to ${email}`);
    } catch (err) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Just proceed to next step - actual verification happens in updatePassword
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
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      const result = await updatePassword(email, code, newPassword);
      
      if (!result.success) {
        throw new Error(result.message || "Failed to reset password");
      }
      
      setSuccess("Password updated successfully! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to update password");
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
              Enter your email address and we&pos;ll send you a verification code.
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
              Didn&pos;t receive a code?{" "}
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