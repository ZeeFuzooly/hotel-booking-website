import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useBookingsStore = defineStore('bookings', () => {
  // State
  const bookings = ref([])
  const currentBooking = ref(null)
  const bookingForm = ref({
    roomId: null,
    checkIn: null,
    checkOut: null,
    guests: 1,
    specialRequests: '',
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  })
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const upcomingBookings = computed(() => {
    const now = new Date()
    return bookings.value.filter(booking => {
      const checkInDate = new Date(booking.checkIn)
      return checkInDate > now && booking.status !== 'cancelled'
    })
  })

  const pastBookings = computed(() => {
    const now = new Date()
    return bookings.value.filter(booking => {
      const checkOutDate = new Date(booking.checkOut)
      return checkOutDate < now
    })
  })

  const currentBookings = computed(() => {
    const now = new Date()
    return bookings.value.filter(booking => {
      const checkInDate = new Date(booking.checkIn)
      const checkOutDate = new Date(booking.checkOut)
      return checkInDate <= now && checkOutDate >= now && booking.status !== 'cancelled'
    })
  })

  const cancelledBookings = computed(() => {
    return bookings.value.filter(booking => booking.status === 'cancelled')
  })

  const canCancelBooking = computed(() => (booking) => {
    if (booking.status === 'cancelled') return false
    
    const now = new Date()
    const checkInDate = new Date(booking.checkIn)
    const daysUntilCheckIn = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24))
    
    return daysUntilCheckIn > 0
  })

  // Actions
  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const setBookingForm = (formData) => {
    // Calculate total nights and price if check-in and check-out dates are provided
    let totalNights = 0
    let totalPrice = 0
    
    if (formData.checkIn && formData.checkOut) {
      const startDate = new Date(formData.checkIn)
      const endDate = new Date(formData.checkOut)
      totalNights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      
      if (formData.roomPrice) {
        totalPrice = formData.roomPrice * totalNights
      }
    }
    
    bookingForm.value = { 
      ...bookingForm.value, 
      ...formData,
      totalNights,
      totalPrice
    }
  }

  const clearBookingForm = () => {
    bookingForm.value = {
      roomId: null,
      checkIn: null,
      checkOut: null,
      guests: 1,
      totalNights: 0,
      totalPrice: 0,
      roomPrice: null,
      roomName: '',
      roomType: '',
      specialRequests: '',
      contactInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      }
    }
  }

  const getUserBookings = async (filters = {}) => {
    try {
      isLoading.value = true
      clearError()

      const params = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...filters
      }

      // Remove null/undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
          delete params[key]
        }
      })

      const response = await api.get('/bookings', { params })
      const { bookings: bookingsData, pagination: paginationData } = response.data

      bookings.value = bookingsData
      pagination.value = {
        ...pagination.value,
        ...paginationData
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch bookings'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const getBookingById = async (bookingId) => {
    try {
      isLoading.value = true
      clearError()

      const response = await api.get(`/bookings/${bookingId}`)
      currentBooking.value = response.data

      return { success: true, booking: response.data }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch booking details'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const createBooking = async (bookingData) => {
    try {
      isLoading.value = true
      clearError()

      console.log('Creating booking with data:', bookingData)
      const response = await api.post('/bookings', bookingData)
      console.log('API response:', response.data)
      
      const newBooking = response.data.booking // Extract the booking from the response
      console.log('Extracted booking:', newBooking)

      // Add to bookings list
      bookings.value.unshift(newBooking)
      
      // Update pagination
      pagination.value.total += 1

      return { success: true, booking: newBooking }
    } catch (err) {
      console.error('Booking creation error:', err)
      const errorMessage = err.response?.data?.message || 'Failed to create booking'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      isLoading.value = true
      clearError()

      await api.delete(`/bookings/${bookingId}`)
      
      // Update booking status in local state
      const bookingIndex = bookings.value.findIndex(b => b.id === bookingId)
      if (bookingIndex !== -1) {
        bookings.value[bookingIndex].status = 'cancelled'
      }

      // Update current booking if it's the same one
      if (currentBooking.value && currentBooking.value.id === bookingId) {
        currentBooking.value.status = 'cancelled'
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel booking'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const setPage = (page) => {
    pagination.value.page = page
  }

  const resetPagination = () => {
    pagination.value.page = 1
  }

  const clearBookings = () => {
    bookings.value = []
    currentBooking.value = null
  }

  const calculateTotalPrice = (roomPrice, checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0
    
    const startDate = new Date(checkIn)
    const endDate = new Date(checkOut)
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    
    return roomPrice * nights
  }

  const formatBookingStatus = (status) => {
    const statusMap = {
      'confirmed': 'Confirmed',
      'pending': 'Pending',
      'cancelled': 'Cancelled',
      'completed': 'Completed'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status) => {
    const colorMap = {
      'confirmed': 'success',
      'pending': 'warning',
      'cancelled': 'danger',
      'completed': 'info'
    }
    return colorMap[status] || 'secondary'
  }

  return {
    // State
    bookings,
    currentBooking,
    bookingForm,
    pagination,
    isLoading,
    error,

    // Getters
    upcomingBookings,
    pastBookings,
    currentBookings,
    cancelledBookings,
    canCancelBooking,

    // Actions
    getUserBookings,
    getBookingById,
    createBooking,
    cancelBooking,
    setBookingForm,
    clearBookingForm,
    setPage,
    resetPagination,
    clearBookings,
    calculateTotalPrice,
    formatBookingStatus,
    getStatusColor,
    setError,
    clearError
  }
})
