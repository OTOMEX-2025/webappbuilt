"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from '../../../styles/Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login without backend
    setTimeout(() => {
      // For demo purposes - just check if fields are filled
      if (email && password) {
        // Store a dummy token
        localStorage.setItem("token", "demo-token");
        router.push('/client/dashboard', '/home');
 // Redirect to client dashboard
      } else {
        setError("Please fill in all fields");
      }
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };

  return (
    <main className={styles.container}>
      <div className={styles.decorativeLeft}></div>
      <div className={styles.decorativeRight}></div>

      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <Image
            src="/WhatsApp_Image_2025-03-18_at_12.19.57-removebg-preview.png"
            alt="Your Logo"
            width={150}
            height={150}
            priority
          />
        </div>

        <h1 className={styles.title}>Sign in</h1>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account?{" "}
            <Link href="/auth/register" className={styles.link}>
              Sign up
            </Link>
          </p>
          <p>
            Forgot your password?{" "}
            <Link href="/auth/reset" className={styles.link}>
              Reset here
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.bottomLinks}>
        <Link href="/security" className={styles.link}>
          Security
        </Link>
        <Link href="/legal" className={styles.link}>
          Legal
        </Link>
        <Link href="/privacy" className={styles.link}>
          Privacy
        </Link>
      </div>
    </main>
  );
}