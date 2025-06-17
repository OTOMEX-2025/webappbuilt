"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import styles from '../../../styles/Register.module.css';

export default function RegisterPage() {
  const [userType, setUserType] = useState("client");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    licenseNumber: "",
    specialization: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await register({
        ...formData,
        userType
      });
      
      if (!result.success) {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1>Create Account</h1>
        {error && <p className={styles.error}>{error}</p>}
        
        <div className={styles.tabs}>
          <button 
            onClick={() => setUserType("client")}
            className={userType === "client" ? styles.active : ""}
          >
            Client
          </button>
          <button 
            onClick={() => setUserType("professional")}
            className={userType === "professional" ? styles.active : ""}
          >
            Professional
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          {userType === "professional" && (
            <>
              <input
                name="licenseNumber"
                placeholder="License Number"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                required
              />
              <input
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                required
              />
            </>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}