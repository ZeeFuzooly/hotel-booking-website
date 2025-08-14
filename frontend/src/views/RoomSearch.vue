<template>
  <div class="room-search">
    <div class="container">

      <!-- Enhanced Search Header -->
      <div class="search-header">
        <div class="header-content">
          <div class="header-badge">
            <span class="badge-icon">🏆</span>
            <span class="badge-text">Luxury Collection</span>
          </div>
          <h1 class="search-title">
            Discover Your Perfect
            <span class="gradient-text">Luxury Experience</span>
          </h1>
          <p class="search-subtitle">
            Explore our curated collection of world-class accommodations, 
            where every detail is crafted for your ultimate comfort and satisfaction
          </p>
          <div class="search-stats">
            <div class="stat-item">
              <span class="stat-number">{{ filteredRooms.length }}</span>
              <span class="stat-label">Luxury Rooms</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ roomTypes.length }}</span>
              <span class="stat-label">Room Categories</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">24/7</span>
              <span class="stat-label">Concierge</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">5★</span>
              <span class="stat-label">Service</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Search Filters -->
      <div class="search-filters">
        <div class="search-card glass">
          <div class="search-header">
            <div class="search-header-content">
              <h3>Refine Your Luxury Search</h3>
              <p>Customize your preferences to discover the perfect accommodation</p>
            </div>
            <div class="search-header-decoration">
              <div class="decoration-line"></div>
              <div class="decoration-dot"></div>
              <div class="decoration-line"></div>
            </div>
          </div>
          <form @submit.prevent="handleSearch" class="search-form">
            <div class="search-grid">
              <div class="form-group">
                <label class="form-label">
                  <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                  </svg>
                  Check-in Date
                </label>
                <div class="input-wrapper">
                  <input
                    v-model="filters.checkIn"
                    type="date"
                    class="form-input"
                    :min="minDate"
                    @change="updateFilters"
                  />
                  <div class="input-decoration"></div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
                  </svg>
                  Check-out Date
                </label>
                <div class="input-wrapper">
                  <input
                    v-model="filters.checkOut"
                    type="date"
                    class="form-input"
                    :min="filters.checkIn || minDate"
                    @change="updateFilters"
                  />
                  <div class="input-decoration"></div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  Guests
                </label>
                <div class="input-wrapper">
                  <input
                    v-model="filters.guests"
                    type="number"
                    class="form-input"
                    :min="1"
                    :max="10"
                    @change="updateFilters"
                  />
                  <div class="input-decoration"></div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                  Room Type
                </label>
                <div class="input-wrapper">
                  <select 
                    v-model="filters.roomType" 
                    class="form-select"
                    @change="updateFilters"
                  >
                    <option value="">All Types</option>
                    <option 
                      v-for="type in roomTypes" 
                      :key="type.room_type" 
                      :value="type.room_type"
                    >
                      {{ type.room_type }} ({{ type.count }})
                    </option>
                  </select>
                  <div class="input-decoration"></div>
                </div>
              </div>
            </div>

            <div class="search-advanced">
              <div class="advanced-toggle" @click="toggleAdvanced">
                <span>Advanced Options</span>
                <svg class="toggle-icon" :class="{ 'rotated': showAdvanced }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </div>
              
              <div v-if="showAdvanced" class="advanced-options">
                <div class="price-range-group">
                  <label class="form-label">Price Range (per night)</label>
                  <div class="price-range">
                    <div class="input-wrapper">
                      <input
                        v-model="filters.minPrice"
                        type="number"
                        class="form-input price-input"
                        placeholder="Min"
                        :min="0"
                        @change="updateFilters"
                      />
                    </div>
                    <div class="price-separator">
                      <div class="separator-line"></div>
                      <span>to</span>
                      <div class="separator-line"></div>
                    </div>
                    <div class="input-wrapper">
                      <input
                        v-model="filters.maxPrice"
                        type="number"
                        class="form-input price-input"
                        placeholder="Max"
                        :min="0"
                        @change="updateFilters"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="search-actions">
              <button 
                type="submit" 
                class="search-button gradient-primary"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="loading-spinner"></span>
                <svg v-else class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                Search Luxury Rooms
              </button>
              <button 
                type="button" 
                class="clear-button"
                @click="clearFilters"
              >
                <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>
                </svg>
                Clear All
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Search Results -->
      <div class="search-results">
        <!-- Results Header -->
        <div class="results-header">
          <div class="results-info">
            <h2>Search Results</h2>
            <p v-if="totalResults > 0">
              {{ totalResults }} room{{ totalResults !== 1 ? 's' : '' }} found
            </p>
            <p v-else-if="!isLoading">No rooms found matching your criteria</p>
          </div>
          
          <div class="sort-controls">
            <label class="sort-label">Sort by:</label>
            <select v-model="sortBy" class="sort-select" @change="handleSort">
              <option value="price-asc">Lowest Price</option>
              <option value="price-desc">Highest Price</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Searching for rooms...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <h3>Error Loading Rooms</h3>
          <p>{{ error }}</p>
          <button @click="loadRooms" class="retry-button">Try Again</button>
        </div>

        <!-- Enhanced Results Grid -->
        <div v-else-if="rooms.length > 0" class="results-grid">
          <div 
            v-for="room in rooms" 
            :key="room.id"
            class="room-card luxury-card"
            @click="viewRoom(room.id)"
          >
            <div class="room-image">
              <img :src="room.images[0]" :alt="room.name" />
              <div class="room-price-overlay">
                <span class="room-price">S${{ room.price }}/night</span>
              </div>
              <div class="room-badge">
                <span class="badge-text">Luxury</span>
              </div>
              <div class="room-overlay">
                <div class="overlay-content">
                  <button class="quick-view-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Quick View
                  </button>
                </div>
              </div>
            </div>
            
            <div class="room-content">
              <div class="room-header">
                <h3 class="room-title">{{ room.name }}</h3>
                <div class="room-rating">
                  <span class="stars">★★★★★</span>
                  <span class="rating-text">5.0</span>
                </div>
              </div>
              <p class="room-description">{{ room.description }}</p>
              
              <div class="room-meta">
                <span class="room-type">{{ room.type }}</span>
                <span class="room-capacity">{{ room.capacity }} guests</span>
                <span class="room-size">{{ room.size }}m²</span>
              </div>
              
              <div class="room-amenities">
                <span 
                  v-for="(amenity, index) in room.amenities.slice(0, 4)" 
                  :key="index"
                  class="amenity-tag"
                >
                  <svg class="amenity-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                  {{ amenity }}
                </span>
                <span v-if="room.amenities.length > 4" class="amenity-more">
                  +{{ room.amenities.length - 4 }} more
                </span>
              </div>
            </div>
            
            <div class="room-actions">
              <button 
                class="view-button"
                @click.stop="viewRoom(room.id)"
              >
                <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View Details
              </button>
              <button 
                v-if="room.isAvailable"
                class="book-button gradient-primary"
                @click.stop="bookRoom(room.id)"
              >
                <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Book Now
              </button>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="!isLoading" class="no-results">
          <div class="no-results-icon">🏨</div>
          <h3>No Rooms Found</h3>
          <p>Try adjusting your search criteria or dates</p>
          <button @click="clearFilters" class="clear-filters-button">
            Clear All Filters
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="pagination-button"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>
          
          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              class="page-button"
              :class="{ active: page === currentPage }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            class="pagination-button"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Date Selection Modal -->
    <div v-if="showDateModal" class="modal-overlay" @click="closeDateModal">
      <div class="date-modal" @click.stop>
        <div class="modal-header">
          <h3>Select Your Dates</h3>
          <button class="close-button" @click="closeDateModal">×</button>
        </div>
        
        <div class="modal-content">
          <p class="modal-description">
            Please select your check-in and check-out dates to proceed with booking.
          </p>
          
          <div class="date-selection-form">
            <div class="date-input-group">
              <label class="date-label">
                <span class="label-text">Check-in Date</span>
                <span class="required-indicator">*</span>
              </label>
              <input
                v-model="modalDates.checkIn"
                type="date"
                class="date-input"
                :min="minDate"
                @change="updateModalCheckOut"
              />
            </div>
            
            <div class="date-input-group">
              <label class="date-label">
                <span class="label-text">Check-out Date</span>
                <span class="required-indicator">*</span>
              </label>
              <input
                v-model="modalDates.checkOut"
                type="date"
                class="date-input"
                :min="modalDates.checkIn || minDate"
              />
            </div>
            
            <div class="date-input-group">
              <label class="date-label">
                <span class="label-text">Number of Guests</span>
              </label>
              <select v-model="modalDates.guests" class="guest-select">
                <option v-for="i in 10" :key="i" :value="i">
                  {{ i }} {{ i === 1 ? 'guest' : 'guests' }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="date-summary" v-if="modalDates.checkIn && modalDates.checkOut">
            <div class="summary-item">
              <span class="summary-label">Duration:</span>
              <span class="summary-value">{{ modalTotalNights }} {{ modalTotalNights === 1 ? 'night' : 'nights' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Check-in:</span>
              <span class="summary-value">{{ formatDate(modalDates.checkIn) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Check-out:</span>
              <span class="summary-value">{{ formatDate(modalDates.checkOut) }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="cancel-button" @click="closeDateModal">
            Cancel
          </button>
          <button 
            class="proceed-button"
            :disabled="!modalDates.checkIn || !modalDates.checkOut"
            @click="proceedToBooking"
          >
            Proceed to Booking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRoomsStore } from '@/stores/rooms'
import { useBookingsStore } from '@/stores/bookings'

const router = useRouter()
const route = useRoute()
const roomsStore = useRoomsStore()
const bookingsStore = useBookingsStore()

// State
const sortBy = ref('price-asc')
const roomTypes = ref([])
const showDateModal = ref(false)
const selectedRoomId = ref(null)
const showAdvanced = ref(false)

// Modal dates
const modalDates = reactive({
  checkIn: '',
  checkOut: '',
  guests: 1
})

// Filters
const filters = reactive({
  checkIn: '',
  checkOut: '',
  guests: 1,
  roomType: '',
  minPrice: null,
  maxPrice: null
})

// Computed properties
const rooms = computed(() => roomsStore.rooms)
const filteredRooms = computed(() => roomsStore.filteredRooms)
const totalResults = computed(() => roomsStore.pagination.total)
const totalPages = computed(() => roomsStore.pagination.totalPages)
const currentPage = computed(() => roomsStore.pagination.page)
const hasActiveFilters = computed(() => roomsStore.hasActiveFilters)
const isLoading = computed(() => roomsStore.isLoading)
const error = computed(() => roomsStore.error)

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const modalTotalNights = computed(() => {
  if (!modalDates.checkIn || !modalDates.checkOut) return 0
  const checkIn = new Date(modalDates.checkIn)
  const checkOut = new Date(modalDates.checkOut)
  const diffTime = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

// Methods
const loadRooms = async () => {
  try {
    // Build query parameters
    const queryParams = {
      check_in: filters.checkIn,
      check_out: filters.checkOut,
      guests: filters.guests,
      room_type: filters.roomType,
      min_price: filters.minPrice,
      max_price: filters.maxPrice,
      page: roomsStore.pagination.page,
      limit: roomsStore.pagination.limit
    }
    
    // Remove empty values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === null || queryParams[key] === '' || queryParams[key] === undefined) {
        delete queryParams[key]
      }
    })
    
    const result = await roomsStore.getRooms(queryParams)
    if (!result.success) {
      console.error('Failed to load rooms:', result.error)
    }
  } catch (err) {
    console.error('Failed to load rooms:', err)
  }
}

const loadRoomTypes = async () => {
  try {
    const result = await roomsStore.getRoomTypes()
    if (result.success) {
      roomTypes.value = roomsStore.roomTypes
    }
  } catch (err) {
    console.error('Failed to load room types:', err)
  }
}

const updateFilters = () => {
  // Reset to first page when filters change
  roomsStore.setPage(1)
}

const handleSearch = async () => {
  // Validate required fields
  if (!filters.checkIn || !filters.checkOut) {
    alert('Please select both check-in and check-out dates')
    return
  }
  
  if (filters.checkIn >= filters.checkOut) {
    alert('Check-out date must be after check-in date')
    return
  }
  
  // Reset to first page when searching
  roomsStore.setPage(1)
  await loadRooms()
}

const clearFilters = () => {
  Object.assign(filters, {
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
    minPrice: null,
    maxPrice: null
  })
  
  roomsStore.clearSearchFilters()
  roomsStore.setPage(1)
  loadRooms()
}

const handleSort = async () => {
  // Apply sorting to the current results
  const sortedRooms = [...rooms.value]
  
  switch (sortBy.value) {
    case 'price-asc':
      sortedRooms.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sortedRooms.sort((a, b) => b.price - a.price)
      break
    case 'name-asc':
      sortedRooms.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      sortedRooms.sort((a, b) => b.name.localeCompare(a.name))
      break
  }
  
  // Update the rooms store with sorted results
  roomsStore.rooms = sortedRooms
}

const changePage = (page) => {
  roomsStore.setPage(page)
  loadRooms()
}

const viewRoom = (roomId) => {
  router.push(`/rooms/${roomId}`)
}

const bookRoom = (roomId) => {
  // Check if we have dates from the search filters
  if (filters.checkIn && filters.checkOut) {
    // If we have dates, proceed directly to booking
    const room = rooms.value.find(r => r.id === roomId)
    if (!room) {
      console.error('Room not found')
      return
    }

    // Set booking form data with current search filters
    bookingsStore.setBookingForm({
      roomId: room.id,
      roomName: room.name,
      roomType: room.type,
      roomPrice: room.price,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      guests: filters.guests
    })

    // Navigate to booking form
    router.push('/booking/form')
  } else {
    // If no dates, show the date selection modal
    selectedRoomId.value = roomId
    showDateModal.value = true
    
    // Pre-fill with current filter values if available
    modalDates.checkIn = filters.checkIn || ''
    modalDates.checkOut = filters.checkOut || ''
    modalDates.guests = filters.guests || 1
  }
}

const closeDateModal = () => {
  showDateModal.value = false
  selectedRoomId.value = null
  // Reset modal dates
  modalDates.checkIn = ''
  modalDates.checkOut = ''
  modalDates.guests = 1
}

const updateModalCheckOut = () => {
  // If check-in date is selected, set minimum check-out date
  if (modalDates.checkIn) {
    const checkIn = new Date(modalDates.checkIn)
    const nextDay = new Date(checkIn)
    nextDay.setDate(nextDay.getDate() + 1)
    
    // If current check-out is before the new minimum, clear it
    if (modalDates.checkOut && new Date(modalDates.checkOut) <= checkIn) {
      modalDates.checkOut = ''
    }
  }
}

const proceedToBooking = () => {
  if (!selectedRoomId.value || !modalDates.checkIn || !modalDates.checkOut) {
    return
  }

  const room = rooms.value.find(r => r.id === selectedRoomId.value)
  if (!room) {
    console.error('Room not found')
    return
  }

  // Set booking form data with modal dates
  bookingsStore.setBookingForm({
    roomId: room.id,
    roomName: room.name,
    roomType: room.type,
    roomPrice: room.price,
    checkIn: modalDates.checkIn,
    checkOut: modalDates.checkOut,
    guests: modalDates.guests
  })

  // Close modal
  closeDateModal()

  // Navigate to booking form
  router.push('/booking/form')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

// Watch for route query changes
watch(() => route.query, (query) => {
  if (query.checkIn) filters.checkIn = query.checkIn
  if (query.checkOut) filters.checkOut = query.checkOut
  if (query.guests) filters.guests = parseInt(query.guests)
  if (query.roomType) filters.roomType = query.roomType
}, { immediate: true })

// Load data on mount
onMounted(() => {
  loadRoomTypes()
  loadRooms()
})
</script>

<style scoped>
.room-search {
  padding: 3rem 0;
  min-height: 100vh;
  background-color: #f5f5f5;
  display: block;
  visibility: visible;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: block;
  visibility: visible;
}

/* Search Header */
.search-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 4rem 0;
  background: linear-gradient(135deg, 
    var(--color-primary-800) 0%, 
    var(--color-primary-900) 50%, 
    var(--color-primary-950) 100%);
  color: white;
  border-radius: 20px;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
  display: block;
  visibility: visible;
}

.search-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=400&fit=crop') center/cover;
  opacity: 0.15;
  z-index: 0;
}

.search-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, 
    rgba(16, 185, 129, 0.1) 0%, 
    transparent 50%),
    radial-gradient(circle at 70% 20%, 
    rgba(245, 158, 11, 0.1) 0%, 
    transparent 50%);
  z-index: 1;
}

.header-content {
  position: relative;
  z-index: 2;
}

/* Enhanced Badge */
.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, 
    var(--color-gold-400) 0%, 
    var(--color-gold-500) 50%, 
    var(--color-gold-600) 100%);
  color: var(--color-gray-900);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.3);
  border: 1px solid rgba(245, 158, 11, 0.2);
  backdrop-filter: blur(10px);
  animation: fadeInDown 0.8s ease-out 0.2s both;
}

