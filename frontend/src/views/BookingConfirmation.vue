<template>
  <div class="booking-confirmation">
    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading booking confirmation...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h2>Error Loading Booking</h2>
        <p>{{ error }}</p>
        <BaseButton @click="loadBooking" variant="primary" class="retry-button">
          <span class="btn-icon">🔄</span>
          <span class="btn-text">Try Again</span>
        </BaseButton>
      </div>

      <!-- Booking Confirmation -->
      <div v-else-if="booking" class="confirmation-content">
        <!-- Success Header -->
        <div class="success-header">
          <div class="success-icon-wrapper">
            <div class="success-icon">✅</div>
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your reservation has been successfully created. We've sent a confirmation email to your inbox.</p>
        </div>

        <!-- Booking Details -->
        <div class="booking-details">
          <div class="booking-header">
            <h2>Booking Details</h2>
            <div class="booking-id">
              <span class="id-label">Booking ID:</span>
              <span class="id-value">{{ booking.id }}</span>
            </div>
          </div>

          <div class="details-grid">
            <!-- Room Information -->
            <div class="detail-section">
              <h3>Room Information</h3>
              <div class="detail-item">
                <span class="detail-label">Room:</span>
                <span class="detail-value">{{ booking.roomName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Room Type:</span>
                <span class="detail-value">{{ booking.roomType }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Guests:</span>
                <span class="detail-value">{{ booking.guests }} {{ booking.guests === 1 ? 'guest' : 'guests' }}</span>
              </div>
            </div>

            <!-- Dates -->
            <div class="detail-section">
              <h3>Stay Details</h3>
              <div class="detail-item">
                <span class="detail-label">Check-in:</span>
                <span class="detail-value">{{ formatDate(booking.checkIn) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Check-out:</span>
                <span class="detail-value">{{ formatDate(booking.checkOut) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">{{ booking.totalNights }} {{ booking.totalNights === 1 ? 'night' : 'nights' }}</span>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="detail-section">
              <h3>Contact Information</h3>
              <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ booking.contactInfo?.firstName }} {{ booking.contactInfo?.lastName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ booking.contactInfo?.email }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{ booking.contactInfo?.phone }}</span>
              </div>
            </div>

            <!-- Additional Services -->
            <div v-if="booking.additionalServices && booking.additionalServices.length > 0" class="detail-section">
              <h3>Additional Services</h3>
              <div v-for="service in booking.additionalServices" :key="service" class="service-item">
                <span class="service-icon">{{ getServiceIcon(service) }}</span>
                <span class="service-name">{{ getServiceName(service) }}</span>
              </div>
            </div>
          </div>

          <!-- Special Requests -->
          <div v-if="booking.specialRequests" class="special-requests">
            <h3>Special Requests</h3>
            <p>{{ booking.specialRequests }}</p>
          </div>

          <!-- Price Breakdown -->
          <div class="price-breakdown">
            <h3>Price Breakdown</h3>
            <div class="price-items">
              <div class="price-item">
                <span>Room rate ({{ booking.totalNights }} {{ booking.totalNights === 1 ? 'night' : 'nights' }}):</span>
                <span>${{ booking.roomPrice * booking.totalNights }}</span>
              </div>
              <div v-if="booking.additionalServices && booking.additionalServices.length > 0" class="price-item">
                <span>Additional services:</span>
                <span>${{ calculateAdditionalServicesPrice() }}</span>
              </div>
              <div class="price-item total">
                <span>Total:</span>
                <span>${{ booking.totalPrice }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="next-steps">
          <h2>What's Next?</h2>
          <div class="steps-grid">
            <div class="step-item">
              <div class="step-icon">📧</div>
              <h4>Confirmation Email</h4>
              <p>Check your email for a detailed confirmation with all booking information.</p>
            </div>
            <div class="step-item">
              <div class="step-icon">📱</div>
              <h4>Save Booking ID</h4>
              <p>Keep your booking ID handy for any future inquiries or modifications.</p>
            </div>
            <div class="step-item">
              <div class="step-icon">🏨</div>
              <h4>Check-in Information</h4>
              <p>Check-in time is 3:00 PM. Please bring a valid photo ID and credit card.</p>
            </div>
            <div class="step-item">
              <div class="step-icon">❓</div>
              <h4>Need Help?</h4>
              <p>Contact us at +1 (555) 123-4567 or email support@hotel.com for assistance.</p>
            </div>
          </div>
        </div>

        <!-- Important Information -->
        <div class="important-info">
          <h3>Important Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-icon">⏰</span>
              <div class="info-content">
                <h4>Check-in/Check-out Times</h4>
                <p>Check-in: 3:00 PM | Check-out: 11:00 AM</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">💳</span>
              <div class="info-content">
                <h4>Payment</h4>
                <p>Payment will be processed at check-in. Credit card required for incidentals.</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">🚫</span>
              <div class="info-content">
                <h4>Cancellation Policy</h4>
                <p>Free cancellation up to 24 hours before check-in. No refunds for late cancellations.</p>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📋</span>
              <div class="info-content">
                <h4>Required Documents</h4>
                <p>Valid photo ID and credit card required at check-in.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Action Buttons -->
        <div class="action-buttons">
          <div class="action-button-group">
            <BaseButton @click="goToDashboard" variant="secondary" class="action-btn-dashboard">
              <span class="btn-icon">📊</span>
              <span class="btn-text">View My Bookings</span>
              <span class="btn-arrow">→</span>
            </BaseButton>
            <BaseButton @click="downloadConfirmation" variant="primary" class="action-btn-download">
              <span class="btn-icon">📄</span>
              <span class="btn-text">Download Confirmation</span>
              <span class="btn-arrow">↓</span>
            </BaseButton>
            <BaseButton @click="goHome" variant="outline" class="action-btn-home">
              <span class="btn-icon">🏠</span>
              <span class="btn-text">Back to Home</span>
              <span class="btn-arrow">→</span>
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Booking Not Found -->
      <div v-else class="not-found-container">
        <div class="not-found-icon">📋</div>
        <h2>Booking Not Found</h2>
        <p>The booking you're looking for doesn't exist or has been removed.</p>
        <BaseButton @click="$router.push('/dashboard')" variant="primary" class="not-found-button">
          <span class="btn-icon">📊</span>
          <span class="btn-text">View My Bookings</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingsStore } from '@/stores/bookings'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const bookingsStore = useBookingsStore()

// Reactive data
const booking = ref(null)
const isLoading = ref(false)
const error = ref(null)

// Methods
const loadBooking = async () => {
  const bookingId = route.params.bookingId
  if (!bookingId) {
    error.value = 'Booking ID is required'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const bookingData = await bookingsStore.getBookingById(bookingId)
    booking.value = bookingData
  } catch (err) {
    error.value = err.message || 'Failed to load booking details'
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getServiceIcon = (service) => {
  const icons = {
    'airport-transfer': '🚗',
    'breakfast': '🍳',
    'parking': '🅿️',
    'late-checkout': '⏰'
  }
  return icons[service] || '✨'
}

const getServiceName = (service) => {
  const names = {
    'airport-transfer': 'Airport Transfer',
    'breakfast': 'Daily Breakfast',
    'parking': 'Parking Space',
    'late-checkout': 'Late Check-out'
  }
  return names[service] || service
}

const calculateAdditionalServicesPrice = () => {
  if (!booking.value.additionalServices) return 0
  
  let total = 0
  const services = booking.value.additionalServices

  if (services.includes('airport-transfer')) total += 50
  if (services.includes('breakfast')) total += 25 * booking.value.totalNights
  if (services.includes('parking')) total += 15 * booking.value.totalNights
  if (services.includes('late-checkout')) total += 30

  return total
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const downloadConfirmation = () => {
  // In a real application, this would generate and download a PDF
  // For now, we'll just show an alert
  alert('Confirmation download feature would be implemented here.')
}

const goHome = () => {
  router.push('/')
}

// Lifecycle
onMounted(() => {
  loadBooking()
})
</script>

<style scoped>
.booking-confirmation {
  padding: 2rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--color-gray-50) 0%, 
    var(--color-gray-100) 50%, 
    var(--color-gray-50) 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
}

.booking-confirmation::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23f3f4f6" opacity="0.3"/><circle cx="75" cy="75" r="1" fill="%23f3f4f6" opacity="0.3"/><circle cx="50" cy="10" r="0.5" fill="%23f3f4f6" opacity="0.3"/><circle cx="10" cy="60" r="0.5" fill="%23f3f4f6" opacity="0.3"/><circle cx="90" cy="40" r="0.5" fill="%23f3f4f6" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
  z-index: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
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

.success-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 4rem 3rem;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  border-radius: 28px;
  border: 1px solid var(--color-primary-300);
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.2);
  animation: fadeInUp 0.8s ease-out 0.2s both;
  position: relative;
  overflow: hidden;
  color: white;
}

.success-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, 
    rgba(255, 255, 255, 0.1) 0%, 
    transparent 50%),
    radial-gradient(circle at 70% 20%, 
    rgba(255, 255, 255, 0.05) 0%, 
    transparent 50%);
  z-index: 0;
}

.success-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.8) 0%, 
    rgba(255, 255, 255, 0.4) 50%, 
    rgba(255, 255, 255, 0.8) 100%);
  animation: shimmer 2s ease-in-out infinite;
}

