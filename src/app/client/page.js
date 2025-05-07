"use client";
import { useRouter } from "next/navigation";

export default function ClientsPage() {
  const router = useRouter();
  
  return (
    <div className="dashboard">
      <h1>Welcome to MindPal</h1>
      <div className="features">
        <div onClick={() => router.push("/clients/chat")}>AI Chat</div>
        <div onClick={() => router.push("/clients/meetings")}>Meetings</div>
      </div>
    </div>
  );
}