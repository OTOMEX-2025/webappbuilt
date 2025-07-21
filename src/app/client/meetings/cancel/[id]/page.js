'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const CancelMeeting = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
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
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchMeeting();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cancelReason) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/clt/meetings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          reason: cancelReason
        }),
      });
      
      if (response.ok) {
        router.push('/client/meetings');
      } else {
        throw new Error('Failed to cancel meeting');
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
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="mb-6">{error}</p>
            <button 
              onClick={() => router.push(`/client/meetings/${id}`)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft size={16} /> Back to Meeting
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push(`/client/meetings/${id}`)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <ArrowLeft size={16} /> Back to Meeting
          </button>
          <h1 className="text-3xl font-bold">Cancel Meeting</h1>
        </div>

        {/* Warning */}
        <div className={`p-4 mb-8 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="font-semibold">Are you sure you want to cancel this meeting?</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                This action cannot be undone. All participants will be notified.
              </p>
            </div>
          </div>
        </div>

        {/* Current Meeting Info */}
        <div className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h2 className="text-2xl font-semibold mb-4">{meeting.title}</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
              <span>{formatDate(meeting.date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
              <span>Host: {meeting.therapist}</span>
            </div>
          </div>
        </div>

        {/* Cancel Form */}
        <form onSubmit={handleSubmit} className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <div className="mb-6">
            <label htmlFor="cancelReason" className="block text-lg font-medium mb-3">
              Reason for cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              id="cancelReason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              placeholder="Please provide a reason for cancellation"
              rows={4}
              required
            />
          </div>

          {error && (
            <div className={`mb-6 p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push(`/client/meetings/${id}`)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Back to Meeting
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={isSubmitting || !cancelReason}
            >
              {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelMeeting;