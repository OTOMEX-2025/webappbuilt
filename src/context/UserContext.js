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

  // Auth check on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const { success, data } = await apiHelper.getProfile(parsedUser.email);
          
          if (success) {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          } else {
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Route protection
  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/reset'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push('/auth/login');
    }
  }, [user, loading, pathname, router]);

  const login = async (credentials) => {
    try {
      const { success, data, message } = await apiHelper.login(
        credentials.email, 
        credentials.password
      );
      
      if (!success) throw new Error(message || 'Login failed');
      
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      // Redirect based on user type
      const redirectPath = data.userType === 'professional' ? '/prof/dashboard' :
                          data.userType === 'admin' ? '/admin/dashboard' :
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
      const { success, data, message } = await apiHelper.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
        ...(userData.userType === 'professional' && {
          licenseNumber: userData.licenseNumber,
          specialization: userData.specialization
        })
      });
      
      if (!success) throw new Error(message || 'Registration failed');
      
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
      if (!user?.email) throw new Error('Not authenticated');
      
      const { success, data, message } = await apiHelper.updateProfile({
        ...formData,
        email: user.email
      });
      
      if (!success) throw new Error(message || 'Profile update failed');
      
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
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
      if (!success) throw new Error(message || 'Password reset failed');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        message: error.message || 'Password reset failed' 
      };
    }
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
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
      updateUser,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);