.success-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out 0.4s both;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.success-icon-wrapper {
  position: relative;
  display: inline-block;
}

.success-icon-wrapper::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s ease-in-out infinite;
}

.success-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out 0.6s both;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.02em;
}

.success-header p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out 0.8s both;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.booking-details {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(249, 250, 251, 0.9) 100%);
  border: 1px solid var(--color-gray-100);
  border-radius: 28px;
  padding: 3rem;
  margin-bottom: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out 1s both;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.booking-details::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600), var(--color-primary-700));
}

.booking-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary-200);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-primary-200);
  position: relative;
  z-index: 1;
}

.booking-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.booking-id {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.id-label {
  font-weight: 500;
  color: var(--color-gray-600);
}

.id-value {
  background: linear-gradient(135deg, 
    var(--color-primary-500) 0%, 
    var(--color-primary-600) 100%);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 16px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  border: 2px solid var(--color-primary-400);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  position: relative;
  overflow: hidden;
}

.id-value::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.id-value:hover::before {
  left: 100%;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  margin-bottom: 2.5rem;
  position: relative;
  z-index: 1;
}

.detail-section {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--color-gray-100);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.detail-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.detail-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-200);
}

.detail-section:hover::before {
  opacity: 1;
}

.detail-section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-gray-100);
  transition: all 0.2s ease;
  position: relative;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item:hover {
  background: rgba(16, 185, 129, 0.05);
  margin: 0 -1rem;
  padding: 1rem;
  border-radius: 12px;
}