.badge-icon {
  font-size: 1.125rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.badge-text {
  color: var(--color-gray-900) !important;
  font-weight: 700 !important;
  text-shadow: none !important;
}

/* Enhanced Title */
.search-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.gradient-text {
  background: linear-gradient(135deg, 
    var(--color-gold-300) 0%, 
    var(--color-gold-400) 25%, 
    var(--color-gold-500) 50%, 
    var(--color-gold-400) 75%, 
    var(--color-gold-300) 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
  text-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}

/* Enhanced Subtitle */
.search-subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.95) !important;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
  line-height: 1.6;
  font-weight: 400;
  animation: fadeInUp 0.8s ease-out 0.6s both;
  text-align: center;
}

/* Enhanced Stats */
.search-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
  min-width: 140px;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
}

.stat-item:hover::before {
  opacity: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-gold-300) 0%, 
    var(--color-gold-400) 50%, 
    var(--color-gold-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95) !important;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
}

/* Enhanced Animations */
@keyframes shimmer {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced Responsive Design */
@media (max-width: 1024px) {
  .search-stats {
    gap: 1.5rem;
  }
  
  .stat-item {
    padding: 1.25rem 1.5rem;
    min-width: 120px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .search-header {
    padding: 2rem 1rem 1rem;
    margin-bottom: 2rem;
  }
  
  .header-badge {
    padding: 0.625rem 1.25rem;
    font-size: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .search-title {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
  
  .search-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .search-stats {
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .stat-item {
    padding: 1rem 1.25rem;
    min-width: 100px;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .search-header {
    padding: 1.5rem 0.75rem 1rem;
    margin-bottom: 1.5rem;
  }
  
  .header-badge {
    padding: 0.5rem 1rem;
    font-size: 0.625rem;
    margin-bottom: 1rem;
  }
  
  .search-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .search-subtitle {
    font-size: 0.875rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .search-stats {
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .stat-item {
    padding: 0.75rem 1rem;
    min-width: 80px;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .stat-label {
    font-size: 0.625rem;
  }
}

/* Search Filters */
.search-filters {
  margin-bottom: 3rem;
  width: 100%;
  max-width: none;
  margin-left: auto;
  margin-right: auto;
  display: block;
  visibility: visible;
}

.search-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: var(--shadow-2xl);
  backdrop-filter: var(--backdrop-blur-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.search-header {
  background: var(--gradient-primary);
  color: white;
  padding: 3rem 2.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.search-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.search-header-content {
  position: relative;
  z-index: 1;
}

.search-header h3 {
  font-size: 1.75rem;
  font-weight: 900;
  margin: 0 0 0.75rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: white;
}

.search-header p {
  font-size: 1.125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.search-header-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.decoration-line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
}

.decoration-dot {
  width: 8px;
  height: 8px;
  background: var(--color-gold-400);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.search-form {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-gray-700);
  margin-bottom: 0.75rem;
}

.label-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary-600);
}

.input-wrapper {
  position: relative;
}

.form-input,
.form-select {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-gray-200);
  border-radius: 12px;
  font-size: 1rem;
  color: var(--color-gray-700);
  background: white;
  transition: all 0.3s ease;
  position: relative;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  transform: translateY(-1px);
}

.input-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  border-radius: 0 0 12px 12px;
}

.form-input:focus + .input-decoration,
.form-select:focus + .input-decoration {
  transform: scaleX(1);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-chevron-down'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  background-size: 1rem;
}

.search-advanced {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.advanced-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  color: #374151;
}

.advanced-toggle:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.toggle-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.advanced-options {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.price-range-group {
  margin-bottom: 1.5rem;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.price-input {
  flex: 1;
}

.price-separator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-weight: 500;
  font-size: 1rem;
}

.separator-line {
  flex: 1;
  height: 1px;
  background: #d1d5db;
}

.search-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
}

.search-button,
.clear-button {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-button {
  background: var(--gradient-primary);
  color: white;
  min-width: 200px;
  box-shadow: var(--shadow-lg);
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.search-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--shadow-sm);
}

.clear-button {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.clear-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.button-icon {
  width: 16px;
  height: 16px;
}

/* Search Results */
.search-results {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: block;
  visibility: visible;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.results-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.results-info p {
  margin: 0;
  color: #6b7280;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  color: #374151;
}

/* Loading and Error States */
.loading-container,
.error-container,
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid var(--color-primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon,
.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.retry-button,
.clear-filters-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-button:hover,
.clear-filters-button:hover {
  background: var(--color-primary-700);
}

/* Results Grid */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.room-card {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  position: relative;
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-200);
}

.luxury-card {
  background: linear-gradient(135deg, white 0%, var(--color-gray-50) 100%);
  border: 1px solid var(--color-gray-200);
}

.luxury-card:hover {
  border-color: var(--color-gold-300);
  box-shadow: var(--shadow-2xl);
}

.room-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.room-card:hover .room-image img {
  transform: scale(1.08);
}

.room-price-overlay {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.875rem;
  backdrop-filter: var(--backdrop-blur-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.room-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--gradient-gold);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-text {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.room-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.room-card:hover .room-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
}

.quick-view-btn {
  background: white;
  color: var(--color-gray-900);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quick-view-btn:hover {
  background: var(--color-primary-600);
  color: white;
  transform: translateY(-2px);
}

.quick-view-btn svg {
  width: 16px;
  height: 16px;
}

.room-content {
  padding: 1.5rem;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.room-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-gray-900);
  line-height: 1.3;
  flex: 1;
}

.room-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--color-success-50);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--color-success-200);
}

.stars {
  color: var(--color-gold-500);
  font-size: 0.75rem;
}

.rating-text {
  color: var(--color-success-700);
  font-weight: 600;
  font-size: 0.75rem;
}

.room-description {
  margin: 0 0 1rem 0;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.875rem;
}

.room-meta {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.room-type,
.room-capacity,
.room-size {
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.room-amenities {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.amenity-tag {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid var(--color-primary-200);
  transition: all 0.3s ease;
}

.amenity-tag:hover {
  background: var(--color-primary-100);
  transform: translateY(-1px);
}

.amenity-icon {
  width: 12px;
  height: 12px;
  color: var(--color-primary-600);
}

.amenity-more {
  color: #6b7280;
  font-size: 0.75rem;
  font-style: italic;
}

.room-actions {
  display: flex;
  gap: 0.75rem;
  padding: 0 1.5rem 1.5rem;
}

.view-button,
.book-button {
  flex: 1;
  padding: 0.875rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.view-button {
  background: white;
  color: var(--color-gray-700);
  border: 2px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.view-button:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-300);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.book-button {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.book-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.button-icon {
  width: 16px;
  height: 16px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background: #f9fafb;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-button {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
}

.page-button:hover {
  background: #f9fafb;
}

.page-button.active {
  background: var(--color-primary-600);
  color: white;
  border-color: var(--color-primary-600);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .search-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  .search-advanced {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .advanced-toggle {
    padding: 0.75rem 1rem;
  }
  
  .advanced-options {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .price-range-group {
    margin-bottom: 1.5rem;
  }
  
  .price-range {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .price-separator {
    display: none;
  }
  
  .search-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-button,
  .clear-button {
    width: 100%;
    justify-content: center;
  }
  
  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .room-actions {
    flex-direction: column;
  }
  
  .room-image {
    height: 200px;
  }
  
  .search-header {
    padding: 2.5rem 1.5rem 1.5rem;
  }
  
  .search-form {
    padding: 2rem;
  }
  
  .search-stats {
    gap: 2rem;
  }
  
  .stat-item {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 768px) {
  .room-search {
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .search-header {
    padding: 2rem 1rem 1rem;
    margin-bottom: 2rem;
    border-radius: 16px;
  }
  
  .search-title {
    font-size: 1.75rem;
    line-height: 1.3;
  }
  
  .search-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .search-stats {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .stat-item {
    padding: 0.75rem 1rem;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .search-filters {
    margin-bottom: 2rem;
  }
  
  .search-form {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  .search-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-group {
    max-width: 100%;
  }
  
  .form-label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .form-input,
  .form-select {
    padding: 0.875rem;
    font-size: 0.875rem;
  }
  
  .search-advanced {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .advanced-toggle {
    padding: 0.75rem 1rem;
  }
  
  .advanced-options {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .price-range-group {
    margin-bottom: 1.5rem;
  }
  
  .price-range {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .price-separator {
    display: none;
  }
  
  .search-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-button,
  .clear-button {
    width: 100%;
    justify-content: center;
    padding: 1rem 1.5rem;
    font-size: 0.875rem;
  }
  
  .results-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .results-info h2 {
    font-size: 1.25rem;
  }
  
  .results-info p {
    font-size: 0.875rem;
  }
  
  .sort-controls {
    width: 100%;
  }
  
  .sort-select {
    width: 100%;
    padding: 0.75rem;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .room-card {
    margin-bottom: 0;
  }
  
  .room-content {
    padding: 1.25rem;
  }
  
  .room-title {
    font-size: 1.125rem;
  }
  
  .room-description {
    font-size: 0.875rem;
    line-height: 1.4;
  }
  
  .room-meta {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  .room-type,
  .room-capacity,
  .room-size {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
  
  .room-amenities {
    gap: 0.375rem;
    margin-bottom: 1.25rem;
  }
  
  .amenity-tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
  
  .room-actions {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0 1.25rem 1.25rem;
  }
  
  .view-button,
  .book-button {
    width: 100%;
    padding: 0.875rem;
    font-size: 0.875rem;
    justify-content: center;
  }
  
  .room-image {
    height: 180px;
  }
  
  .room-price-overlay {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    bottom: 0.75rem;
    right: 0.75rem;
  }
  
  .room-badge {
    padding: 0.375rem 0.5rem;
    font-size: 0.625rem;
    top: 0.75rem;
    left: 0.75rem;
  }
  
  .pagination {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
  
  .pagination-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .page-button {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
    min-width: 2rem;
  }
  
  .loading-container,
  .error-container,
  .no-results {
    padding: 2rem 1rem;
  }
  
  .loading-spinner {
    width: 2rem;
    height: 2rem;
  }
  
  .error-icon,
  .no-results-icon {
    font-size: 3rem;
  }
  
  .retry-button,
  .clear-filters-button {
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .room-search {
    padding: 1.5rem 0;
  }
  
  .container {
    padding: 0 0.75rem;
  }
  
  .search-header {
    padding: 1.5rem 0.75rem 1rem;
    margin-bottom: 1.5rem;
    border-radius: 16px;
  }
  
  .search-title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .search-subtitle {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  
  .search-stats {
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .stat-item {
    padding: 0.5rem 0.75rem;
  }
  
  .stat-number {
    font-size: 1.125rem;
  }
  
  .stat-label {
    font-size: 0.625rem;
  }
  
  .search-filters {
    margin-bottom: 1.5rem;
  }
  
  .search-card {
    border-radius: 16px;
  }
  
  .search-form {
    padding: 1rem;
    gap: 1rem;
  }
  
  .search-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .form-label {
    font-size: 0.75rem;
    margin-bottom: 0.375rem;
  }
  
  .label-icon {
    width: 14px;
    height: 14px;
  }
  
  .form-input,
  .form-select {
    padding: 0.75rem;
    font-size: 0.875rem;
    border-radius: 8px;
  }
  
  .search-advanced {
    margin-top: 1rem;
    padding-top: 1rem;
  }
  
  .advanced-toggle {
    padding: 0.625rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .advanced-options {
    margin-top: 1rem;
    padding-top: 1rem;
  }
  
  .search-actions {
    gap: 0.5rem;
  }
  
  .search-button,
  .clear-button {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
    min-width: auto;
  }
  
  .button-icon {
    width: 14px;
    height: 14px;
  }
  
  .search-results {
    padding: 1rem;
    border-radius: 8px;
  }
  
  .results-header {
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
  }
  
  .results-info h2 {
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
  }
  
  .results-info p {
    font-size: 0.75rem;
  }
  
  .sort-controls {
    width: 100%;
  }
  
  .sort-label {
    font-size: 0.75rem;
  }
  
  .sort-select {
    padding: 0.625rem;
    font-size: 0.75rem;
  }
  
  .results-grid {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .room-content {
    padding: 1rem;
  }
  
  .room-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .room-description {
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .room-meta {
    gap: 0.375rem;
    margin-bottom: 0.75rem;
  }
  
  .room-type,
  .room-capacity,
  .room-size {
    font-size: 0.625rem;
    padding: 0.25rem 0.375rem;
  }
  
  .room-amenities {
    gap: 0.25rem;
    margin-bottom: 1rem;
  }
  
  .amenity-tag {
    font-size: 0.625rem;
    padding: 0.25rem 0.375rem;
  }
  
  .amenity-icon {
    width: 10px;
    height: 10px;
  }
  
  .room-actions {
    padding: 0 1rem 1rem;
    gap: 0.5rem;
  }
  
  .view-button,
  .book-button {
    padding: 0.75rem;
    font-size: 0.75rem;
  }
  
  .room-image {
    height: 160px;
  }
  
  .room-price-overlay {
    padding: 0.375rem 0.5rem;
    font-size: 0.625rem;
    bottom: 0.75rem;
    right: 0.75rem;
  }
  
  .room-badge {
    padding: 0.25rem 0.375rem;
    font-size: 0.5rem;
    top: 0.75rem;
    left: 0.75rem;
  }
  
  .pagination {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
  
  .pagination-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .page-button {
    padding: 0.5rem 0.625rem;
    font-size: 0.75rem;
    min-width: 2rem;
  }
  
  .loading-container,
  .error-container,
  .no-results {
    padding: 2rem 1rem;
  }
  
  .loading-spinner {
    width: 2rem;
    height: 2rem;
  }
  
  .error-icon,
  .no-results-icon {
    font-size: 3rem;
  }
  
  .retry-button,
  .clear-filters-button {
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Date Selection Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.date-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-content {
  padding: 2rem;
}

.modal-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.date-selection-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.label-text {
  color: #374151;
}

.required-indicator {
  color: #ef4444;
  font-weight: 600;
}

.date-input,
.guest-select {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #374151;
  background: white;
  transition: all 0.2s ease;
}

.date-input:focus,
.guest-select:focus {
  outline: none;
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.date-summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.summary-value {
  color: #1f2937;
  font-weight: 500;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 16px 16px;
}

.cancel-button,
.proceed-button {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 1rem;
}

.cancel-button {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.proceed-button {
  background: var(--color-primary-600);
  color: white;
}

.proceed-button:hover:not(:disabled) {
  background: var(--color-primary-700);
}

.proceed-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Responsive Modal */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .date-modal {
    max-width: 100%;
  }
  
  .modal-header,
  .modal-content,
  .modal-actions {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .cancel-button,
  .proceed-button {
    width: 100%;
  }
}

/* Text Visibility Improvements */
.search-header h3 {
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

.search-header p {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.stat-label {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.badge-text {
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.room-title {
  color: var(--color-gray-900) !important;
  font-weight: 700 !important;
}

.room-description {
  color: var(--color-gray-600) !important;
  line-height: 1.5 !important;
}

.room-type,
.room-capacity,
.room-size {
  color: var(--color-gray-700) !important;
  background: var(--color-gray-100) !important;
  font-weight: 500 !important;
}

.amenity-tag {
  color: var(--color-primary-700) !important;
  background: var(--color-primary-50) !important;
  border-color: var(--color-primary-200) !important;
  font-weight: 500 !important;
}

.results-info h2 {
  color: var(--color-gray-900) !important;
  font-weight: 600 !important;
}

.results-info p {
  color: var(--color-gray-600) !important;
}

.sort-label {
  color: var(--color-gray-700) !important;
  font-weight: 600 !important;
}

.sort-select {
  color: var(--color-gray-700) !important;
  background: white !important;
  border-color: var(--color-gray-300) !important;
}

/* Enhanced Focus States for Better Accessibility */
.form-input:focus,
.form-select:focus,
.sort-select:focus {
  border-color: var(--color-primary-500) !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
  outline: none !important;
}

.search-button:focus,
.clear-button:focus,
.view-button:focus,
.book-button:focus {
  outline: 2px solid var(--color-primary-500) !important;
  outline-offset: 2px !important;
}

/* Improved Loading States */
.loading-spinner {
  border-top-color: var(--color-primary-600) !important;
}

/* Better Button Contrast */
.search-button {
  background: var(--gradient-primary) !important;
  color: white !important;
  font-weight: 600 !important;
}

.book-button {
  background: var(--gradient-primary) !important;
  color: white !important;
  font-weight: 600 !important;
}

.view-button {
  background: white !important;
  color: var(--color-gray-700) !important;
  border-color: var(--color-gray-300) !important;
  font-weight: 600 !important;
}

.clear-button {
  background: white !important;
  color: var(--color-gray-700) !important;
  border-color: var(--color-gray-300) !important;
  font-weight: 600 !important;
}
</style>
