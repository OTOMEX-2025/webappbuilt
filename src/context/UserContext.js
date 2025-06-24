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
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/', '/auth/login', '/auth/register', '/auth/reset'];
    const isPublicPath = publicPaths.includes(pathname);

    // If user is not logged in and trying to access protected page
    if (!user && !isPublicPath) {
      router.push('/auth/login');
    }
  }, [user, loading, pathname, router]);

  const login = async (credentials) => {
    try {
      const { success, data, message } = await apiHelper.login(credentials.email, credentials.password);
      
      if (!success) {
        throw new Error(message || 'Login failed');
      }
      
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
    const { success, data, message } = await apiHelper.register(
      userData.fullName,
      userData.email,
      userData.password,
      userData.userType,
      userData // Pass all additional fields
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
      if (!user?.email) {
        throw new Error('Not authenticated');
      }
      
      const { success, data, message } = await apiHelper.updateProfile({
        ...formData,
        email: user.email // Ensure we're updating the correct user
      });
      
      if (!success) {
        throw new Error(message || 'Profile update failed');
      }
      
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
 const updatePassword = async (email, code, newPassword) => {
  try {
    const { success, message } = await apiHelper.updatePassword({
      email,
      code,
      newPassword
    });
    
    if (!success) {
      throw new Error(message || 'Password update failed');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Password update error:', error);
    return { 
      success: false, 
      message: error.message || 'Password update failed' 
    };
  }
};
  const fetchUserDetails = async (email) => {
    try {
      const { success, data, message } = await apiHelper.getProfile(email);
      
      if (!success) {
        throw new Error(message || 'Failed to fetch user details');
      }
      
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
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

// In your UserContext or wherever you call the subscription
const subscribe = async (plan, paymentMethod) => {
  try {
    if (!user?._id) {
      throw new Error('Not authenticated');
    }
    
    // Include userId as first parameter
    const { success, data, message } = await apiHelper.subscribe(
      user._id,  // Send the user's ID
      plan,
      paymentMethod
    );
    
    if (!success) {
      throw new Error(message || 'Subscription failed');
    }
    // Update user state
    const updatedUser = {
      ...user,
      subscription: data.subscription
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    return { success: true, subscription: data.subscription };
  } catch (error) {
    console.error('Subscription error:', error);
    return { 
      success: false, 
      message: error.message || 'Subscription failed' 
    };
  }
};

const unsubscribe = async () => {
  try {
    if (!user?.email) {
      throw new Error('Not authenticated');
    }
    
    // Pass user.email as parameter
    const { success, data, message } = await apiHelper.unsubscribe(user.email);
    
    if (!success) {
      throw new Error(message || 'Unsubscription failed');
    }
    
    updateUser(data);
    return { success: true };
  } catch (error) {
    console.error('Unsubscription error:', error);
    return { 
      success: false, 
      message: error.message || 'Unsubscription failed' 
    };
  }
};

  const checkSubscription = async () => {
    try {
      if (!user?.email) {
        throw new Error('Not authenticated');
      }
      
      const { success, data, message } = await apiHelper.getSubscriptionStatus();
      
      if (!success) {
        throw new Error(message || 'Failed to check subscription status');
      }
      
      return { 
        success: true, 
        isSubscribed: data.subscription?.plan !== null,
        subscription: data.subscription 
      };
    } catch (error) {
      console.error('Subscription check error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to check subscription status' 
      };
    }
  };
 


  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register,
      resetPassword,
      updatePassword,
      updateProfile,
      fetchUserDetails,
      updateUser,
      subscribe,
      unsubscribe,
      checkSubscription,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);