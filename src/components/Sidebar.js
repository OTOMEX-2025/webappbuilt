"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link href="/client/dashboard">Dashboard</Link>
      <Link href="/client/chat">AI Chat</Link>
      <Link href="/client/meetings">Meetings</Link>
      <Link href="/client/music">News And Articles</Link>
      <Link href="/client/music">Music</Link>
    </aside>
  );
}