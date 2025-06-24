"use client";
import { useState, useEffect, useRef } from 'react';
import EmotionAnalyzer from './EmotionAnalyzer';
import ResponseGenerator from './ResponseGenerator';
import TherapeuticTools from './TherapeuticTools';
import EmergencyHandler from './EmergencyHandler';
import SelfLearningEngine from './SelfLearningEngine';
import DynamicModuleManager from './DynamicModuleManager';
import TrainingScheduler from './TrainingScheduler';
import { useTheme } from '../../../context/ThemeContext';
import { getLocalStorage, setLocalStorage } from '../../../utils/storage';
import dynamic from 'next/dynamic';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();
  
  // Initialize core components
  const [emotionAnalyzer] = useState(new EmotionAnalyzer());
  const [responseGenerator] = useState(new ResponseGenerator());
  const [therapeuticTools] = useState(new TherapeuticTools());
  const [selfLearningEngine] = useState(new SelfLearningEngine());
  const [dynamicModuleManager] = useState(new DynamicModuleManager());
  const [trainingScheduler] = useState(
    new TrainingScheduler(selfLearningEngine, dynamicModuleManager)
  );


  // In your App component, modify the initializeChat function:
const initializeChat = () => {
  setMessages([{
    text: "Hello, I'm your mental health companion. How are you feeling today?",
    sender: 'bot',
    emotion: 'neutral',
    timestamp: new Date().toISOString()
  }]);
  
  // Only run on client side
  if (typeof window === 'undefined') return;
  
  trainingScheduler.start();
  
  // Safely load saved conversations
  try {
    const savedConversations = getLocalStorage("chatHistory")
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      if (Array.isArray(parsed)) {
        selfLearningEngine.memoryBuffer = parsed.slice(-100);
      }
    }
  } catch (e) {
    console.error('Failed to load conversation history:', e);
  }
};
  useEffect(() => {
    setIsClient(true);
    initializeChat();
  }, []);
  // Scroll to bottom and save conversations
useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Only save if we're on the client and have messages
  if (typeof window !== 'undefined' && messages.length > 1) {
    try {
      setLocalStorage("chatHistory", JSON.stringify(messages));
      selfLearningEngine.memoryBuffer = messages.slice(-100);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
}, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      text: input,
      sender: 'user',
      emotion: '',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Analyze emotion
    const emotions = emotionAnalyzer.analyze(input);
    userMessage.emotion = emotions[0];

    // Process response after short delay
    setTimeout(() => {
      // Handle emergency first
      if (emotions.includes('suicidal')) {
        const emergencyResponse = EmergencyHandler.handleEmergency();
        setMessages(prev => [...prev, {
          text: emergencyResponse.immediateResponse,
          sender: 'bot',
          emotion: 'emergency',
          timestamp: new Date().toISOString()
        }]);
        
        // Create emergency follow-up
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Would you like me to help you contact someone or do a grounding exercise?",
            sender: 'bot',
            emotion: 'emergency',
            timestamp: new Date().toISOString()
          }]);
        }, 2000);
        return;
      }

      // Generate response
      const response = responseGenerator.getResponse(emotions, messages);
      const botResponse = {
        text: response,
        sender: 'bot',
        emotion: emotions[0],
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);

      // Learn from this interaction
      selfLearningEngine.updateResponseModels([...messages, userMessage, botResponse], responseGenerator);
      selfLearningEngine.checkForNewModules([...messages, userMessage, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const startExercise = (moduleName) => {
    let exercise;
    
    if (dynamicModuleManager.activeModules[moduleName]) {
      exercise = dynamicModuleManager.activeModules[moduleName].getExercise();
    } else {
      // Fallback to basic exercises
      switch(moduleName) {
        case 'breathing':
          exercise = therapeuticTools.breathingExercise();
          break;
        case 'gratitude':
          exercise = { instructions: therapeuticTools.gratitudePrompt() };
          break;
        default:
          exercise = { instructions: "Let's focus on the present moment." };
      }
    }
    
    setMessages(prev => [...prev, {
      text: exercise.instructions,
      sender: 'bot',
      emotion: 'exercise',
      timestamp: new Date().toISOString()
    }]);
  };

  // Get available tools, marking which are newly discovered
  const availableTools = [
    ...Object.entries(dynamicModuleManager.activeModules).map(([name]) => ({
      name,
      isNew: false
    })),
    ...dynamicModuleManager.availableModules
      .filter(m => !dynamicModuleManager.activeModules[m])
      .map(name => ({ name, isNew: true }))
  ];

  // Theme-based styles
  const containerStyles = {
    light: 'bg-gray-50 text-gray-900',
    dark: 'bg-gray-900 text-gray-100'
  };

  const headerStyles = {
    light: 'bg-indigo-600 text-white',
    dark: 'bg-indigo-800 text-indigo-100'
  };

  const messageStyles = {
    light: {
      user: 'bg-indigo-500 text-white',
      bot: 'bg-white text-gray-800 border border-gray-200',
      emergency: 'bg-red-100 text-gray-800 border-l-4 border-red-500',
      exercise: 'bg-green-50 text-gray-800 border-l-4 border-green-500'
    },
    dark: {
      user: 'bg-indigo-700 text-white',
      bot: 'bg-gray-800 text-gray-100 border border-gray-700',
      emergency: 'bg-red-900 text-white border-l-4 border-red-500',
      exercise: 'bg-green-900 text-white border-l-4 border-green-500'
    }
  };

  const toolbarStyles = {
    light: 'bg-gray-100 border-gray-200',
    dark: 'bg-gray-800 border-gray-700'
  };

  const toolButtonStyles = {
    light: {
      default: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      new: 'bg-purple-100 text-purple-800 hover:bg-purple-200'
    },
    dark: {
      default: 'bg-blue-900 text-blue-100 hover:bg-blue-800',
      new: 'bg-purple-900 text-purple-100 hover:bg-purple-800'
    }
  };

  const inputAreaStyles = {
    light: 'bg-white border-gray-200',
    dark: 'bg-gray-800 border-gray-700'
  };

  const inputStyles = {
    light: 'text-black border-gray-300 focus:ring-indigo-500',
    dark: 'text-white bg-gray-700 border-gray-600 focus:ring-indigo-400'
  };

  const buttonStyles = {
    light: 'bg-indigo-600 hover:bg-indigo-700',
    dark: 'bg-indigo-700 hover:bg-indigo-800'
  };

  return (
    <div className={`flex flex-col h-[115] w-[1149vh] max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden ${containerStyles[theme]}`}>
      {/* Header */}
      <header className={`p-4 shadow-md ${headerStyles[theme]}`}>
        <h1 className="text-xl font-bold">Mental Health Companion</h1>
        <p className="text-sm">Your private, self-learning emotional support</p>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div 
            key={`${index}-${msg.timestamp}`} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                msg.sender === 'user' 
                  ? messageStyles[theme].user
                  : msg.emotion === 'emergency' 
                    ? messageStyles[theme].emergency
                    : msg.emotion === 'exercise'
                      ? messageStyles[theme].exercise
                      : messageStyles[theme].bot
              }`}
            >
              <p className="whitespace-pre-line break-words">{msg.text}</p>
              {msg.emotion && msg.sender === 'user' && (
                <span className="text-xs opacity-70 mt-1 block">
                  Detected: {msg.emotion}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Toolbar */}
      <div className={`border-t p-2 overflow-x-auto ${toolbarStyles[theme]}`}>
        <div className="flex space-x-2">
          {availableTools.map(({name, isNew}) => (
            <button 
              key={name}
              onClick={() => startExercise(name)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm ${
                isNew 
                  ? toolButtonStyles[theme].new
                  : toolButtonStyles[theme].default
              }`}
            >
              {name.replace(/([A-Z])/g, ' $1').trim()}
              {isNew && ' (New)'}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className={`border-t p-4 ${inputAreaStyles[theme]}`}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="How are you feeling today?"
            className={`flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 ${inputStyles[theme]}`}
          />
          <button
            onClick={handleSendMessage}
            className={`text-white rounded-full px-4 py-2 focus:outline-none ${buttonStyles[theme]}`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}