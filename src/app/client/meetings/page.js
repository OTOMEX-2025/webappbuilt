'use client';
import React, { useState, useEffect } from 'react';
import { Video, Calendar, Users, Clock, X, Check, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import Loader from "../../../components/Loader"
const Meetings = () => {
  const { theme } = useTheme();
  const [meetings, setMeetings] = useState({
    upcoming: [],
    past: [],
    canceled: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      const response = await fetch('/api/clt/meetings');
      const data = await response.json();
      setMeetings(data);
      setIsLoading(false);
    };
    fetchMeetings();
  }, []);

  const handleCancelMeeting = async () => {
    if (!currentMeeting) return;
    
    const response = await fetch('/api/clt/meetings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: currentMeeting.id,
        action: 'cancel',
        reason: cancelReason
      }),
    });
    
    if (response.ok) {
      const updatedMeeting = await response.json();
      setMeetings(prev => ({
        ...prev,
        upcoming: prev.upcoming.filter(m => m.id !== updatedMeeting.id),
        canceled: [...prev.canceled, updatedMeeting]
      }));
      setShowCancelModal(false);
      setCancelReason('');
    }
  };

  const handleRescheduleMeeting = async () => {
    if (!currentMeeting || !newDate) return;
    
    const response = await fetch('/api/clt/meetings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: currentMeeting.id,
        action: 'reschedule',
        newDate: new Date(newDate).toISOString()
      }),
    });
    
    if (response.ok) {
      const updatedMeeting = await response.json();
      setMeetings(prev => ({
        ...prev,
        upcoming: prev.upcoming.map(m => 
          m.id === updatedMeeting.id ? updatedMeeting : m
        )
      }));
      setShowRescheduleModal(false);
      setNewDate('');
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };

  const getDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
  };
  if(isLoading){
    return(
      <Loader theme={theme}/>
    )
  }

  return (
    <div className={`min-h-screen w-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Virtual Meetings</h1>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage your upcoming and past therapy sessions
            </p>
          </div>
          <Link 
            href="/client/meetings/create" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Video size={16} />
            Create Meeting
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex space-x-4">
            {['upcoming', 'past', 'canceled'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 font-medium text-sm capitalize ${activeTab === tab 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {meetings[activeTab]?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className={`p-6 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} mb-4`}>
                <Calendar size={48} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No {activeTab} meetings</h3>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                You don't have any {activeTab} meetings scheduled
              </p>
              {activeTab === 'upcoming' && (
                <Link 
                  href="/client/meetings/create" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Schedule a Meeting
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings[activeTab]?.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className={`rounded-lg overflow-hidden shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        {meeting.status === 'canceled' && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-200">
                            Canceled
                          </span>
                        )}
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {formatDate(meeting.date)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{meeting.title}</h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        With {meeting.therapist}
                      </p>
                    </div>
                    
                    {/* Meeting Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                        <span>{formatTime(meeting.date)} ({getDuration(meeting.duration)})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                        <span>
                          {activeTab === 'upcoming' 
                            ? `${meeting.participants || 0}/${meeting.maxParticipants} participants`
                            : `${meeting.participants} participants`}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {meeting.description && (
                      <div className={`mb-4 p-3 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className="text-sm">{meeting.description}</p>
                      </div>
                    )}

                    {/* Cancel Reason */}
                    {meeting.status === 'canceled' && meeting.cancelReason && (
                      <div className={`text-sm p-3 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                        <strong>Reason:</strong> {meeting.cancelReason}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {activeTab === 'upcoming' && (
                      <div className="mt-6 space-y-3">
                        <Link 
                          href={`/client/meetings/join/${meeting.id}`} 
                          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Join Meeting
                        </Link>
                        <div className="flex gap-2">
                          <button 
                            className="flex items-center justify-center gap-1 w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => {
                              setCurrentMeeting(meeting);
                              setShowRescheduleModal(true);
                            }}
                          >
                            <RefreshCw size={16} /> Reschedule
                          </button>
                          <button 
                            className="flex items-center justify-center gap-1 w-full py-2 px-4 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            onClick={() => {
                              setCurrentMeeting(meeting);
                              setShowCancelModal(true);
                            }}
                          >
                            <X size={16} /> Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'past' && meeting.recordingAvailable && (
                      <button className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        View Recording
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Meeting Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-lg shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Cancel Meeting</h3>
            <p className="mb-4">Are you sure you want to cancel '{currentMeeting?.title}'?</p>
            <div className="mb-4">
              <label htmlFor="cancelReason" className="block text-sm font-medium mb-2">
                Reason for cancellation:
              </label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
                className={`w-full px-3 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowCancelModal(false)}
              >
                Back
              </button>
              <button 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                onClick={handleCancelMeeting}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Meeting Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-lg shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-semibold mb-4">Reschedule Meeting</h3>
            <p className="mb-4">Select a new date and time for '{currentMeeting?.title}'</p>
            <div className="mb-4">
              <label htmlFor="newDate" className="block text-sm font-medium mb-2">
                New Date & Time:
              </label>
              <input
                type="datetime-local"
                id="newDate"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowRescheduleModal(false)}
              >
                Back
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                onClick={handleRescheduleMeeting}
                disabled={!newDate}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetings;