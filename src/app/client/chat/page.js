'use client';

import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const Chat = () => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');

  const dummyMessages = [
    { type: 'bot', content: 'Hello! I\'m your MindPal AI companion. How are you feeling today?' },
    { type: 'user', content: 'I\'m feeling a bit anxious today.' },
    { type: 'bot', content: 'I understand that anxiety can be challenging. Would you like to talk about what\'s causing your anxiety, or would you prefer some relaxation techniques that might help?' },
    { type: 'user', content: 'Some relaxation techniques would be helpful.' },
    { type: 'bot', content: 'I\'d be happy to guide you through a simple breathing exercise. It\'s called the 4-7-8 technique. Would you like to try it?' }
  ];

  return (
    <div className={`flex flex-col w-screen h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Chat header */}
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} text-blue-600 mr-3`}>
                <Bot size={20} />
              </div>
              <h2 className="text-xl font-semibold">MindPal AI Companion</h2>
            </div>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {dummyMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${msg.type === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-blue-600 text-white'}`}>
                      {msg.type === 'bot' ? <Bot size={18} /> : <User size={18} />}
                    </div>
                    <div className={`mx-3 px-4 py-2 rounded-lg ${msg.type === 'bot' ? 
                      (theme === 'dark' ? 'bg-gray-700' : 'bg-white border border-gray-200') : 
                      (theme === 'dark' ? 'bg-blue-800' : 'bg-blue-600 text-white')}`}>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Input container */}
          <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 py-2 px-4 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button 
                className={`ml-2 p-2 rounded-full ${message ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}
                disabled={!message}
              >
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