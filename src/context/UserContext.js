"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiHelper from '@/lib/apiHelper';

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
      const { success, data, message } = await apiHelper.login(credentials.email, credentials.password);
      
      if (!success) {
        throw new Error(message || 'Login failed');
      }

      const authData = {
        token: data.token,
        ...data.user
      };
      
      localStorage.setItem('user', JSON.stringify(authData));
      setUser(authData);
      
      // Redirect based on user type
      const redirectPath = authData.userType === 'professional' ? '/prof/dashboard' :
                          authData.userType === 'admin' ? '/admin/dashboard' :
                          '/client/dashboard';
      
      router.push(redirectPath);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const { success, message } = await apiHelper.register(
        userData.name,
        userData.email,
        userData.password,
        userData.userType
      );
      
      if (!success) {
        throw new Error(message || 'Registration failed');
      }
      
      router.push('/auth/login');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed' 
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
      if (!user?.token) {
        throw new Error('Not authenticated');
      }
      
      const { success, data, message } = await apiHelper.updateProfile(formData, user.token);
      
      if (!success) {
        throw new Error(message || 'Profile update failed');
      }
      
      // Preserve the token when updating user data
      const updatedData = {
        ...user,
        ...data
      };
      
      localStorage.setItem('user', JSON.stringify(updatedData));
      setUser(updatedData);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.message || 'Profile update failed' 
      };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { success, message } = await apiHelper.resetPassword(email);
      
      if (!success) {
        throw new Error(message || 'Password reset failed');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        message: error.message || 'Password reset failed' 
      };
    }
  };

  const fetchUserDetails = async () => {
    try {
      if (!user?.token) {
        throw new Error('Not authenticated');
      }
      
      const { success, data, message } = await apiHelper.getProfile(user.token);
      
      if (!success) {
        throw new Error(message || 'Failed to fetch user details');
      }
      
      // Preserve the token when updating user data
      const updatedUser = {
        ...user,
        ...data
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Fetch user details error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to fetch user details' 
      };
    }
  };

  const updateUser = (updatedData) => {
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