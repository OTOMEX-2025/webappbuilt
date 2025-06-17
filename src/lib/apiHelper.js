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

  register: async (name, email, password, userType = 'client') => {
    return apiHelper.request('POST', '', {
      operation: 'register',
      name,
      email,
      password,
      userType
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
  }
};

export default apiHelper;