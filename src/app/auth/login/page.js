"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct router import
import Image from "next/image";
import Link from "next/link";
import styles from "../../../styles/Login.module.css";

export default function LoginPage() {
  const router = useRouter(); // Hook for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // To handle errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error state

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token (use secure storage in production)
      localStorage.setItem("token", data.token);

      // Redirect to clients page after login
      router.push("/clients"); // Changed from /dashboard to /clients
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.decorativeLeft}></div>
      <div className={styles.decorativeRight}></div>

      <div className={styles.loginBox}>
        {/* Logo */}
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

        {/* Error Message */}
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
            Don&apos;t have an account?{" "}
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