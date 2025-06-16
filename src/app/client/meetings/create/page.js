'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Calendar, Clock, Users, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const CreateMeeting = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const isEditMode = !!id;
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: 60,
    maxParticipants: 15,
    therapist: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/clt/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
          participants: 0,
          status: 'scheduled'
        }),
      });
      
      if (response.ok) {
        router.push('/client/meetings');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen w-screen ${theme === 'dark' ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/client/meetings')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <ArrowLeft size={16} /> Back to Meetings
          </button>
          <h1 className="text-3xl font-bold mb-2">Create New Meeting</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Schedule a new virtual therapy session
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className={`space-y-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
          {/* Meeting Details Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Meeting Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Meeting Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="e.g. Weekly Therapy Session"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  rows={4}
                  placeholder="Add any details participants should know..."
                />
              </div>
            </div>
          </div>
          
          {/* Date & Time Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Date & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-1">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className={`w-full pl-10 px-4 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-1">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="15"
                    max="240"
                    required
                    className={`w-full pl-10 px-4 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Participants Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Participants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium mb-1">
                  Maximum Participants <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  </div>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    min="1"
                    max="50"
                    required
                    className={`w-full pl-10 px-4 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="therapist" className="block text-sm font-medium mb-1">
                  Host/Therapist <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="therapist"
                  name="therapist"
                  value={formData.therapist}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="Enter therapist name"
                />
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/client/meetings')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeeting;