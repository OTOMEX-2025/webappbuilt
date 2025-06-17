"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import styles from '../../../styles/ResetPassword.module.css';

export default function ResetPassword() {
  const router = useRouter();
  const { resetPassword } = useUser();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await resetPassword(email);
      
      if (!result.success) {
        throw new Error(result.message || "Failed to send reset email");
      }
      
      setSuccess("If an account exists with this email, a reset link has been sent");
    } catch (error) {
      setError(error.message || "An error occurred while sending reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.resetBox}>
        <h1 className={styles.title}>Reset Password</h1>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <p className={styles.description}>
            Enter your email address and we'll send you a password reset link.
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
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className={styles.footer}>
          <Link href="/auth/login" className={styles.link}>
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}