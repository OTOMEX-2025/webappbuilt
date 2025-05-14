'use client';

import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import styles from './Chat.module.css';

const Chat = () => {
  const [message, setMessage] = useState('');

  const dummyMessages = [
    { type: 'bot', content: 'Hello! I\'m your MindPal AI companion. How are you feeling today?' },
    { type: 'user', content: 'I\'m feeling a bit anxious today.' },
    { type: 'bot', content: 'I understand that anxiety can be challenging. Would you like to talk about what\'s causing your anxiety, or would you prefer some relaxation techniques that might help?' },
    { type: 'user', content: 'Some relaxation techniques would be helpful.' },
    { type: 'bot', content: 'I\'d be happy to guide you through a simple breathing exercise. It\'s called the 4-7-8 technique. Would you like to try it?' }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>AI Chat Support</h1>
      <div className={styles.chatContainer}>
        <div className={styles.chatWindow}>
          <div className={styles.messagesContainer}>
            {dummyMessages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${msg.type === 'user' ? styles.userMessage : ''}`}
              >
                <div className={`${styles.avatar} ${
                  msg.type === 'bot' ? styles.botAvatar : styles.userAvatar
                }`}>
                  {msg.type === 'bot' ? (
                    <Bot size={20} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className={`${styles.messageContent} ${
                  msg.type === 'bot' ? styles.botMessage : styles.userMessageContent
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className={styles.inputField}
              />
              <button className={styles.sendButton}>
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;