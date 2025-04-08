'use client';

import { useState } from 'react';
import styles from './ChatBot.module.css';

export default function ChatBotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.response }; // Directly access the clean response text
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' },
      ]);
    }finally{
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🧠 Mental Wellness Chatbot</h1>

      <div className={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${
              msg.sender === 'user' ? styles.userMessage : styles.botMessage
            }`}
          >
            {msg.text}
            {loading && idx === messages.length - 1 && msg.sender === 'bot' && <span className={styles.cursor}>|</span>}
          </div>
        ))}
      </div>

      <form
        className={styles.inputForm}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          className={styles.input}
          placeholder="How are you feeling today?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
