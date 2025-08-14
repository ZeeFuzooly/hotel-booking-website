<template>
  <div class="room-detail">
    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading room details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h2>Error Loading Room</h2>
        <p>{{ error }}</p>
        <BaseButton @click="loadRoom" variant="primary">Try Again</BaseButton>
      </div>

      <!-- Room Details -->
      <div v-else-if="room" class="room-content">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <span class="breadcrumb-separator">/</span>
          <router-link to="/rooms" class="breadcrumb-link">Rooms</router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ room.name }}</span>
        </nav>

        <!-- Room Header -->
        <div class="room-header">
          <div class="room-title">
            <h1>{{ room.name }}</h1>
            <div class="room-meta">
              <span class="room-type">{{ room.type }}</span>
              <span class="room-capacity">{{ room.capacity }} guests</span>
              <span class="room-size">{{ room.size }}m²</span>
            </div>
          </div>
          <div class="room-price">
            <span class="price-amount">S${{ room.price }}</span>
            <span class="price-period">/night</span>
          </div>
        </div>

        <!-- Room Images -->
        <div class="room-images">
          <div class="main-image">
            <img :src="room.images[0]" :alt="room.name" />
          </div>
          <div class="image-gallery" v-if="room.images.length > 1">
            <div 
              v-for="(image, index) in room.images.slice(1, 5)" 
              :key="index"
              class="gallery-image"
              @click="selectedImage = image"
            >
              <img :src="image" :alt="`${room.name} - Image ${index + 2}`" />
            </div>
          </div>
        </div>

        <!-- Image Modal -->
        <BaseModal v-model:isOpen="showImageModal" title="" size="xl">
          <div class="image-modal-content">
            <img :src="selectedImage" :alt="room.name" />
          </div>
        </BaseModal>

        <!-- Room Content Grid -->
        <div class="room-content-grid">
          <!-- Main Content -->
          <div class="room-main">
            <!-- Description -->
            <section class="room-section">
              <h2>Description</h2>
              <p>{{ room.description }}</p>
            </section>

            <!-- Amenities -->
            <section class="room-section">
              <h2>Amenities</h2>
              <div class="amenities-grid">
                <div 
                  v-for="amenity in room.amenities" 
                  :key="amenity"
                  class="amenity-item"
                >
                  <span class="amenity-icon">✓</span>
                  <span class="amenity-text">{{ amenity }}</span>
                </div>
              </div>
            </section>

            <!-- Room Details -->
            <section class="room-section">
              <h2>Room Details</h2>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Room Type:</span>
                  <span class="detail-value">{{ room.type }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Capacity:</span>
                  <span class="detail-value">{{ room.capacity }} guests</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Size:</span>
                  <span class="detail-value">{{ room.size }}m²</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Bed Type:</span>
                  <span class="detail-value">{{ room.bedType }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">View:</span>
                  <span class="detail-value">{{ room.view }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Floor:</span>
                  <span class="detail-value">{{ room.floor }}</span>
                </div>
              </div>
            </section>

            <!-- House Rules -->
            <section class="room-section">
              <h2>House Rules</h2>
              <ul class="house-rules">
                <li>Check-in: 3:00 PM</li>
                <li>Check-out: 11:00 AM</li>
                <li>No smoking</li>
                <li>No pets allowed</li>
                <li>Quiet hours: 10:00 PM - 8:00 AM</li>
              </ul>
            </section>
          </div>

          <!-- Booking Sidebar -->
          <div class="booking-sidebar">
            <div class="booking-card">
              <h3>Book This Room</h3>
              
              <!-- Date Selection -->
              <div class="date-selection">
                <BaseInput
                  v-model="bookingDates.checkIn"
                  label="Check-in Date"
                  type="date"
                  :min="today"
                  @change="updateAvailability"
                />
                <BaseInput
                  v-model="bookingDates.checkOut"
                  label="Check-out Date"
                  type="date"
                  :min="minCheckOut"
                  @change="updateAvailability"
                />
              </div>

              <!-- Guest Selection -->
              <div class="guest-selection">
                <label class="form-label">Number of Guests</label>
                <select v-model="bookingDates.guests" class="form-select">
                  <option v-for="i in room.capacity" :key="i" :value="i">
                    {{ i }} {{ i === 1 ? 'guest' : 'guests' }}
                  </option>
                </select>
              </div>

              <!-- Availability Status -->
              <div v-if="availabilityChecked" class="availability-status">
                <div v-if="isAvailable" class="status-available">
                  <span class="status-icon">✓</span>
                  <span>Available for selected dates</span>
                </div>
                <div v-else class="status-unavailable">
                  <span class="status-icon">✗</span>
                  <span>Not available for selected dates</span>
                </div>
              </div>

              <!-- Price Calculation -->
              <div v-if="isAvailable && totalNights > 0" class="price-breakdown">
                <div class="price-row">
                  <span>Price per night:</span>
                  <span>S${{ room.price }}</span>
                </div>
                <div class="price-row">
                  <span>Number of nights:</span>
                  <span>{{ totalNights }}</span>
                </div>
                <div class="price-row total">
                  <span>Total:</span>
                  <span>S${{ totalPrice }}</span>
                </div>
              </div>

              <!-- Booking Actions -->
              <div class="booking-actions">
                <BaseButton
                  v-if="!isAuthenticated"
                  @click="goToLogin"
                  variant="primary"
                  fullWidth
                >
                  Login to Book
                </BaseButton>
                <BaseButton
                  v-else-if="!isAvailable"
                  variant="secondary"
                  fullWidth
                  disabled
                >
                  Not Available
                </BaseButton>
                <BaseButton
                  v-else
                  @click="proceedToBooking"
                  variant="primary"
                  fullWidth
                  :loading="isCheckingAvailability"
                >
                  Book Now
                </BaseButton>
              </div>

              <!-- Quick Info -->
              <div class="quick-info">
                <div class="info-item">
                  <span class="info-icon">📞</span>
                  <span>Need help? Call us at +1 (555) 123-4567</span>
                </div>
                <div class="info-item">
                  <span class="info-icon">💳</span>
                  <span>Free cancellation up to 24 hours before check-in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Not Found -->
      <div v-else class="not-found-container">
        <div class="not-found-icon">🏨</div>
        <h2>Room Not Found</h2>
        <p>The room you're looking for doesn't exist or has been removed.</p>
        <BaseButton @click="$router.push('/rooms')" variant="primary">
          Browse All Rooms
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoomsStore } from '@/stores/rooms'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const roomsStore = useRoomsStore()
const authStore = useAuthStore()
const bookingsStore = useBookingsStore()

// Reactive data
const room = ref(null)
const isLoading = ref(false)
const error = ref(null)
const selectedImage = ref('')
const showImageModal = ref(false)
const availabilityChecked = ref(false)
const isCheckingAvailability = ref(false)

// Booking form data
const bookingDates = ref({
  checkIn: '',
  checkOut: '',
  guests: 1
})

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})
const minCheckOut = computed(() => {
  if (!bookingDates.value.checkIn) return today.value
  const checkIn = new Date(bookingDates.value.checkIn)
  const nextDay = new Date(checkIn)
  nextDay.setDate(nextDay.getDate() + 1)
  return nextDay.toISOString().split('T')[0]
})
const totalNights = computed(() => {
  if (!bookingDates.value.checkIn || !bookingDates.value.checkOut) return 0
  const checkIn = new Date(bookingDates.value.checkIn)
  const checkOut = new Date(bookingDates.value.checkOut)
  const diffTime = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})
