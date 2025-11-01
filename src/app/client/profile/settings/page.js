// app/profile/settings/page.js
"use client";
import React from 'react';
import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

const ProfileSettings = () => {
  const { user, updateProfile } = useUser();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    bio: '',
    specialization: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        bio: user.bio || '',
        specialization: user.specialization || '',
      });
      setPreviewImage(user.profilePicture || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    if (profilePicture) {
      formDataToSend.append('profilePicture', profilePicture);
    }

    const result = await updateProfile(formDataToSend);
    setIsLoading(false);
    
    if (!result.success) {
      alert('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className={`  min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`  min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your personal information and preferences
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Picture Section */}
          <div className="w-full lg:w-1/3">
            <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-indigo-500">
                  <img 
                    src={previewImage || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                  theme === 'dark' 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}>
                  Change Photo
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  JPG, GIF or PNG. Max size 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' 
                        : 'bg-white border-gray-300 focus:border-indigo-500'
                    } focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                    className={`w-full px-4 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-400' 
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' 
                        : 'bg-white border-gray-300 focus:border-indigo-500'
                    } focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>

                {user.userType === 'professional' && (
                  <div className="space-y-2">
                    <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-md border ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' 
                          : 'bg-white border-gray-300 focus:border-indigo-500'
                      } focus:ring-1 focus:ring-indigo-500`}
                    />
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' 
                        : 'bg-white border-gray-300 focus:border-indigo-500'
                    } focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className={`block font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' 
                        : 'bg-white border-gray-300 focus:border-indigo-500'
                    } focus:ring-1 focus:ring-indigo-500`}
                  />
                </div>
              </div>

              <div className="mt-8">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : theme === 'dark' 
                        ? 'bg-indigo-600 hover:bg-indigo-700' 
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;