"use client";
import { useState } from "react";
import styles from "../../../styles/Register.module.css";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userType }),
      });
  
      const result = await response.json();
      console.log("Response:", result); // Debugging: See what's returned
  
      if (response.ok) {
        alert("Registration successful!");
        router.push("/auth/login");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("An error occurred while registering");
    } finally {
      setLoading(false);
    }
  };
  
  const renderForm = () => {
    switch (userType) {
      case "client":
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formTitle}>Client Registration</h2>
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
            <textarea
              placeholder="What are you struggling with?"
              className={styles.textarea}
              required
              name="strugglingWith"
              value={formData.strugglingWith}
              onChange={handleInputChange}
              rows={3}
            />
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Submitting..." : "Register as Client"}
            </button>
          </form>
        );
      case "professional":
        return (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formTitle}>Professional Registration</h2>
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
            <input
              type="text"
              placeholder="Organization (Optional)"
              className={styles.input}
              name="organizationName"
              value={formData.organizationName}
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
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {userType === "professional" && (
          <div className={styles.imageContainer}>
            <div className={styles.imageOverlay}></div>
            <div className={styles.imageContent}>
              <h2>Join Our Network of Professionals</h2>
              <p>
                Connect with clients seeking your expertise and grow your
                practice with our platform.
              </p>
            </div>
          </div>
        )}

        <div
          className={`${styles.formContainer} ${
            userType === "professional" ? styles.professionalActive : ""
          }`}
        >
          <div className={styles.header}>
            <h1 className={styles.title}>Create an Account</h1>
            <div className={styles.selector}>
              <div className={styles.options}>
                <button
                  onClick={() => setUserType("client")}
                  className={`${styles.optionButton} ${
                    userType === "client" ? styles.active : ""
                  }`}
                >
                  I&apos;m a Client
                </button>
                <button
                  onClick={() => setUserType("professional")}
                  className={`${styles.optionButton} ${
                    userType === "professional" ? styles.active : ""
                  }`}
                >
                  I&apos;m a Professional
                </button>
              </div>
            </div>
          </div>

          {renderForm()}
          {error && <p className={styles.error}>{error}</p>}
          <p className={styles.link}>
            Already have an account? <a href="/auth/login">Login</a>
          </p>
        </div>

        {userType !== "professional" && (
          <div className={styles.imageContainer}>
            <div className={styles.imageOverlay}></div>
            <div className={styles.imageContent}>
              <h2>Find the Right Professional for You</h2>
              <p>
                Get matched with qualified professionals who can help you with
                your specific needs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}