const totalPrice = computed(() => {
  if (!room.value || totalNights.value === 0) return 0
  return room.value.price * totalNights.value
})
const isAvailable = computed(() => {
  return availabilityChecked.value && !isCheckingAvailability.value && true // For now, assume available
})

// Methods
const loadRoom = async () => {
  const roomId = route.params.id
  if (!roomId) {
    error.value = 'Room ID is required'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const result = await roomsStore.getRoomById(roomId)
    if (result.success) {
      room.value = result.room
      bookingDates.value.guests = result.room.capacity
    } else {
      error.value = result.error || 'Failed to load room details'
    }
  } catch (err) {
    error.value = err.message || 'Failed to load room details'
  } finally {
    isLoading.value = false
  }
}

const updateAvailability = async () => {
  if (!bookingDates.value.checkIn || !bookingDates.value.checkOut) {
    availabilityChecked.value = false
    return
  }

  isCheckingAvailability.value = true
  availabilityChecked.value = false

  try {
    const result = await roomsStore.checkRoomAvailability(
      room.value.id,
      bookingDates.value.checkIn,
      bookingDates.value.checkOut
    )
    if (result.success) {
      availabilityChecked.value = true
    } else {
      console.error('Error checking availability:', result.error)
      availabilityChecked.value = true
    }
  } catch (err) {
    console.error('Error checking availability:', err)
    availabilityChecked.value = true
  } finally {
    isCheckingAvailability.value = false
  }
}

