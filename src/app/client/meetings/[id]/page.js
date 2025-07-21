'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Video, Calendar, Users, Clock, ArrowLeft, Edit, Trash2, Phone } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '../../../../context/ThemeContext';
import Loader from "../../../../components/Loader";

const MeetingDetail = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [newDate, setNewDate] = useState('');

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
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeeting();
  }, [id]);

  const handleCancelMeeting = async () => {
    try {
      const response = await fetch('/api/clt/meetings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: meeting.id,
          reason: cancelReason
        }),
      });
      
      if (response.ok) {
        router.push('/client/meetings');
      }
    } catch (error) {
      console.error('Error canceling meeting:', error);
    }
  };

  const handleRescheduleMeeting = async () => {
    try {
      const response = await fetch('/api/clt/meetings/reschedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: meeting.id,
          newDate: new Date(newDate).toISOString()
        }),
      });
      
      if (response.ok) {
        const updatedMeeting = await response.json();
        setMeeting(updatedMeeting.meeting);
        setShowRescheduleModal(false);
      }
    } catch (error) {
      console.error('Error rescheduling meeting:', error);
    }
  };

  const handleDeleteMeeting = async () => {
    try {
      const response = await fetch(`/api/clt/meetings?id=${meeting.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/client/meetings');
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
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

  if (isLoading) {
    return <Loader theme={theme}/>;
  }

  if (error) {
    return (
      <div className={`min-h-screen  ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <Link 
            href="/client/meetings" 
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Meetings
          </Link>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className={`min-h-screen  ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Meeting Not Found</h2>
          <Link 
            href="/client/meetings" 
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Meetings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/client/meetings" 
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Meetings
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{meeting.title}</h1>
            {meeting.status === 'canceled' && (
              <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                Canceled
              </span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-6">
            <div className="flex items-start">
              <Clock className="text-blue-500 mr-4 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-lg">Date & Time</h3>
                <p>{formatDate(meeting.date)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="text-blue-500 mr-4 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-lg">Participants</h3>
                <p>
                  {meeting.participants || 0}
                  {meeting.maxParticipants ? `/${meeting.maxParticipants}` : ''} joined
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="text-blue-500 mr-4 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-lg">Host</h3>
                <p>{meeting.therapist}</p>
              </div>
            </div>
            
            {meeting.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">{meeting.description}</p>
              </div>
            )}
            
            {meeting.status === 'canceled' && meeting.cancelReason && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Cancellation Reason</h3>
                <p className="text-gray-700 dark:text-gray-300">{meeting.cancelReason}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {meeting.status === 'scheduled' && (
            <>
              <Link 
                href={`/client/meetings/join/${meeting.id}`} 
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Phone size={16} className="mr-2" /> Join Meeting
              </Link>
              
              <button 
                className="flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                onClick={() => setShowRescheduleModal(true)}
              >
                <Edit size={16} className="mr-2" /> Reschedule
              </button>
              
              <button 
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={() => setShowCancelModal(true)}
              >
                <Trash2 size={16} className="mr-2" /> Cancel Meeting
              </button>
            </>
          )}
          
          {(meeting.status === 'canceled' || meeting.status === 'completed') && (
            <button 
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={handleDeleteMeeting}
            >
              <Trash2 size={16} className="mr-2" /> Delete Meeting
            </button>
          )}
        </div>
      </div>

      {/* Cancel Meeting Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <h3 className="text-xl font-bold mb-4">Cancel Meeting</h3>
            <p className="mb-4">Are you sure you want to cancel &quot;{meeting.title}&quot;?</p>
            <div className="mb-4">
              <label htmlFor="cancelReason" className="block mb-2 font-medium">Reason for cancellation:</label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
                onClick={() => setShowCancelModal(false)}
              >
                Back
              </button>
              <button 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
                onClick={handleCancelMeeting}
                disabled={!cancelReason}
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
          <div className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl p-6`}>
            <h3 className="text-xl font-bold mb-4">Reschedule Meeting</h3>
            <p className="mb-4">Select a new date and time for &quot;{meeting.title}&quot;</p>
            <div className="mb-4">
              <label htmlFor="newDate" className="block mb-2 font-medium">New Date & Time:</label>
              <input
                type="datetime-local"
                id="newDate"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                min={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
                onClick={() => setShowRescheduleModal(false)}
              >
                Back
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
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

export default MeetingDetail;