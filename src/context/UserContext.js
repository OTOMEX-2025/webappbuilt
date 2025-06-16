// context/UserContext.js
"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/reset', '/profile/settings'];
    const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith('/profile');

    // If user is not logged in and trying to access protected page
    if (!user && !isPublicPath) {
      router.push('/auth/login');
      return;
    }

    // Check user type restrictions (only for non-auth pages)
    if (user && !isPublicPath) {
      switch(user.userType) {
        case 'client':
          if (pathname.startsWith('/prof') || pathname.startsWith('/admin')) {
            router.push('/client/dashboard');
            return;
          }
          break;
        case 'professional':
          if (pathname.startsWith('/client') || pathname.startsWith('/admin')) {
            router.push('/prof/dashboard');
            return;
          }
          break;
        case 'admin':
          if (pathname.startsWith('/client') || pathname.startsWith('/prof')) {
            router.push('/admin/dashboard');
            return;
          }
          break;
        default:
          if (!pathname.startsWith('/client')) {
            router.push('/client/dashboard');
            return;
          }
      }
    }
  }, [user, loading, pathname, router]);

const login = async (credentials) => {
  try {
    const response = await axios.post('/api/login', credentials);
    
    // Debug: log the full response
    console.log('Login response:', response);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    // Make the response data handling more flexible
    const token = response.data.token || response.data.accessToken;
    const userData = response.data.user || response.data;
    
    if (!token) {
      throw new Error('No token received');
    }

    // Combine token with user data for storage
    const authData = {
      token,
      ...userData
    };
    
    // Debug: log what we're storing
    console.log('Storing auth data:', authData);
    
    localStorage.setItem('user', JSON.stringify(authData));
    setUser(authData);
    
    // Debug: verify storage
    console.log('Stored user:', localStorage.getItem('user'));
    
    // Redirect based on user type after successful login
    const redirectPath = userData.userType === 'professional' ? '/prof/dashboard' :
                        userData.userType === 'admin' ? '/admin/dashboard' :
                        '/client/dashboard';
    
    router.push(redirectPath);
    
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Login failed. Please try again.';
    return { 
      success: false, 
      message: errorMessage 
    };
  }
};
  const register = async (userData) => {
    try {
      const response = await axios.post('/api/register', userData);
      router.push('/auth/login');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  };

  const updateProfile = async (formData) => {
    try {
      const response = await axios.put('/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedUser = response.data;
      
      // Preserve the token when updating user data
      const updatedData = {
        ...user,
        ...updatedUser
      };
      
      localStorage.setItem('user', JSON.stringify(updatedData));
      setUser(updatedData);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const resetPassword = async (email) => {
    try {
      await axios.post('/api/reset-password', { email });
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password reset failed' 
      };
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('/api/profile');
      const userDetails = response.data;
      
      // Preserve the token when updating user data
      const updatedUser = {
        ...user,
        ...userDetails
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Fetch user details error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch user details' 
      };
    }
  };

  const updateUser = (updatedData) => {
    // Preserve the token when updating user data
    const updatedUser = { 
      ...user, 
      ...updatedData 
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register,
      resetPassword,
      updateProfile,
      fetchUserDetails,
      updateUser,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);