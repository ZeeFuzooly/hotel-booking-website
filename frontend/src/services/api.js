import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    console.log('API Request - accessToken:', authStore.accessToken)
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
      console.log('Setting Authorization header:', config.headers.Authorization)
    } else {
      console.log('No access token available')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const success = await authStore.refreshAccessToken()
        
        if (success) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // If refresh fails, logout the user
        await authStore.logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden:', error.response.data)
    } else if (error.response?.status === 404) {
      // Not found
      console.error('Resource not found:', error.response.data)
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data)
    }

    return Promise.reject(error)
  }
)

// API helper functions
export const apiHelpers = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message
    } else if (error.message) {
      return error.message
    } else {
      return 'An unexpected error occurred'
    }
  },

  // Format dates for API
  formatDate: (date) => {
    if (!date) return null
    return new Date(date).toISOString().split('T')[0]
  },

  // Parse API dates
  parseDate: (dateString) => {
    if (!dateString) return null
    return new Date(dateString)
  },

  // Build query parameters
  buildQueryParams: (params) => {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item))
        } else {
          queryParams.append(key, value)
        }
      }
    })
    
    return queryParams.toString()
  }
}

export default api
