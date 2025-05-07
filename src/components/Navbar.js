"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  
  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  }

  return (
    <header className="navbar">
      <div className="logo">MindPal</div>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}