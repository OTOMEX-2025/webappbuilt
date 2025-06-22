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

  // Set client-side flag and initialize
  useEffect(() => {
    setIsClient(true);
    initializeChat();
  }, []);

  const initializeChat = () => {
    setMessages([{
      text: "Hello, I'm your mental health companion. How are you feeling today?",
      sender: 'bot',
      emotion: 'neutral',
      timestamp: new Date().toISOString()
    }]);
    
    if (typeof window !== 'undefined') {
      trainingScheduler.start();
      
      // Load any saved conversations
      const savedConversations = localStorage.getItem('chatHistory');
      if (savedConversations) {
        try {
          const parsed = JSON.parse(savedConversations);
          if (Array.isArray(parsed)) {
            selfLearningEngine.memoryBuffer = parsed.slice(-100);
          }
        } catch (e) {
          console.error('Failed to load conversation history:', e);
        }
      }
    }
  };

  // Scroll to bottom and save conversations
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (messages.length > 1 && typeof window !== 'undefined') {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
      selfLearningEngine.memoryBuffer = messages.slice(-100);
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

  return (
    <div className="flex flex-col h-[90vh] w-[115vh] max-w-6xl mx-auto bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <header className={`${ theme === "dark" ? "bg-gray-600 text-white70/50" :  "bg-indigo-600 text-white"} p-4 shadow-md`}>
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
                  ? 'bg-indigo-500 text-white' 
                  : msg.emotion === 'emergency' 
                    ? 'bg-red-100 border-l-4 border-red-500 text-black'
                    : msg.emotion === 'exercise'
                      ? 'bg-green-50 border-l-4 border-green-500 text-black'
                      : 'bg-white border border-gray-200 text-black'
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
      <div className="border-t border-gray-200 p-2 bg-gray-100 overflow-x-auto">
        <div className="flex space-x-2">
          {availableTools.map(({name, isNew}) => (
            <button 
              key={name}
              onClick={() => startExercise(name)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-sm ${
                isNew 
                  ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {name.replace(/([A-Z])/g, ' $1').trim()}
              {isNew && ' (New)'}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="How are you feeling today?"
            className="flex-1 text-black border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 text-white rounded-full px-4 py-2 hover:bg-indigo-700 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}