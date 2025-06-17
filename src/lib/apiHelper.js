import axios from 'axios';

const apiHelper = {
  request: async (method, data = {}, query = '') => {
    try {
      const config = {
        method,
        url: `/api/profile${query}`,
        data,
        headers: { 'Content-Type': 'application/json' },
      };

      const response = await axios(config);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('API error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Request failed',
      };
    }
  },

  // Auth Operations
  login: (email, password) => 
    apiHelper.request('POST', { operation: 'login', email, password }),

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

  resetPassword: (email) => 
    apiHelper.request('POST', { operation: 'reset-password', email }),

  // Profile Operations
  getProfile: (email) => 
    apiHelper.request('GET', {}, `?email=${email}`),

  updateProfile: (data) => 
    apiHelper.request('PUT', { operation: 'update-profile', ...data }),
};

export default apiHelper;