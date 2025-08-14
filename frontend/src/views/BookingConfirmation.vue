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
        <BaseButton @click="loadBooking" variant="primary">Try Again</BaseButton>
      </div>

      <!-- Booking Confirmation -->
      <div v-else-if="booking" class="confirmation-content">
        <!-- Success Header -->
        <div class="success-header">
          <div class="success-icon">✅</div>
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

        <!-- Action Buttons -->
        <div class="action-buttons">
          <BaseButton @click="goToDashboard" variant="secondary">
            View My Bookings
          </BaseButton>
          <BaseButton @click="downloadConfirmation" variant="primary">
            Download Confirmation
          </BaseButton>
          <BaseButton @click="goHome" variant="outline">
            Back to Home
          </BaseButton>
        </div>
      </div>

      <!-- Booking Not Found -->
      <div v-else class="not-found-container">
        <div class="not-found-icon">📋</div>
        <h2>Booking Not Found</h2>
        <p>The booking you're looking for doesn't exist or has been removed.</p>
        <BaseButton @click="$router.push('/dashboard')" variant="primary">
          View My Bookings
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
  background: var(--color-gray-50);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  padding: 3rem;
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-success-50) 100%);
  border-radius: 24px;
  border: 1px solid var(--color-primary-200);
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.1);
  animation: fadeInUp 0.8s ease-out 0.2s both;
  position: relative;
  overflow: hidden;
}

.success-header::before {
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
  z-index: 0;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.success-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.success-header p {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  margin: 0;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.booking-details {
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.8s ease-out 1s both;
  transition: all 0.4s ease;
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
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-primary-600);
}

.booking-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
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
    var(--color-primary-100) 0%, 
    var(--color-primary-200) 100%);
  color: var(--color-primary-700);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-family: monospace;
  border: 1px solid var(--color-primary-300);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-gray-100);
}

.detail-label {
  font-weight: 500;
  color: var(--color-gray-600);
}

.detail-value {
  color: var(--color-gray-900);
  font-weight: 500;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.service-icon {
  font-size: 1.2rem;
}

.service-name {
  color: var(--color-gray-700);
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
  padding-top: 2rem;
}

.price-breakdown h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.price-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.price-item.total {
  border-top: 1px solid var(--color-gray-200);
  padding-top: 1rem;
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--color-primary);
}

.next-steps {
  margin-bottom: 3rem;
}

.next-steps h2 {
  margin: 0 0 2rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  text-align: center;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step-item {
  text-align: center;
  padding: 2rem;
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.step-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.step-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.step-item h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.step-item p {
  margin: 0;
  color: var(--color-gray-600);
  line-height: 1.5;
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
  gap: 1rem;
  flex-wrap: wrap;
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
    flex-direction: column;
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