.detail-label {
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: 0.95rem;
}

.detail-value {
  color: var(--color-gray-900);
  font-weight: 600;
  font-size: 1rem;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-gray-100);
  transition: all 0.2s ease;
}

.service-item:last-child {
  border-bottom: none;
}

.service-item:hover {
  background: rgba(16, 185, 129, 0.05);
  margin: 0 -1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
}

.service-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%);
  border-radius: 12px;
  border: 2px solid var(--color-primary-200);
}

.service-name {
  color: var(--color-gray-700);
  font-weight: 600;
  font-size: 1rem;
}

.special-requests {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-gray-50);
  border-radius: var(--border-radius-md);
}

.special-requests h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.special-requests p {
  margin: 0;
  color: var(--color-gray-700);
  line-height: 1.5;
}

.price-breakdown {
  border-top: 2px solid var(--color-gray-200);
  padding-top: 2.5rem;
  margin-top: 2rem;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.05) 0%, 
    rgba(16, 185, 129, 0.08) 100%);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid var(--color-primary-200);
  position: relative;
  z-index: 1;
}

.price-breakdown h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.price-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(16, 185, 129, 0.1);
  transition: all 0.2s ease;
}

.price-item:last-child {
  border-bottom: none;
}

.price-item:hover {
  background: rgba(255, 255, 255, 0.5);
  margin: 0 -1rem;
  padding: 1rem;
  border-radius: 12px;
}

