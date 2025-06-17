"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import styles from '../../../styles/Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login({ email, password });
      
      if (!result.success) {
        setError(result.message);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <Image
            src="/MindPalLogo-removebg-preview.png"
            alt="Mind-Pal"
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