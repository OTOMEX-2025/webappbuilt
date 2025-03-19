"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../../styles/Login.module.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
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
            width={150} // Fixed width
            height={150} // Fixed height
            priority // Ensures faster loading
          />
        </div>

        <h1 className={styles.title}>Sign in</h1>

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
