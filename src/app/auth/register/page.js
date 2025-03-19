"use client";
import { useState } from "react";
import styles from "../../../styles/Register.module.css";

export default function Register() {
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    licenseNumber: "",
    specialization: "",
    organizationName: "",
    strugglingWith: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userType,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        // Optionally, redirect to another page, e.g., login
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while registering");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (userType) {
      case "client":
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Full Name"
              className={styles.input}
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              required
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="What are you struggling with?"
              className={styles.input}
              required
              name="strugglingWith"
              value={formData.strugglingWith}
              onChange={handleInputChange}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Submitting..." : "Register as Client"}
            </button>
          </form>
        );
      case "professional":
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Full Name"
              className={styles.input}
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              required
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="License Number"
              className={styles.input}
              required
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Specialization"
              className={styles.input}
              required
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Submitting..." : "Register as Professional"}
            </button>
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
            onClick={() => setUserType("client")}
            className={`${styles.optionButton} ${
              userType === "client" ? styles.active : ""
            }`}
          >
            Client
          </button>
          <button
            onClick={() => setUserType("professional")}
            className={`${styles.optionButton} ${
              userType === "professional" ? styles.active : ""
            }`}
          >
            Professional
          </button>
        </div>
      </div>
      {renderForm()}
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.link}>
        Already have an account? <a href="/auth/login">Login</a>
      </p>
    </div>
  );
}