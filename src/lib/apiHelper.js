import axios from 'axios';

const apiHelper = {
  request: async (method, data = {}, token = null) => {
    try {
      const config = {
        method,
        url: '/api/profile',
        headers: {}
      };

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      if (method === 'GET') {
        config.params = data;
      } else {
        config.data = data;
      }

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
    return apiHelper.request('POST', {
      operation: 'login',
      email,
      password
    });
  },

  register: async (name, email, password, userType) => {
    return apiHelper.request('POST', {
      operation: 'register',
      name,
      email,
      password,
      userType
    });
  },

  getProfile: async (token) => {
    return apiHelper.request('GET', {}, token);
  },

  updateProfile: async (data, token) => {
    return apiHelper.request('PUT', data, token);
  },

  resetPassword: async (email) => {
    return apiHelper.request('POST', {
      operation: 'reset-password',
      email
    });
  }
};

export default apiHelper;