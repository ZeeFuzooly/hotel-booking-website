import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useRoomsStore = defineStore('rooms', () => {
  // State
  const rooms = ref([])
  const roomTypes = ref([])
  const selectedRoom = ref(null)
  const searchFilters = ref({
    checkIn: null,
    checkOut: null,
    guests: 1,
    roomType: '',
    minPrice: null,
    maxPrice: null
  })
  const pagination = ref({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const availableRooms = computed(() => {
    return rooms.value.filter(room => room.isAvailable !== false)
  })

  const filteredRooms = computed(() => {
    let filtered = rooms.value

    // Filter by room type
    if (searchFilters.value.roomType) {
      filtered = filtered.filter(room => room.type === searchFilters.value.roomType)
    }

    // Filter by price range
    if (searchFilters.value.minPrice !== null) {
      filtered = filtered.filter(room => room.price >= searchFilters.value.minPrice)
    }
    if (searchFilters.value.maxPrice !== null) {
      filtered = filtered.filter(room => room.price <= searchFilters.value.maxPrice)
    }

    // Filter by guest capacity
    if (searchFilters.value.guests > 1) {
      filtered = filtered.filter(room => room.capacity >= searchFilters.value.guests)
    }

    return filtered
  })

  const hasActiveFilters = computed(() => {
    return searchFilters.value.roomType || 
           searchFilters.value.minPrice !== null || 
           searchFilters.value.maxPrice !== null ||
           searchFilters.value.guests > 1
  })

  // Actions
  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const setSearchFilters = (filters) => {
    searchFilters.value = { ...searchFilters.value, ...filters }
  }

  const clearSearchFilters = () => {
    searchFilters.value = {
      checkIn: null,
      checkOut: null,
      guests: 1,
      roomType: '',
      minPrice: null,
      maxPrice: null
    }
  }

  const getRooms = async (filters = {}) => {
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

      const response = await api.get('/rooms', { params })
      const { rooms: roomsData, pagination: paginationData } = response.data

      // Transform the data to match frontend expectations
      const transformedRooms = roomsData.map(room => ({
        id: room.id,
        name: room.name,
        description: room.description,
        price: room.price_per_night,
        capacity: room.capacity,
        type: room.room_type,
        amenities: room.amenities || [],
        images: room.image_url ? [room.image_url] : [], // Convert single image to array
        imageUrl: room.image_url, // Keep for backward compatibility
        size: room.size || 25, // Default room size
        bedType: room.bed_type || 'Standard', // Default bed type
        view: room.view || 'City View', // Default view
        floor: room.floor || 1, // Default floor
        isAvailable: true, // Default to available, will be checked separately if needed
        createdAt: room.created_at,
        updatedAt: room.updated_at
      }))

      rooms.value = transformedRooms
      pagination.value = {
        page: paginationData.current_page || 1,
        limit: paginationData.rooms_per_page || 12,
        total: paginationData.total_rooms || 0,
        totalPages: paginationData.total_pages || 0
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch rooms'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const getRoomById = async (roomId) => {
    try {
      isLoading.value = true
      clearError()

      const response = await api.get(`/rooms/${roomId}`)
      const roomData = response.data.room || response.data

      // Transform the data to match frontend expectations
      const transformedRoom = {
        id: roomData.id,
        name: roomData.name,
        description: roomData.description,
        price: roomData.price_per_night,
        capacity: roomData.capacity,
        type: roomData.room_type,
        amenities: roomData.amenities || [],
        images: roomData.image_url ? [roomData.image_url] : [], // Convert single image to array
        imageUrl: roomData.image_url, // Keep for backward compatibility
        size: roomData.size || 25, // Default room size
        bedType: roomData.bed_type || 'Standard', // Default bed type
        view: roomData.view || 'City View', // Default view
        floor: roomData.floor || 1, // Default floor
        isAvailable: roomData.is_available !== false, // Handle availability
        createdAt: roomData.created_at,
        updatedAt: roomData.updated_at
      }

      selectedRoom.value = transformedRoom

      return { success: true, room: transformedRoom }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch room details'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const getRoomTypes = async () => {
    try {
      clearError()

      const response = await api.get('/rooms/types')
      const typesData = response.data.room_types || response.data

      roomTypes.value = typesData

      return { success: true }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch room types'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
    try {
      clearError()

      const params = { checkIn, checkOut }
      const response = await api.get(`/rooms/${roomId}/availability`, { params })

      return { success: true, available: response.data.available }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to check room availability'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const searchRooms = async () => {
    return await getRooms(searchFilters.value)
  }

  const setPage = (page) => {
    pagination.value.page = page
  }

  const resetPagination = () => {
    pagination.value.page = 1
  }

  const clearRooms = () => {
    rooms.value = []
    selectedRoom.value = null
  }

  return {
    // State
    rooms,
    roomTypes,
    selectedRoom,
    searchFilters,
    pagination,
    isLoading,
    error,

    // Getters
    availableRooms,
    filteredRooms,
    hasActiveFilters,

    // Actions
    getRooms,
    getRoomById,
    getRoomTypes,
    checkRoomAvailability,
    searchRooms,
    setSearchFilters,
    clearSearchFilters,
    setPage,
    resetPagination,
    clearRooms,
    setError,
    clearError
  }
})