.price-item.total {
  border-top: 2px solid var(--color-primary-300);
  padding-top: 1.5rem;
  margin-top: 1rem;
  font-weight: 700;
  font-size: 1.25rem;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.1) 0%, 
    rgba(16, 185, 129, 0.15) 100%);
  margin: 1rem -1rem -1rem -1rem;
  padding: 1.5rem 1rem 1rem 1rem;
  border-radius: 16px;
  border: 2px solid var(--color-primary-200);
}

.next-steps {
  margin-bottom: 4rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border-radius: 28px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-gray-100);
  position: relative;
  overflow: hidden;
}

.next-steps::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600), var(--color-primary-700));
}

.next-steps h2 {
  margin: 0 0 3rem 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  position: relative;
  z-index: 1;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  position: relative;
  z-index: 1;
}

.step-item {
  text-align: center;
  padding: 2.5rem 2rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border: 1px solid var(--color-gray-100);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.step-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.step-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary-200);
}

.step-item:hover::before {
  opacity: 1;
}

.step-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.step-item h4 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-item p {
  margin: 0;
  color: var(--color-gray-600);
  line-height: 1.6;
  font-size: 1rem;
}

.important-info {
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  margin-bottom: 3rem;
}

.important-info h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.info-content p {
  margin: 0;
  color: var(--color-gray-600);
  font-size: 0.9rem;
  line-height: 1.4;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-gray-100);
  position: relative;
  overflow: hidden;
}

.action-buttons::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600), var(--color-primary-700));
}

.action-button-group {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.action-btn-dashboard,
.action-btn-download,
.action-btn-home {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.action-btn-dashboard {
  background: linear-gradient(135deg, 
    var(--color-primary-500) 0%, 
    var(--color-primary-600) 100%);
  border: 2px solid var(--color-primary-500);
  color: white;
}

.action-btn-dashboard::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.action-btn-dashboard:hover {
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  border-color: var(--color-primary-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.action-btn-dashboard:hover::before {
  left: 100%;
}

.action-btn-download {
  background: linear-gradient(135deg, 
    var(--color-success-500) 0%, 
    var(--color-success-600) 100%);
  border: 2px solid var(--color-success-500);
  color: white;
}

.action-btn-download::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.action-btn-download:hover {
  background: linear-gradient(135deg, 
    var(--color-success-600) 0%, 
    var(--color-success-700) 100%);
  border-color: var(--color-success-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
}

.action-btn-download:hover::before {
  left: 100%;
}

.action-btn-home {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border: 2px solid var(--color-gray-300);
  color: var(--color-gray-700);
}

.action-btn-home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.05) 0%, 
    rgba(16, 185, 129, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.action-btn-home:hover {
  border-color: var(--color-primary-400);
  color: var(--color-primary-700);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.action-btn-home:hover::before {
  opacity: 1;
}

.btn-icon {
  font-size: 1.25rem;
  position: relative;
  z-index: 1;
}

.btn-text {
  position: relative;
  z-index: 1;
  font-weight: 600;
}

.btn-arrow {
  font-size: 1.1rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
}

.action-btn-dashboard:hover .btn-arrow,
.action-btn-download:hover .btn-arrow,
.action-btn-home:hover .btn-arrow {
  transform: translateX(3px);
}

.action-btn-download:hover .btn-arrow {
  transform: translateY(3px);
}

.retry-button,
.not-found-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, 
    var(--color-primary-500) 0%, 
    var(--color-primary-600) 100%);
  border: 2px solid var(--color-primary-500);
  color: white;
}

.retry-button::before,
.not-found-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.retry-button:hover,
.not-found-button:hover {
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  border-color: var(--color-primary-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.retry-button:hover::before,
.not-found-button:hover::before {
  left: 100%;
}

@media (max-width: 768px) {
  .success-header h1 {
    font-size: 2rem;
  }

  .booking-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    padding: 1.5rem;
  }
  
  .action-button-group {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-btn-dashboard,
  .action-btn-download,
  .action-btn-home {
    min-width: auto;
    width: 100%;
    max-width: 300px;
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

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.4;
  }
}
</style>
