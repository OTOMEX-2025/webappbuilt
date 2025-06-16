'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Video, Mic, MicOff, VideoOff, PhoneOff, ScreenShare, Monitor, MessageSquare, Users, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const MeetingRoom = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeView, setActiveView] = useState('video');
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/clt/meetings/${id}`);
        if (!response.ok) {
          throw new Error('Meeting not found');
        }
        const data = await response.json();
        setMeeting(data);
        
        if (data.status !== 'scheduled') {
          setError('This meeting is not available to join');
          return;
        }
        
        const joinResponse = await fetch('/api/clt/meetings/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        if (!joinResponse.ok) {
          throw new Error('Failed to join meeting');
        }
        
        simulateParticipants(data.therapist);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeeting();
    
    return () => {
      // Cleanup
    };
  }, [id]);

  const simulateParticipants = (therapistName) => {
    const dummyParticipants = [
      { id: 'host', name: therapistName, isHost: true, isMuted: false, isVideoOn: true },
      { id: 'user1', name: 'Alex Johnson', isHost: false, isMuted: true, isVideoOn: true },
      { id: 'user2', name: 'Sam Wilson', isHost: false, isMuted: true, isVideoOn: false },
      { id: 'user3', name: 'Taylor Smith', isHost: false, isMuted: false, isVideoOn: true }
    ];
    
    const currentUser = { 
      id: 'current-user', 
      name: 'You', 
      isHost: false, 
      isMuted, 
      isVideoOn: !isVideoOff 
    };
    
    setParticipants([currentUser, ...dummyParticipants]);
    
    const dummyMessages = [
      { id: 1, sender: therapistName, text: 'Welcome everyone! How are you feeling today?', time: '2:00 PM' },
      { id: 2, sender: 'Alex Johnson', text: 'Doing okay, thanks for asking.', time: '2:02 PM' },
      { id: 3, sender: 'Sam Wilson', text: 'A bit anxious but glad to be here.', time: '2:03 PM' }
    ];
    setChatMessages(dummyMessages);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 'You',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessage('');
  };

  const leaveMeeting = () => {
    router.push('/client/meetings');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setParticipants(prev => prev.map(p => 
      p.id === 'current-user' ? { ...p, isMuted: !isMuted } : p
    ));
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    setParticipants(prev => prev.map(p => 
      p.id === 'current-user' ? { ...p, isVideoOn: !isVideoOff } : p
    ));
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen w-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen w-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="mb-6">{error}</p>
            <button 
              onClick={() => router.push('/client/meetings')} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Meetings
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className={`min-h-screen min-w-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h2 className="text-2xl font-bold mb-4">Meeting Not Found</h2>
            <button 
              onClick={() => router.push('/client/meetings')} 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Meetings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen min-w-screen flex flex-col ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`py-4 px-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{meeting?.title}</h1>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <Users size={16} /> {participants.length} participants
                </span>
                <span className="text-sm">
                  Host: {meeting?.therapist}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row h-full gap-6">
          {/* Video Grid */}
          <div className={`flex-1 ${activeView !== 'video' ? 'hidden' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Main video */}
              <div className="col-span-1 md:col-span-2 bg-gray-800 rounded-lg p-4 flex flex-col">
                <div className="flex-1 flex items-center justify-center relative">
                  {isScreenSharing ? (
                    <div className="text-center">
                      <Monitor size={48} className="mx-auto text-blue-400 mb-2" />
                      <p>Screen Sharing</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      {isVideoOff ? (
                        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl mx-auto mb-4">
                          {participants.find(p => p.id === 'current-user')?.name.charAt(0)}
                        </div>
                      ) : (
                        <Video size={48} className="mx-auto text-blue-400 mb-2" />
                      )}
                    </div>
                  )}
                </div>
                <div className="text-center mt-2">
                  <span className="font-medium">{isScreenSharing ? 'Your Screen' : 'You'}</span>
                  {isMuted && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-700 text-xs rounded-full">
                      Muted
                    </span>
                  )}
                </div>
              </div>
              
              {/* Participants videos */}
              {participants
                .filter(p => p.id !== 'current-user')
                .map((participant) => (
                  <div key={participant.id} className="bg-gray-800 rounded-lg p-4 flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      {!participant.isVideoOn ? (
                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl">
                          {participant.name.charAt(0)}
                        </div>
                      ) : (
                        <Video size={32} className="text-blue-400" />
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <span className="font-medium">{participant.name}</span>
                      {participant.isHost && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          Host
                        </span>
                      )}
                      {participant.isMuted && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-700 text-xs rounded-full">
                          Muted
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          {/* Chat View */}
          <div className={`w-full lg:w-80 ${activeView !== 'chat' ? 'hidden' : ''} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md flex flex-col`}>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="font-semibold">Meeting Chat</h2>
              <button 
                className="p-1 rounded-full hover:bg-gray-700"
                onClick={() => setActiveView('video')}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`mb-4 ${msg.sender === 'You' ? 'text-right' : ''}`}
                >
                  <div className={`inline-block p-3 rounded-lg ${msg.sender === 'You' 
                    ? 'bg-blue-600 text-white' 
                    : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {msg.sender !== 'You' && msg.sender}
                    </div>
                    <p>{msg.text}</p>
                    <div className="text-xs mt-1 opacity-70">
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className={`flex-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
          
          {/* Participants View */}
          <div className={`w-full lg:w-80 ${activeView !== 'participants' ? 'hidden' : ''} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="font-semibold">Participants ({participants.length})</h2>
              <button 
                className="p-1 rounded-full hover:bg-gray-700"
                onClick={() => setActiveView('video')}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {participant.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium flex items-center">
                      {participant.name}
                      {participant.isHost && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          Host
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-400 mt-1">
                      {participant.isMuted && (
                        <span className="flex items-center gap-1">
                          <MicOff size={12} /> Muted
                        </span>
                      )}
                      {!participant.isVideoOn && (
                        <span className="flex items-center gap-1">
                          <VideoOff size={12} /> Camera Off
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className={`py-3 px-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-t border-gray-700`}>
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex gap-4">
              <button 
                className={`flex flex-col items-center p-2 rounded-lg ${isMuted ? 'bg-red-600 text-white' : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                onClick={toggleMute}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                <span className="text-xs mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
              
              <button 
                className={`flex flex-col items-center p-2 rounded-lg ${isVideoOff ? 'bg-red-600 text-white' : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                onClick={toggleVideo}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                <span className="text-xs mt-1">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
              </button>
              
              <button 
                className={`flex flex-col items-center p-2 rounded-lg ${isScreenSharing ? 'bg-blue-600 text-white' : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                <ScreenShare size={20} />
                <span className="text-xs mt-1">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
              </button>
            </div>
            
            <div className="flex gap-4">
              <button 
                className={`flex flex-col items-center p-2 rounded-lg ${activeView === 'participants' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveView(activeView === 'participants' ? 'video' : 'participants')}
              >
                <Users size={20} />
                <span className="text-xs mt-1">Participants</span>
              </button>
              
              <button 
                className={`flex flex-col items-center p-2 rounded-lg ${activeView === 'chat' ? 'bg-blue-600 text-white' : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveView(activeView === 'chat' ? 'video' : 'chat')}
              >
                <MessageSquare size={20} />
                <span className="text-xs mt-1">Chat</span>
              </button>
            </div>
            
            <button 
              className="flex flex-col items-center p-2 rounded-lg bg-red-600 text-white"
              onClick={leaveMeeting}
            >
              <PhoneOff size={20} />
              <span className="text-xs mt-1">Leave</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;