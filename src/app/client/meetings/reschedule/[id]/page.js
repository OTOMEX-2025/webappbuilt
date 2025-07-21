'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const RescheduleMeeting = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`/api/clt/meetings/${id}`);
        if (!response.ok) {
          throw new Error('Meeting not found');
        }
        const data = await response.json();
        setMeeting(data);
        setNewDate(new Date(data.date).toISOString().slice(0, 16));
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchMeeting();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/clt/meetings/reschedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          newDate: new Date(newDate).toISOString()
        }),
      });
      
      if (response.ok) {
        router.push(`/client/meetings/${id}`);
      } else {
        throw new Error('Failed to reschedule meeting');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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

  if (!meeting) {
    return (
      <div className={`min-h-screen   flex items-center justify-center ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen min-  ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="mb-6">{error}</p>
            <Link 
              href={`/client/meetings/${id}`} 
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft size={16} /> Back to Meeting
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen min-  ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/client/meetings/${id}`} 
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} /> Back to Meeting
          </Link>
          <h1 className="text-3xl font-bold">Reschedule Meeting</h1>
        </div>

        {/* Current Meeting Info */}
        <div className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h2 className="text-2xl font-semibold mb-4">{meeting.title}</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock size={18} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
              <span>Current Time: {formatDate(meeting.date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
              <span>Host: {meeting.therapist}</span>
            </div>
          </div>
        </div>

        {/* Reschedule Form */}
        <form onSubmit={handleSubmit} className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="mb-6">
            <label htmlFor="newDate" className="block text-lg font-medium mb-3">
              New Date & Time
            </label>
            <input
              type="datetime-local"
              id="newDate"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Link 
              href={`/client/meetings/${id}`} 
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={isSubmitting || !newDate}
            >
              {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleMeeting;