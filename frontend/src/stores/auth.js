import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userFullName = computed(() => {
    if (!user.value) return ''
    const u = user.value
    const first = u.first_name || u.firstName || (typeof u.name === 'string' ? u.name.split(' ')[0] : '') || ''
    const last = u.last_name || u.lastName || (typeof u.name === 'string' ? u.name.split(' ').slice(1).join(' ') : '') || ''
    return [first, last].filter(Boolean).join(' ')
  })

  // Actions
  const setTokens = (tokens) => {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  }

  const clearTokens = () => {
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const register = async (userData) => {
    try {
      isLoading.value = true
      clearError()
      
      const response = await api.post('/auth/register', userData)
      const { user: userInfo, tokens } = response.data
      
      setTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
      setUser(userInfo)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const login = async (credentials) => {
    try {
      isLoading.value = true
      clearError()
      
      const response = await api.post('/auth/login', credentials)
      const { user: userInfo, tokens } = response.data
      
      console.log('Login response:', response.data)
      console.log('Tokens received:', tokens)
      
      setTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
      setUser(userInfo)
      
      console.log('Auth state after login:', {
        accessToken: accessToken.value,
        user: user.value,
        isAuthenticated: isAuthenticated.value
      })
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (refreshToken.value) {
        await api.post('/auth/logout', { refreshToken: refreshToken.value })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      clearTokens()
      clearUser()
      clearError()
    }
  }

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }

      const response = await api.post('/auth/refresh', {
        refreshToken: refreshToken.value
      })
      
      const { tokens } = response.data
      setTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
      
      return true
    } catch (err) {
      console.error('Token refresh failed:', err)
      logout()
      return false
    }
  }

  const getProfile = async () => {
    try {
      isLoading.value = true
      clearError()
      
      const response = await api.get('/users/profile')
      // API returns shape: { user: { ... } }
      setUser(response.data?.user || response.data)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch profile'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true
      clearError()
      
      const response = await api.put('/users/profile', profileData)
      setUser(response.data)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const deleteAccount = async (password) => {
    try {
      isLoading.value = true
      clearError()
      
      await api.delete('/users/account', { data: { password } })
      logout()
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete account'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Initialize user data if token exists
  const initializeAuth = async () => {
    if (accessToken.value && !user.value) {
      await getProfile()
    }
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userFullName,
    
    // Actions
    register,
    login,
    logout,
    refreshAccessToken,
    getProfile,
    updateProfile,
    deleteAccount,
    initializeAuth,
    setError,
    clearError
  }
})
