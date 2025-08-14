<template>
  <div class="dashboard">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-background">
        <div class="gradient-overlay"></div>
      </div>
      
      <div class="container">
        <div class="hero-content">
          <div class="welcome-card">
            <div class="welcome-header">
              <div class="user-info">
                <div class="avatar">
                  {{ authStore.userFullName?.charAt(0) || 'U' }}
                </div>
                <div class="welcome-text">
                  <h1>Welcome back, {{ authStore.userFullName || 'Guest' }}! 👋</h1>
                  <p>Here's your personalized dashboard</p>
                </div>
              </div>
              <div class="quick-stats">
                <div class="stat-item">
                  <span class="stat-number">{{ bookingsStore.bookings.length }}</span>
                  <span class="stat-label">Total Bookings</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ upcomingBookings.length }}</span>
                  <span class="stat-label">Upcoming</span>
                </div>
              </div>
            </div>
            <div class="welcome-actions">
              <button class="primary-btn" @click="$router.push('/rooms')">
                <span class="btn-icon">🏨</span>
                Book New Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Stats Overview -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-icon upcoming">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ upcomingBookings.length }}</h3>
            <p>Upcoming Bookings</p>
            <span class="status active">Active</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon current">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ currentBookings.length }}</h3>
            <p>Current Stays</p>
            <span class="status staying">Staying Now</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon past">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ pastBookings.length }}</h3>
            <p>Past Stays</p>
            <span class="status completed">Completed</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon total">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ bookingsStore.bookings.length }}</h3>
            <p>Total Bookings</p>
            <span class="status all-time">All Time</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="bookingsStore.error" class="error-state">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{{ bookingsStore.error }}</p>
          <button class="retry-btn" @click="loadBookings">Try Again</button>
        </div>
      </div>

      <!-- Bookings Content -->
      <div v-else class="bookings-content">
        <!-- Upcoming Bookings -->
        <div v-if="upcomingBookings.length > 0" class="bookings-section">
          <div class="section-header">
            <div class="section-title">
              <h2>Upcoming Bookings</h2>
              <span class="badge">{{ upcomingBookings.length }}</span>
            </div>
            <router-link to="/bookings" class="view-all">View All →</router-link>
          </div>
          
          <div class="bookings-grid">
            <div 
              v-for="booking in upcomingBookings.slice(0, 3)" 
              :key="booking.id" 
              class="booking-card"
            >
              <div class="card-header">
                <h3>{{ booking.room.name }}</h3>
                <span class="status-badge confirmed">Confirmed</span>
              </div>
              <div class="card-body">
                <div class="booking-info">
                  <div class="info-item">
                    <span class="label">Dates:</span>
                    <span class="value">{{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Guests:</span>
                    <span class="value">{{ booking.guests }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Total:</span>
                    <span class="value price">${{ booking.totalPrice }}</span>
                  </div>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-secondary" @click="viewBooking(booking.id)">View Details</button>
                <button v-if="canCancel(booking)" class="btn-danger" @click="cancelBooking(booking.id)">Cancel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Current Bookings -->
        <div v-if="currentBookings.length > 0" class="bookings-section">
          <div class="section-header">
            <div class="section-title">
              <h2>Current Stays</h2>
              <span class="badge current">{{ currentBookings.length }}</span>
            </div>
          </div>
          
          <div class="bookings-grid">
            <div 
              v-for="booking in currentBookings" 
              :key="booking.id" 
              class="booking-card current"
            >
              <div class="card-header">
                <h3>{{ booking.room.name }}</h3>
                <span class="status-badge current">Currently Staying</span>
              </div>
              <div class="card-body">
                <div class="booking-info">
                  <div class="info-item">
                    <span class="label">Check-in:</span>
                    <span class="value">{{ formatDate(booking.checkIn) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Check-out:</span>
                    <span class="value">{{ formatDate(booking.checkOut) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Guests:</span>
                    <span class="value">{{ booking.guests }}</span>
                  </div>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-secondary" @click="viewBooking(booking.id)">View Details</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Past Bookings -->
        <div v-if="pastBookings.length > 0" class="bookings-section">
          <div class="section-header">
            <div class="section-title">
              <h2>Recent Stays</h2>
              <span class="badge past">{{ pastBookings.length }}</span>
            </div>
            <router-link to="/bookings" class="view-all">View All →</router-link>
          </div>
          
          <div class="bookings-grid">
            <div 
              v-for="booking in pastBookings.slice(0, 3)" 
              :key="booking.id" 
              class="booking-card past"
            >
              <div class="card-header">
                <h3>{{ booking.room.name }}</h3>
                <span class="status-badge completed">Completed</span>
              </div>
              <div class="card-body">
                <div class="booking-info">
                  <div class="info-item">
                    <span class="label">Dates:</span>
                    <span class="value">{{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Guests:</span>
                    <span class="value">{{ booking.guests }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Total:</span>
                    <span class="value price">${{ booking.totalPrice }}</span>
                  </div>
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-secondary" @click="viewBooking(booking.id)">View Details</button>
                <button class="btn-primary" @click="bookAgain(booking)">Book Again</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!isLoading && bookingsStore.bookings.length === 0" class="empty-state">
          <div class="empty-content">
            <div class="empty-icon">🏨</div>
            <h3>No bookings yet</h3>
            <p>Start your journey by booking your first room with us.</p>
            <button class="primary-btn" @click="$router.push('/rooms')">Browse Rooms</button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <div class="section-header">
          <h2>Quick Actions</h2>
          <p>Everything you need, just a click away</p>
        </div>
        <div class="actions-grid">
          <div class="action-card" @click="$router.push('/rooms')">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3>Book a Room</h3>
            <p>Find and reserve your perfect stay</p>
            <span class="arrow">→</span>
          </div>
          
          <div class="action-card" @click="$router.push('/profile')">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3>Update Profile</h3>
            <p>Manage your account information</p>
            <span class="arrow">→</span>
          </div>
          
          <div class="action-card" @click="showHelpModal = true">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </div>
            <h3>Get Help</h3>
            <p>Contact support or view FAQs</p>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <BaseModal 
      v-model:isOpen="showHelpModal"
      title="Need Help?"
      size="lg"
    >
      <div class="help-content">
        <div class="help-section">
          <h3>Contact Support</h3>
          <p>Our support team is available 24/7 to assist you.</p>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-label">Email:</span>
              <a href="mailto:support@hotel.com">support@hotel.com</a>
            </div>
            <div class="contact-item">
              <span class="contact-label">Phone:</span>
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </div>
          </div>
        </div>
        
        <div class="help-section">
          <h3>Frequently Asked Questions</h3>
          <div class="faq-list">
            <div class="faq-item" @click="toggleFaq(0)" :class="{ active: activeFaq === 0 }">
              <div class="faq-header">
                <div class="faq-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" :class="{ rotated: activeFaq === 0 }">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
                <h4>How do I cancel a booking?</h4>
              </div>
              <div class="faq-content" :class="{ expanded: activeFaq === 0 }">
                <p>You can cancel your booking from the dashboard or booking details page, as long as it's not within 24 hours of check-in. Simply click on the "Cancel" button next to your booking and confirm your cancellation.</p>
              </div>
            </div>
            
            <div class="faq-item" @click="toggleFaq(1)" :class="{ active: activeFaq === 1 }">
              <div class="faq-header">
                <div class="faq-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" :class="{ rotated: activeFaq === 1 }">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
                <h4>What is your cancellation policy?</h4>
              </div>
              <div class="faq-content" :class="{ expanded: activeFaq === 1 }">
                <p>Free cancellation up to 24 hours before check-in. Late cancellations may incur charges. For group bookings, please contact our support team for specific policies.</p>
              </div>
            </div>
            
            <div class="faq-item" @click="toggleFaq(2)" :class="{ active: activeFaq === 2 }">
              <div class="faq-header">
                <div class="faq-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" :class="{ rotated: activeFaq === 2 }">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
                <h4>Can I modify my booking?</h4>
              </div>
              <div class="faq-content" :class="{ expanded: activeFaq === 2 }">
                <p>Yes, you can modify dates and guest count through your booking details, subject to availability. Changes can be made up to 48 hours before check-in.</p>
              </div>
            </div>
            
            <div class="faq-item" @click="toggleFaq(3)" :class="{ active: activeFaq === 3 }">
              <div class="faq-header">
                <div class="faq-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" :class="{ rotated: activeFaq === 3 }">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
                <h4>What payment methods do you accept?</h4>
              </div>
              <div class="faq-content" :class="{ expanded: activeFaq === 3 }">
                <p>We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Payment is processed securely at the time of booking.</p>
              </div>
            </div>
            
            <div class="faq-item" @click="toggleFaq(4)" :class="{ active: activeFaq === 4 }">
              <div class="faq-header">
                <div class="faq-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" :class="{ rotated: activeFaq === 4 }">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </div>
                <h4>What time is check-in and check-out?</h4>
              </div>
              <div class="faq-content" :class="{ expanded: activeFaq === 4 }">
                <p>Standard check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in and late check-out can be arranged based on availability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button class="primary-btn" @click="showHelpModal = false">Close</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth'
import { useBookingsStore } from '@/stores/bookings'
import BaseModal from '@/components/ui/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const bookingsStore = useBookingsStore()

const isLoading = ref(false)
const showHelpModal = ref(false)
const cancellingBooking = ref(null)
const activeFaq = ref(null)

// Computed properties
const upcomingBookings = computed(() => bookingsStore.upcomingBookings)
const currentBookings = computed(() => bookingsStore.currentBookings)
const pastBookings = computed(() => bookingsStore.pastBookings)

// Methods
const loadBookings = async () => {
  try {
    isLoading.value = true
    await bookingsStore.getUserBookings()
  } catch (error) {
    console.error('Failed to load bookings:', error)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const canCancel = (booking) => {
  return bookingsStore.canCancelBooking(booking)
}

const viewBooking = (bookingId) => {
  router.push(`/bookings/${bookingId}`)
}

const cancelBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to cancel this booking?')) {
    return
  }

  try {
    cancellingBooking.value = bookingId
    const result = await bookingsStore.cancelBooking(bookingId)
    
    if (result.success) {
      console.log('Booking cancelled successfully')
    }
  } catch (error) {
    console.error('Failed to cancel booking:', error)
  } finally {
    cancellingBooking.value = null
  }
}

const bookAgain = (booking) => {
  router.push({
    path: '/booking/new',
    query: {
      roomId: booking.roomId,
      guests: booking.guests
    }
  })
}

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

// Load data on mount
onMounted(() => {
  loadBookings()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: var(--color-gray-50);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding-top: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, 
    var(--color-primary-800) 0%, 
    var(--color-primary-900) 50%, 
    var(--color-primary-950) 100%);
  padding: 4rem 0;
  margin-bottom: 3rem;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=600&fit=crop') center/cover;
  opacity: 0.15;
  z-index: 0;
}

.hero-section::after {
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

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    var(--color-primary-800) 0%, 
    var(--color-primary-900) 50%, 
    var(--color-primary-950) 100%);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.9), 
    rgba(5, 150, 105, 0.8));
}

.hero-content {
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
}

.welcome-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, 
    var(--color-primary-500) 0%, 
    var(--color-primary-600) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  border: 3px solid white;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
}

.welcome-text h1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-text p {
  color: var(--color-gray-600);
  margin: 0;
  font-size: 1.125rem;
  font-weight: 500;
}

.quick-stats {
  display: flex;
  gap: 1.5rem;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.2);
  transition: all 0.3s ease;
  min-width: 120px;
}

.stat-item:hover {
  background: rgba(16, 185, 129, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.3);
}

.stat-number {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.welcome-actions {
  display: flex;
  justify-content: flex-end;
}

.primary-btn {
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
}

.primary-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.primary-btn:hover {
  background: linear-gradient(135deg, 
    var(--color-primary-700) 0%, 
    var(--color-primary-800) 100%);
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
}

.primary-btn:hover::before {
  left: 100%;
}

.btn-icon {
  font-size: 1.25rem;
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-gray-100);
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.05) 0%, 
    rgba(245, 158, 11, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary-200);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon.upcoming {
  background: linear-gradient(135deg, #3b82f6, #1e40af);
}

.stat-icon.current {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-icon.past {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
}

.stat-icon.total {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.stat-content h3 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.stat-content p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
}

.status.active {
  background: #dcfce7;
  color: #166534;
}

.status.staying {
  background: #dbeafe;
  color: #1e40af;
}

.status.completed {
  background: #f3e8ff;
  color: #7c3aed;
}

.status.all-time {
  background: #fef3c7;
  color: #92400e;
}

/* Loading and Error States */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-content {
  max-width: 400px;
  margin: 0 auto;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

/* Bookings Sections */
.bookings-content {
  margin-bottom: 3rem;
}

.bookings-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.badge {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge.current {
  background: #10b981;
}

.badge.past {
  background: #6366f1;
}

.view-all {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.view-all:hover {
  color: #1e40af;
  text-decoration: underline;
}

.bookings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.booking-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.confirmed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.current {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.completed {
  background: #f3e8ff;
  color: #7c3aed;
}

.booking-info {
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.label {
  color: #64748b;
  font-size: 0.875rem;
}

.value {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.875rem;
}

.value.price {
  color: #059669;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-secondary,
.btn-danger {
  flex: 1;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border-color: #3b82f6;
}

.btn-secondary:hover {
  background: #3b82f6;
  color: white;
}

.btn-danger {
  background: white;
  color: #dc2626;
  border-color: #dc2626;
}

.btn-danger:hover {
  background: #dc2626;
  color: white;
}

.btn-primary {
  flex: 1;
  background: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #1e40af;
  border-color: #1e40af;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 3rem;
}

.quick-actions .section-header {
  margin-bottom: 2rem;
}

.quick-actions .section-header p {
  color: #64748b;
  margin: 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  position: relative;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.action-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1rem;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
}

.action-icon svg {
  width: 2rem;
  height: 2rem;
}

.action-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.action-card p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
}

.arrow {
  font-size: 1.25rem;
  color: #3b82f6;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.action-card:hover .arrow {
  transform: translateX(5px);
}

/* Help Modal */
.help-content {
  max-height: 60vh;
  overflow-y: auto;
}

.help-section {
  margin-bottom: 2rem;
}

.help-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.contact-info {
  margin-top: 1rem;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.contact-label {
  font-weight: 500;
  color: #475569;
}

.contact-item a {
  color: #3b82f6;
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.faq-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.faq-item.active {
  border-color: #3b82f6;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
}


.faq-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  transition: background-color 0.3s ease;
}

.faq-item:hover .faq-header {
  background-color: #f8fafc;
}

.faq-icon {
  width: 2rem;
  height: 2rem;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.faq-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.faq-icon svg.rotated {
  transform: rotate(180deg);
}

.faq-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex-grow: 1;
  text-align: left;
}

.faq-content {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.faq-content.expanded {
  max-height: 200px;
}

.faq-content p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.6;
  padding: 0 1.25rem 1.25rem 4.25rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard {
    padding-top: 60px;
  }

  .hero-section {
    padding: 2rem 0;
  }

  .welcome-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .user-info {
    flex-direction: column;
    gap: 1rem;
  }

  .quick-stats {
    justify-content: center;
  }

  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .bookings-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .welcome-card {
    padding: 1.5rem;
  }

  .welcome-text h1 {
    font-size: 1.5rem;
  }
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
