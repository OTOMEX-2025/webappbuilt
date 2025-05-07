"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link href="/clients">Dashboard</Link>
      <Link href="/clients/chat">AI Chat</Link>
      <Link href="/clients/meetings">Meetings</Link>
    </aside>
  );
}