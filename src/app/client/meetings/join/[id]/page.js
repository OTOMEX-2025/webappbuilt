'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Video, Mic, MicOff, VideoOff, PhoneOff, ScreenShare, Monitor, MessageSquare, Users } from 'lucide-react';
import styles from './join.module.css';

const MeetingRoom = () => {
  const router = useRouter();
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeView, setActiveView] = useState('video'); // 'video' or 'chat' or 'participants'
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
        
        // Only allow joining if it's upcoming
        if (data.status !== 'scheduled') {
          setError('This meeting is not available to join');
          return;
        }
        
        // Join the meeting
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
        
        // Simulate participants
        simulateParticipants(data.therapist);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeeting();
    
    return () => {
      // Cleanup or leave meeting if needed
    };
  }, [id]);

  const simulateParticipants = (therapistName) => {
    // Simulate participants joining
    const dummyParticipants = [
      { id: 'host', name: therapistName, isHost: true, isMuted: false, isVideoOn: true },
      { id: 'user1', name: 'Alex Johnson', isHost: false, isMuted: true, isVideoOn: true },
      { id: 'user2', name: 'Sam Wilson', isHost: false, isMuted: true, isVideoOn: false },
      { id: 'user3', name: 'Taylor Smith', isHost: false, isMuted: false, isVideoOn: true }
    ];
    
    // Add current user
    const currentUser = { 
      id: 'current-user', 
      name: 'You', 
      isHost: false, 
      isMuted, 
      isVideoOn: !isVideoOff 
    };
    
    setParticipants([currentUser, ...dummyParticipants]);
    
    // Simulate chat messages
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
    // Update current user in participants
    setParticipants(prev => prev.map(p => 
      p.id === 'current-user' ? { ...p, isMuted: !isMuted } : p
    ));
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // Update current user in participants
    setParticipants(prev => prev.map(p => 
      p.id === 'current-user' ? { ...p, isVideoOn: !isVideoOff } : p
    ));
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading meeting details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => router.push('/client/meetings')} className={styles.backButton}>
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Meeting Not Found</h2>
          <button onClick={() => router.push('/client/meetings')} className={styles.backButton}>
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.meetingTitle}>{meeting?.title}</h1>
          <div className={styles.meetingInfo}>
            <span className={styles.infoItem}>
              <Users size={16} /> {participants.length} participants
            </span>
            <span className={styles.infoItem}>
              Host: {meeting?.therapist}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.mainContent}>
        {/* Video Grid */}
        <div className={`${styles.videoSection} ${activeView !== 'video' ? styles.hidden : ''}`}>
          <div className={styles.videoGrid}>
            {/* Main video (screen share or host) */}
            <div className={styles.mainVideo}>
              <div className={styles.videoContainer}>
                {isScreenSharing ? (
                  <div className={styles.screenShare}>
                    <Monitor size={48} />
                    <p>Screen Sharing</p>
                  </div>
                ) : (
                  <div className={styles.userVideo}>
                    {isVideoOff ? (
                      <div className={styles.avatar}>
                        {participants.find(p => p.id === 'current-user')?.name.charAt(0)}
                      </div>
                    ) : (
                      <Video size={48} />
                    )}
                  </div>
                )}
                <div className={styles.videoLabel}>
                  <span>{isScreenSharing ? 'Your Screen' : 'You'}</span>
                  {isMuted && <span className={styles.mutedBadge}>Muted</span>}
                </div>
              </div>
            </div>
            
            {/* Participants videos */}
            {participants
              .filter(p => p.id !== 'current-user')
              .map((participant) => (
                <div key={participant.id} className={styles.participantVideo}>
                  <div className={styles.videoContainer}>
                    {!participant.isVideoOn ? (
                      <div className={styles.avatar}>
                        {participant.name.charAt(0)}
                      </div>
                    ) : (
                      <Video size={32} />
                    )}
                    <div className={styles.videoLabel}>
                      <span>{participant.name}</span>
                      {participant.isHost && <span className={styles.hostBadge}>Host</span>}
                      {participant.isMuted && <span className={styles.mutedBadge}>Muted</span>}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        {/* Chat View */}
        <div className={`${styles.chatSection} ${activeView !== 'chat' ? styles.hidden : ''}`}>
          <div className={styles.chatHeader}>
            <h2>Meeting Chat</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setActiveView('video')}
            >
              Close
            </button>
          </div>
          
          <div className={styles.chatMessages}>
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`${styles.message} ${msg.sender === 'You' ? styles.myMessage : ''}`}>
                <div className={styles.messageHeader}>
                  <strong>{msg.sender}</strong>
                  <span className={styles.messageTime}>{msg.time}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className={styles.chatForm}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className={styles.messageInput}
            />
            <button type="submit" className={styles.sendButton}>
              Send
            </button>
          </form>
        </div>
        
        {/* Participants View */}
        <div className={`${styles.participantsSection} ${activeView !== 'participants' ? styles.hidden : ''}`}>
          <div className={styles.participantsHeader}>
            <h2>Participants ({participants.length})</h2>
            <button 
              className={styles.closeButton}
              onClick={() => setActiveView('video')}
            >
              Close
            </button>
          </div>
          
          <div className={styles.participantsList}>
            {participants.map((participant) => (
              <div key={participant.id} className={styles.participant}>
                <div className={styles.participantAvatar}>
                  {participant.name.charAt(0)}
                </div>
                <div className={styles.participantInfo}>
                  <div className={styles.participantName}>
                    {participant.name}
                    {participant.isHost && <span className={styles.hostBadge}>Host</span>}
                  </div>
                  <div className={styles.participantStatus}>
                    {participant.isMuted && (
                      <span className={styles.statusItem}>
                        <MicOff size={14} /> Muted
                      </span>
                    )}
                    {!participant.isVideoOn && (
                      <span className={styles.statusItem}>
                        <VideoOff size={14} /> Camera Off
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.controlsGroup}>
            <button 
              className={`${styles.controlButton} ${isMuted ? styles.active : ''}`}
              onClick={toggleMute}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            
            <button 
              className={`${styles.controlButton} ${isVideoOff ? styles.active : ''}`}
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
            </button>
            
            <button 
              className={`${styles.controlButton} ${isScreenSharing ? styles.active : ''}`}
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              <ScreenShare size={20} />
              <span>{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
            </button>
          </div>
          
          <div className={styles.controlsGroup}>
            <button 
              className={`${styles.controlButton} ${activeView === 'participants' ? styles.active : ''}`}
              onClick={() => setActiveView(activeView === 'participants' ? 'video' : 'participants')}
            >
              <Users size={20} />
              <span>Participants</span>
            </button>
            
            <button 
              className={`${styles.controlButton} ${activeView === 'chat' ? styles.active : ''}`}
              onClick={() => setActiveView(activeView === 'chat' ? 'video' : 'chat')}
            >
              <MessageSquare size={20} />
              <span>Chat</span>
            </button>
          </div>
          
          <button 
            className={styles.leaveButton}
            onClick={leaveMeeting}
          >
            <PhoneOff size={20} />
            <span>Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;