const proceedToBooking = () => {
  if (!isAuthenticated.value) {
    goToLogin()
    return
  }

  // Set booking form data - the store will calculate totalNights and totalPrice automatically
  bookingsStore.setBookingForm({
    roomId: room.value.id,
    roomName: room.value.name,
    roomType: room.value.type,
    roomPrice: room.value.price,
    checkIn: bookingDates.value.checkIn,
    checkOut: bookingDates.value.checkOut,
    guests: bookingDates.value.guests
  })

  // Navigate to booking form
  router.push('/booking/form')
}

const goToLogin = () => {
  router.push({
    name: 'login',
    query: { redirect: route.fullPath }
  })
}

// Watch for image selection
watch(selectedImage, (newImage) => {
  if (newImage) {
    showImageModal.value = true
  }
})

// Lifecycle
onMounted(() => {
  loadRoom()
})
</script>

<style scoped>
.room-detail {
  padding: 2rem 0;
  min-height: 100vh;
  background: var(--color-gray-50);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading-container,
.error-container,
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon,
.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: var(--color-gray-500);
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.breadcrumb-link {
  color: var(--color-primary-600);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.breadcrumb-link:hover {
  color: var(--color-primary-700);
  text-decoration: underline;
  transform: translateX(2px);
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--color-gray-400);
}

.breadcrumb-current {
  color: var(--color-gray-600);
  font-weight: 600;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  gap: 2rem;
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-gray-100);
  transition: all 0.4s ease;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.room-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary-200);
}

.room-title h1 {
  margin: 0 0 1rem 0;
  font-size: 2.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.room-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.room-type,
.room-capacity,
.room-size {
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%);
  color: var(--color-primary-700);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid var(--color-primary-200);
  transition: all 0.3s ease;
}

.room-type:hover,
.room-capacity:hover,
.room-size:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.room-price {
  text-align: right;
  flex-shrink: 0;
}

.price-amount {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-gold-500) 0%, 
    var(--color-gold-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.price-period {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  font-weight: 500;
}

.room-images {
  margin-bottom: 3rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.main-image {
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #f3f4f6;
}

.gallery-image {
  height: 120px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
}

.gallery-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-modal-content {
  text-align: center;
}

.image-modal-content img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.room-content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

.room-main {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.room-section {
  margin-bottom: 3rem;
}

.room-section:last-child {
  margin-bottom: 0;
}

.room-section h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 0.75rem;
}

.room-section p {
  line-height: 1.7;
  color: #374151;
  font-size: 1rem;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.amenity-icon {
  color: #059669;
  font-weight: bold;
  font-size: 1.1rem;
}

.amenity-text {
  color: #374151;
  font-weight: 500;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.detail-label {
  font-weight: 600;
  color: #374151;
}

.detail-value {
  color: #111827;
  font-weight: 500;
}

.house-rules {
  list-style: none;
  padding: 0;
}

.house-rules li {
  padding: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
}

.house-rules li:last-child {
  border-bottom: none;
}

.house-rules li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #1f2937;
  font-weight: bold;
  font-size: 1.2rem;
}

.booking-sidebar {
  position: sticky;
  top: 2rem;
}

.booking-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.booking-card h3 {
  margin: 0 0 2rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
}

.date-selection {
  margin-bottom: 2rem;
}

.guest-selection {
  margin-bottom: 2rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-select {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  transition: all 0.2s ease;
  color: #374151;
}

.form-select:focus {
  outline: none;
  border-color: #1f2937;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.availability-status {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid;
}

.status-available {
  background: #f0fdf4;
  color: #166534;
  border-color: #bbf7d0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-unavailable {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-icon {
  font-weight: bold;
  font-size: 1.1rem;
}

.price-breakdown {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #374151;
}

.price-row.total {
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
  margin-top: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #111827;
}

.booking-actions {
  margin-bottom: 2rem;
}

.quick-info {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  font-size: 1rem;
  margin-top: 0.125rem;
}

@media (max-width: 1024px) {
  .room-content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .booking-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .room-detail {
    padding: 1rem 0;
  }

  .container {
    padding: 0 0.75rem;
  }

  .room-header {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .room-title h1 {
    font-size: 2rem;
  }

  .room-price {
    text-align: left;
  }

  .price-amount {
    font-size: 2rem;
  }

  .main-image {
    height: 300px;
  }

  .image-gallery {
    grid-template-columns: repeat(2, 1fr);
  }

  .room-main {
    padding: 1.5rem;
  }

  .booking-card {
    padding: 1.5rem;
  }

  .amenities-grid,
  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .room-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .room-type,
  .room-capacity,
  .room-size {
    align-self: flex-start;
  }

  .image-gallery {
    grid-template-columns: 1fr;
  }

  .gallery-image {
    height: 150px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Enhanced Animations */
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

@keyframes shimmer {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
