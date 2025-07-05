/**
 * EzSite API Client
 * This script initializes the window.ezsite.apis object to connect to our backend server
 */

(function() {
  const API_BASE_URL = 'http://localhost:3000/api';

  // Initialize the ezsite object if it doesn't exist
  window.ezsite = window.ezsite || {};

  // Define the APIs
  window.ezsite.apis = {
    // Authentication APIs
    login: async (email, password) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
          // Store user in localStorage for future use
          localStorage.setItem('user', JSON.stringify(result.data));
        }
        
        return result;
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message || 'Login failed' };
      }
    },

    register: async (email, password, name) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, name })
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
          // Store user in localStorage for future use
          localStorage.setItem('user', JSON.stringify(result.data));
        }
        
        return result;
      } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message || 'Registration failed' };
      }
    },

    getUserInfo: async () => {
      // First try to get from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return { data: JSON.parse(storedUser), error: null };
      }
      
      // If not in localStorage, try to get from API
      try {
        const response = await fetch(`${API_BASE_URL}/getUserInfo`);
        const result = await response.json();
        
        if (result.success) {
          // Store user in localStorage for future use
          localStorage.setItem('user', JSON.stringify(result.data));
          return { data: result.data, error: null };
        } else {
          return { data: null, error: result.error || 'Failed to get user info' };
        }
      } catch (error) {
        console.error('Get user info error:', error);
        return { data: null, error: error.message || 'Failed to get user info' };
      }
    },

    // Table APIs
    tablePage: async (tableId, params) => {
      try {
        const response = await fetch(`${API_BASE_URL}/table/${tableId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        });
        
        // Check if response is valid JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error(`Non-JSON response from server for table ${tableId}:`, text);
          return { data: null, error: 'Server returned non-JSON response' };
        }
        
        const result = await response.json();
        
        if (result.success) {
          return { data: result.data, error: null };
        } else {
          return { data: null, error: result.error || 'Failed to fetch table data' };
        }
      } catch (error) {
        console.error(`Table page error for table ${tableId}:`, error);
        return { data: null, error: error.message || 'Failed to fetch table data' };
      }
    },

    tableCreate: async (tableId, data) => {
      try {
        const response = await fetch(`${API_BASE_URL}/table/create/${tableId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        // Check if response is valid JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error(`Non-JSON response from server for table create ${tableId}:`, text);
          return { data: null, error: 'Server returned non-JSON response' };
        }
        
        const result = await response.json();
        
        if (result.success) {
          return { data: result.data, error: null };
        } else {
          return { data: null, error: result.error || 'Failed to create record' };
        }
      } catch (error) {
        console.error(`Table create error for table ${tableId}:`, error);
        return { data: null, error: error.message || 'Failed to create record' };
      }
    },

    tableUpdate: async (tableId, data) => {
      try {
        const response = await fetch(`${API_BASE_URL}/table/update/${tableId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        // Check if response is valid JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error(`Non-JSON response from server for table update ${tableId}:`, text);
          return { data: null, error: 'Server returned non-JSON response' };
        }
        
        const result = await response.json();
        
        if (result.success) {
          return { data: result.data, error: null };
        } else {
          return { data: null, error: result.error || 'Failed to update record' };
        }
      } catch (error) {
        console.error(`Table update error for table ${tableId}:`, error);
        return { data: null, error: error.message || 'Failed to update record' };
      }
    },

    tableDelete: async (tableId, id) => {
      try {
        const response = await fetch(`${API_BASE_URL}/table/delete/${tableId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });
        
        // Check if response is valid JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error(`Non-JSON response from server for table delete ${tableId}:`, text);
          return { data: null, error: 'Server returned non-JSON response' };
        }
        
        const result = await response.json();
        
        if (result.success) {
          return { data: true, error: null };
        } else {
          return { data: null, error: result.error || 'Failed to delete record' };
        }
      } catch (error) {
        console.error(`Table delete error for table ${tableId}:`, error);
        return { data: null, error: error.message || 'Failed to delete record' };
      }
    },

    // Additional helper methods for the frontend
    logout: () => {
      localStorage.removeItem('user');
      return { success: true };
    },

    isAdmin: () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return false;
      
      const user = JSON.parse(storedUser);
      // Check if user is admin (email contains 'admin' or ID is '1')
      return user.Email?.toLowerCase().includes('admin') || user.ID === '1';
    },
    
    // OTP methods (mock implementations)
    sendOTP: async (phone) => {
      // Mock implementation - in a real app, this would call a backend endpoint
      console.log(`Sending OTP to ${phone}`);
      return { success: true, message: 'OTP sent successfully' };
    },
    
    verifyOTP: async (phone, otp) => {
      // Mock implementation - in a real app, this would call a backend endpoint
      console.log(`Verifying OTP ${otp} for ${phone}`);
      // For demo purposes, any 6-digit OTP is valid
      if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
        const mockUser = {
          ID: '2',
          Name: 'OTP User',
          Email: `user_${phone}@example.com`
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, data: mockUser };
      }
      return { success: false, error: 'Invalid OTP' };
    },
    
    // File upload method
    upload: async ({ filename, file }) => {
      try {
        if (!file) {
          throw new Error('No file provided');
        }
        
        const formData = new FormData();
        formData.append('image', file, filename);
        
        const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          return { data: result.data.imageUrl, error: null };
        } else {
          return { data: null, error: result.error || 'Failed to upload file' };
        }
      } catch (error) {
        console.error('File upload error:', error);
        return { data: null, error: error.message || 'Failed to upload file' };
      }
    }
  };

  console.log('EzSite API Client initialized');
})();