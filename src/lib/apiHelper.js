import axios from 'axios';

const apiHelper = {
  request: async (method, endpoint, data = {}) => {
    try {
      const config = {
        method,
        url: `/api/profile${endpoint || ''}`,
        data
      };

      const response = await axios(config);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Request failed'
      };
    }
  },

  // Specific methods for common operations
  login: async (email, password) => {
    return apiHelper.request('POST', '', {
      operation: 'login',
      email,
      password
    });
  },

  register: async (fullName, email, password, userType = 'client', additionalData = {}) => {
  return apiHelper.request('POST', '', {
    operation: 'register',
    fullName,
    email,
    password,
    userType,
    ...additionalData // Include all additional fields
  });
},

  getProfile: async (email) => {
    return apiHelper.request('GET', `?email=${email}`);
  },

  updateProfile: async (data) => {
    return apiHelper.request('PUT', '', data);
  },

  resetPassword: async (email) => {
    return apiHelper.request('POST', '', {
      operation: 'reset-password',
      email
    });
  },

  updatePassword: async (email, code, newPassword) => {
    return apiHelper.request('POST', '', {
      operation: 'update-password',
      email,
      code,
      newPassword
    });
  },


// apiHelper.js
subscribe: async (userId, plan, paymentMethod) => {
  return apiHelper.request('PUT', '', {
    operation: 'subscribe',
    userId,  // Send userId instead of email
    plan,
    paymentMethod
  });
},

unsubscribe: async (userId) => {
  return apiHelper.request('PUT', '', {
    operation: 'unsubscribe',
    userId  // Send userId instead of email
  });
},

  getSubscriptionStatus: async () => {
    return apiHelper.request('GET', '');
  },
};

export default apiHelper;