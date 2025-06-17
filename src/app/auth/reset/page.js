"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import styles from '../../../styles/ResetPassword.module.css';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { resetPassword } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await resetPassword(email);
      if (!result.success) {
        throw new Error(result.message);
      }
      setSuccess("Password reset instructions sent to your email");
    } catch (error) {
      setError(error.message || "Failed to send reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.resetBox}>
        <h1>Reset Password</h1>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <a href="/auth/login">Back to login</a>
      </div>
    </div>
  );
}