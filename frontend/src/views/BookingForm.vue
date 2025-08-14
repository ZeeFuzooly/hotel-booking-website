<template>
  <div class="booking-form">
    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading booking form...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h2>Error Loading Booking Form</h2>
        <p>{{ error }}</p>
        <div class="error-actions">
          <BaseButton @click="retryLoading" variant="primary">Try Again</BaseButton>
          <BaseButton @click="$router.push('/rooms')" variant="secondary">Browse Rooms</BaseButton>
        </div>
      </div>

             <!-- Booking Form -->
       <div v-else-if="bookingData && !showSuccessMessage" class="booking-content">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Home</router-link>
          <span class="breadcrumb-separator">/</span>
          <router-link to="/rooms" class="breadcrumb-link">Rooms</router-link>
          <span class="breadcrumb-separator">/</span>
          <router-link :to="`/rooms/${bookingData.roomId}`" class="breadcrumb-link">
            {{ bookingData.roomName }}
          </router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">Booking</span>
        </nav>

        <!-- Page Header -->
        <div class="page-header">
          <div class="progress-indicator">
            <div class="progress-step completed">
              <div class="step-icon">✓</div>
              <span class="step-label">Room Selected</span>
            </div>
            <div class="progress-line"></div>
            <div class="progress-step active">
              <div class="step-icon">2</div>
              <span class="step-label">Guest Details</span>
            </div>
            <div class="progress-line"></div>
            <div class="progress-step">
              <div class="step-icon">3</div>
              <span class="step-label">Confirmation</span>
            </div>
          </div>
          <h1>Complete Your Booking</h1>
          <p>Please provide your contact information and preferences to complete your reservation.</p>
        </div>

        <div class="booking-layout">
          <!-- Main Form Section -->
          <div class="form-section-main">
            <!-- Contact Information -->
            <section class="form-section">
              <div class="section-header">
                <div class="section-icon">👤</div>
                <h3>Guest Information</h3>
                <p class="section-subtitle">Primary guest details for this booking</p>
              </div>
              
              <!-- Guest Type Selection -->
              <div class="guest-type-selection">
                <div class="guest-type-option active">
                  <div class="guest-type-icon">👤</div>
                  <div class="guest-type-content">
                    <div class="guest-type-title">Primary Guest</div>
                    <div class="guest-type-subtitle">Main contact for this booking</div>
                  </div>
                </div>
              </div>

              <div class="contact-form-grid">
                <div class="form-row">
                  <div class="form-field">
                    <label class="form-label">
                      <span class="label-text">First Name</span>
                      <span class="required-indicator">*</span>
                    </label>
                    <input
                      v-model="form.firstName"
                      type="text"
                      class="form-input"
                      :class="{ 'error': v$.firstName.$error }"
                      placeholder="Enter your first name"
                      @blur="v$.firstName.$touch"
                    />
                    <div v-if="v$.firstName.$error" class="error-message">
                      {{ v$.firstName.$errors[0].$message }}
                    </div>
                  </div>
                  
                  <div class="form-field">
                    <label class="form-label">
                      <span class="label-text">Last Name</span>
                      <span class="required-indicator">*</span>
                    </label>
                    <input
                      v-model="form.lastName"
                      type="text"
                      class="form-input"
                      :class="{ 'error': v$.lastName.$error }"
                      placeholder="Enter your last name"
                      @blur="v$.lastName.$touch"
                    />
                    <div v-if="v$.lastName.$error" class="error-message">
                      {{ v$.lastName.$errors[0].$message }}
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-field">
                    <label class="form-label">
                      <span class="label-text">Email Address</span>
                      <span class="required-indicator">*</span>
                    </label>
                    <input
                      v-model="form.email"
                      type="email"
                      class="form-input"
                      :class="{ 'error': v$.email.$error }"
                      placeholder="your.email@example.com"
                      @blur="v$.email.$touch"
                    />
                    <div v-if="v$.email.$error" class="error-message">
                      {{ v$.email.$errors[0].$message }}
                    </div>
                    <div class="field-hint">We'll send your booking confirmation here</div>
                  </div>
                  
                  <div class="form-field">
                    <label class="form-label">
                      <span class="label-text">Phone Number</span>
                      <span class="required-indicator">*</span>
                    </label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      class="form-input"
                      :class="{ 'error': v$.phone.$error }"
                      placeholder="+1 (555) 123-4567"
                      @blur="v$.phone.$touch"
                    />
                    <div v-if="v$.phone.$error" class="error-message">
                      {{ v$.phone.$errors[0].$message }}
                    </div>
                    <div class="field-hint">For urgent contact during your stay</div>
                  </div>
                </div>

                <!-- Country Selection -->
                <div class="form-row">
                  <div class="form-field">
                    <label class="form-label">
                      <span class="label-text">Country/Region</span>
                    </label>
                    <select v-model="form.country" class="form-select">
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="SG">Singapore</option>
                      <option value="MY">Malaysia</option>
                      <option value="TH">Thailand</option>
                      <option value="JP">Japan</option>
                      <option value="KR">South Korea</option>
                      <option value="CN">China</option>
                      <option value="IN">India</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <!-- Special Requests -->
            <section class="form-section">
              <div class="section-header">
                <div class="section-icon">💬</div>
                <h3>Special Requests & Preferences</h3>
              </div>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label class="form-label">Special Requests</label>
                  <textarea
                    v-model="form.specialRequests"
                    class="form-textarea"
                    placeholder="Any special requests or preferences (optional)"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </section>

            <!-- Additional Services -->
            <section class="form-section">
              <div class="section-header">
                <div class="section-icon">✨</div>
                <h3>Additional Services</h3>
                <p class="section-subtitle">Enhance your stay with these optional services</p>
              </div>
              <div class="services-grid">
                <div class="service-item">
                  <input
                    v-model="form.services"
                    type="checkbox"
                    id="airport-transfer"
                    value="airport-transfer"
                    class="service-checkbox"
                  />
                  <label for="airport-transfer" class="service-label">
                    <div class="service-icon">🚗</div>
                    <div class="service-content">
                      <span class="service-name">Airport Transfer</span>
                      <span class="service-description">Convenient pickup from airport</span>
                      <span class="service-price">S$50</span>
                    </div>
                  </label>
                </div>
                <div class="service-item">
                  <input
                    v-model="form.services"
                    type="checkbox"
                    id="breakfast"
                    value="breakfast"
                    class="service-checkbox"
                  />
                  <label for="breakfast" class="service-label">
                    <div class="service-icon">🍳</div>
                    <div class="service-content">
                      <span class="service-name">Daily Breakfast</span>
                      <span class="service-description">Buffet breakfast included</span>
                      <span class="service-price">S$25/night</span>
                    </div>
                  </label>
                </div>
                <div class="service-item">
                  <input
                    v-model="form.services"
                    type="checkbox"
                    id="parking"
                    value="parking"
                    class="service-checkbox"
                  />
                  <label for="parking" class="service-label">
                    <div class="service-icon">🅿️</div>
                    <div class="service-content">
                      <span class="service-name">Parking Space</span>
                      <span class="service-description">Secure parking available</span>
                      <span class="service-price">S$15/night</span>
                    </div>
                  </label>
                </div>
                <div class="service-item">
                  <input
                    v-model="form.services"
                    type="checkbox"
                    id="late-checkout"
                    value="late-checkout"
                    class="service-checkbox"
                  />
                  <label for="late-checkout" class="service-label">
                    <div class="service-icon">⏰</div>
                    <div class="service-content">
                      <span class="service-name">Late Check-out</span>
                      <span class="service-description">Check-out until 2:00 PM</span>
                      <span class="service-price">S$30</span>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            <!-- Terms and Conditions -->
            <section class="form-section">
              <div class="terms-section">
                <div class="checkbox-group">
                  <input
                    v-model="form.agreeToTerms"
                    type="checkbox"
                    id="terms"
                    class="form-checkbox"
                    required
                  />
                  <label for="terms" class="checkbox-label">
                    I agree to the 
                    <a href="#" @click.prevent="showTermsModal = true" class="link">Terms and Conditions</a>
                    and 
                    <a href="#" @click.prevent="showPrivacyModal = true" class="link">Privacy Policy</a>
                  </label>
                </div>
                <div class="checkbox-group">
                  <input
                    v-model="form.marketingEmails"
                    type="checkbox"
                    id="marketing"
                    class="form-checkbox"
                  />
                  <label for="marketing" class="checkbox-label">
                    I would like to receive promotional emails and special offers
                  </label>
                </div>
              </div>
            </section>
          </div>

          <!-- Booking Summary Sidebar -->
          <div class="booking-summary-sidebar">
            <div class="summary-card">
              <div class="summary-header">
                <h3>Booking Summary</h3>
                <div class="hotel-badge">
                  <span class="hotel-icon">🏨</span>
                  <span>Premium Hotel</span>
                </div>
              </div>

              <!-- Room Info -->
              <div class="room-info">
                <h4 class="room-name">{{ bookingData.roomName || 'Room not selected' }}</h4>
                <div class="room-details">
                  <span class="room-type">{{ bookingData.roomType || 'Standard Room' }}</span>
                  <span class="room-capacity">{{ bookingData.guests || 1 }} {{ (bookingData.guests || 1) === 1 ? 'guest' : 'guests' }}</span>
                </div>
              </div>

              <!-- Dates -->
              <div class="dates-section">
                <div class="date-item">
                  <div class="date-label">Check-in</div>
                  <div class="date-value">
                    <div class="date-day">{{ bookingData.checkIn ? formatDateDay(bookingData.checkIn) : 'Select date' }}</div>
                    <div class="date-full">{{ bookingData.checkIn ? formatDateFull(bookingData.checkIn) : 'Please select check-in date' }}</div>
                  </div>
                </div>
                <div class="date-divider">
                  <div class="divider-line"></div>
                  <div class="nights-badge">{{ bookingData.totalNights || 0 }} {{ (bookingData.totalNights || 0) === 1 ? 'night' : 'nights' }}</div>
                  <div class="divider-line"></div>
                </div>
                <div class="date-item">
                  <div class="date-label">Check-out</div>
                  <div class="date-value">
                    <div class="date-day">{{ bookingData.checkOut ? formatDateDay(bookingData.checkOut) : 'Select date' }}</div>
                    <div class="date-full">{{ bookingData.checkOut ? formatDateFull(bookingData.checkOut) : 'Please select check-out date' }}</div>
                  </div>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="price-breakdown">
                <div class="price-item">
                  <span class="price-label">Room rate ({{ bookingData.totalNights || 0 }} {{ (bookingData.totalNights || 0) === 1 ? 'night' : 'nights' }})</span>
                  <span class="price-value">S${{ bookingData.totalPrice || 0 }}</span>
                </div>
                
                <div v-if="additionalServicesTotal > 0" class="price-item">
                  <span class="price-label">Additional services</span>
                  <span class="price-value">S${{ additionalServicesTotal }}</span>
                </div>

                <div v-if="additionalServicesTotal > 0" class="price-item">
                  <span class="price-label">Service fee</span>
                  <span class="price-value">S${{ serviceFee }}</span>
                </div>

                <div class="price-item total">
                  <span class="price-label">Total</span>
                  <span class="price-value">S${{ finalTotal || 0 }}</span>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <BaseButton
                  type="button"
                  variant="secondary"
                  @click="goBack"
                  class="back-button"
                >
                  ← Back to Room
                </BaseButton>
                <BaseButton
                  type="submit"
                  variant="primary"
                  :loading="isSubmitting"
                  :disabled="v$.$invalid || !form.agreeToTerms"
                  class="complete-button"
                  @click="submitBooking"
                >
                  Complete Booking
                </BaseButton>
              </div>

              <!-- Security Badge -->
              <div class="security-badge">
                <div class="security-icon">🔒</div>
                <div class="security-text">
                  <div class="security-title">Secure Booking</div>
                  <div class="security-subtitle">Your payment is protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccessMessage && successfulBooking" class="success-container">
        <div class="success-content">
          <!-- Animated Success Header -->
          <div class="success-header">
            <div class="success-icon-wrapper">
              <div class="success-icon">✅</div>
              <div class="success-ripple"></div>
              <div class="success-ripple"></div>
            </div>
            <h1 class="success-title">Booking Confirmed!</h1>
            <p class="success-message">Your reservation has been successfully created. We've sent a confirmation email to your inbox.</p>
            <div class="success-badge">
              <span class="badge-icon">🎉</span>
              <span class="badge-text">Reservation Active</span>
            </div>
          </div>
          
          <!-- Enhanced Booking Details Card -->
          <div class="booking-details-card">
            <div class="booking-header">
              <div class="header-content">
                <h2>Booking Details</h2>
                <p class="header-subtitle">Your reservation information</p>
              </div>
              <div class="booking-id">
                <span class="id-label">Booking ID</span>
                <span class="id-value">{{ successfulBooking.id }}</span>
                <button class="copy-btn" @click="copyBookingId" title="Copy Booking ID">
                  📋
                </button>
              </div>
            </div>
            
            <div class="details-grid">
              <!-- Room Information -->
              <div class="detail-section">
                <div class="section-header">
                  <div class="section-icon">🏨</div>
                  <h3>Room Information</h3>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Room</span>
                  <span class="detail-value">{{ successfulBooking.room?.name || bookingData.roomName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Room Type</span>
                  <span class="detail-value">{{ successfulBooking.room?.type || bookingData.roomType }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Guests</span>
                  <span class="detail-value">{{ successfulBooking.guest_count || bookingData.guests }} {{ (successfulBooking.guest_count || bookingData.guests) === 1 ? 'guest' : 'guests' }}</span>
                </div>
              </div>

              <!-- Dates -->
              <div class="detail-section">
                <div class="section-header">
                  <div class="section-icon">📅</div>
                  <h3>Stay Details</h3>
                </div>
                <div class="date-timeline">
                  <div class="timeline-item">
                    <div class="timeline-icon">📥</div>
                    <div class="timeline-content">
                      <div class="timeline-label">Check-in</div>
                      <div class="timeline-value">{{ formatDate(successfulBooking.check_in_date || bookingData.checkIn) }}</div>
                    </div>
                  </div>
                  <div class="timeline-connector">
                    <div class="connector-line"></div>
                    <div class="connector-days">{{ bookingData.totalNights }} {{ bookingData.totalNights === 1 ? 'night' : 'nights' }}</div>
                    <div class="connector-line"></div>
                  </div>
                  <div class="timeline-item">
                    <div class="timeline-icon">📤</div>
                    <div class="timeline-content">
                      <div class="timeline-label">Check-out</div>
                      <div class="timeline-value">{{ formatDate(successfulBooking.check_out_date || bookingData.checkOut) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="detail-section">
                <div class="section-header">
                  <div class="section-icon">👤</div>
                  <h3>Contact Information</h3>
                </div>
                <div class="contact-card">
                  <div class="contact-avatar">
                    {{ (form.firstName.charAt(0) + form.lastName.charAt(0)).toUpperCase() }}
                  </div>
                  <div class="contact-details">
                    <div class="contact-name">{{ form.firstName }} {{ form.lastName }}</div>
                    <div class="contact-email">{{ form.email }}</div>
                    <div class="contact-phone">{{ form.phone }}</div>
                  </div>
                </div>
              </div>

              <!-- Additional Services -->
              <div v-if="form.services && form.services.length > 0" class="detail-section">
                <div class="section-header">
                  <div class="section-icon">✨</div>
                  <h3>Additional Services</h3>
                </div>
                <div class="services-list">
                  <div v-for="service in form.services" :key="service" class="service-item">
                    <span class="service-icon">{{ getServiceIcon(service) }}</span>
                    <span class="service-name">{{ getServiceName(service) }}</span>
                    <span class="service-status">✓ Confirmed</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Price Breakdown -->
            <div class="price-breakdown">
              <div class="price-header">
                <h3>Price Breakdown</h3>
                <div class="price-summary">
                  <span class="summary-label">Total Amount</span>
                  <span class="summary-amount">S${{ successfulBooking.total_price || finalTotal }}</span>
                </div>
              </div>
              <div class="price-items">
                <div class="price-item">
                  <span>Room rate ({{ bookingData.totalNights }} {{ bookingData.totalNights === 1 ? 'night' : 'nights' }})</span>
                  <span>S${{ bookingData.totalPrice }}</span>
                </div>
                <div v-if="additionalServicesTotal > 0" class="price-item">
                  <span>Additional services</span>
                  <span>S${{ additionalServicesTotal }}</span>
                </div>
                <div v-if="serviceFee > 0" class="price-item">
                  <span>Service fee</span>
                  <span>S${{ serviceFee }}</span>
                </div>
                <div class="price-item total">
                  <span>Total</span>
                  <span>S${{ successfulBooking.total_price || finalTotal }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Next Steps -->
          <div class="next-steps">
            <h2>What's Next?</h2>
            <div class="steps-grid">
              <div class="step-item">
                <div class="step-icon">📧</div>
                <h4>Confirmation Email</h4>
                <p>Check your email for a detailed confirmation with all booking information.</p>
                <div class="step-action">
                  <button class="action-btn" @click="resendEmail">Resend Email</button>
                </div>
              </div>
              <div class="step-item">
                <div class="step-icon">📱</div>
                <h4>Save Booking ID</h4>
                <p>Keep your booking ID handy for any future inquiries or modifications.</p>
                <div class="step-action">
                  <button class="action-btn" @click="downloadPDF">Download PDF</button>
                </div>
              </div>
              <div class="step-item">
                <div class="step-icon">🏨</div>
                <h4>Check-in Information</h4>
                <p>Check-in time is 3:00 PM. Please bring a valid photo ID and credit card.</p>
                <div class="step-action">
                  <button class="action-btn" @click="viewHotelInfo">Hotel Info</button>
                </div>
              </div>
              <div class="step-item">
                <div class="step-icon">❓</div>
                <h4>Need Help?</h4>
                <p>Contact us at +1 (555) 123-4567 or email support@hotel.com for assistance.</p>
                <div class="step-action">
                  <button class="action-btn" @click="contactSupport">Contact Support</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Action Buttons -->
          <div class="success-actions">
            <BaseButton @click="goToDashboard" variant="secondary" class="action-btn-dashboard">
              <span class="btn-icon">📊</span>
              View My Bookings
            </BaseButton>
            <BaseButton @click="createNewBooking" variant="primary" class="action-btn-primary">
              <span class="btn-icon">🏨</span>
              Book Another Room
            </BaseButton>
            <BaseButton @click="goHome" variant="outline" class="action-btn-home">
              <span class="btn-icon">🏠</span>
              Back to Home
            </BaseButton>
          </div>
          
          <!-- Debug Buttons (remove in production) -->
          <div style="margin-top: 1rem; text-align: center; display: flex; gap: 1rem; justify-content: center;">
            <button @click="testSuccessMessage" style="background: #f59e0b; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">
              Test Success Message
            </button>
            <button @click="clearSuccessMessage" style="background: #ef4444; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">
              Clear Success Message
            </button>
          </div>
        </div>
      </div>

      <!-- No Booking Data -->
      <div v-else class="no-data-container">
        <div class="no-data-icon">📋</div>
        <h2>No Booking Data</h2>
        <p>Please select a room and dates to proceed with booking.</p>
        <div class="no-data-actions">
          <BaseButton @click="$router.push('/rooms')" variant="primary">
            Browse Rooms
          </BaseButton>
          <BaseButton @click="$router.push('/')" variant="secondary">
            Go to Home
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Terms Modal -->
    <BaseModal v-model:isOpen="showTermsModal" title="Terms and Conditions" size="lg">
      <div class="modal-content">
        <h4>Booking Terms and Conditions</h4>
        <p>By making a booking, you agree to the following terms:</p>
        <ul>
          <li>Check-in time is 3:00 PM and check-out time is 11:00 AM</li>
          <li>Valid photo ID is required at check-in</li>
          <li>Credit card is required for incidentals</li>
          <li>Free cancellation up to 24 hours before check-in</li>
          <li>No smoking in rooms</li>
          <li>Quiet hours are from 10:00 PM to 8:00 AM</li>
        </ul>
        <p>For full terms and conditions, please contact our customer service.</p>
      </div>
    </BaseModal>

    <!-- Privacy Modal -->
    <BaseModal v-model:isOpen="showPrivacyModal" title="Privacy Policy" size="lg">
      <div class="modal-content">
        <h4>Privacy Policy</h4>
        <p>We are committed to protecting your privacy:</p>
        <ul>
          <li>Your personal information is used only for booking purposes</li>
          <li>We do not share your data with third parties</li>
          <li>You can request deletion of your data at any time</li>
          <li>We use secure encryption for all transactions</li>
          <li>Marketing emails are optional and can be unsubscribed</li>
        </ul>
        <p>For our complete privacy policy, please visit our website.</p>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, helpers } from '@vuelidate/validators'
import { useBookingsStore } from '@/stores/bookings'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const router = useRouter()
const bookingsStore = useBookingsStore()

// Reactive data
const isLoading = ref(false)
const error = ref(null)
const isSubmitting = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)
const showSuccessMessage = ref(false)
const successfulBooking = ref(null)

// Form data
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  specialRequests: '',
  services: [],
  agreeToTerms: false,
  marketingEmails: false
})

// Computed properties
const bookingData = computed(() => bookingsStore.bookingForm)

const additionalServicesTotal = computed(() => {
  let total = 0
  const services = form.value.services

  if (services.includes('airport-transfer')) total += 50
  if (services.includes('breakfast')) total += 25 * bookingData.value.totalNights
  if (services.includes('parking')) total += 15 * bookingData.value.totalNights
  if (services.includes('late-checkout')) total += 30

  return total
})

const serviceFee = computed(() => {
  return additionalServicesTotal.value > 0 ? Math.round(additionalServicesTotal.value * 0.1) : 0
})

const finalTotal = computed(() => {
  return bookingData.value.totalPrice + additionalServicesTotal.value + serviceFee.value
})

// Validation rules
const rules = {
  firstName: { required: helpers.withMessage('First name is required', required) },
  lastName: { required: helpers.withMessage('Last name is required', required) },
  email: { 
    required: helpers.withMessage('Email is required', required),
    email: helpers.withMessage('Please enter a valid email address', email)
  },
  phone: { 
    required: helpers.withMessage('Phone number is required', required),
    minLength: helpers.withMessage('Phone number must be at least 10 digits', minLength(10))
  }
}

const v$ = useVuelidate(rules, form)

// Methods
const loadBookingData = () => {
  console.log('Loading booking data:', bookingData.value)
  console.log('showSuccessMessage:', showSuccessMessage.value)
  console.log('successfulBooking:', successfulBooking.value)
  
  // Clear any previous errors
  error.value = null
  
  // Don't set errors if we're showing a success message
  if (showSuccessMessage.value && successfulBooking.value) {
    return
  }
  
  if (!bookingData.value || !bookingData.value.roomId) {
    error.value = 'No booking data available. Please select a room and dates first.'
    return
  }
  
  // Check if we have the required booking data
  if (!bookingData.value.checkIn || !bookingData.value.checkOut || !bookingData.value.totalPrice) {
    error.value = 'Incomplete booking data. Please go back and select dates.'
    return
  }
  
  // Pre-fill form with user data if available (from auth store)
  // This would typically come from the user's profile
  if (bookingData.value.contactInfo) {
    form.value.firstName = bookingData.value.contactInfo.firstName || ''
    form.value.lastName = bookingData.value.contactInfo.lastName || ''
    form.value.email = bookingData.value.contactInfo.email || ''
    form.value.phone = bookingData.value.contactInfo.phone || ''
  }
}

const formatDateDay = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateFull = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const submitBooking = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  // Clear any previous errors
  error.value = null
  isSubmitting.value = true

  try {
    const bookingPayload = {
      room_id: bookingData.value.roomId,
      check_in_date: bookingData.value.checkIn,
      check_out_date: bookingData.value.checkOut,
      guest_count: bookingData.value.guests,
      total_price: finalTotal.value,
      additional_services: form.value.services,
      special_requests: form.value.specialRequests,
      contact_info: {
        first_name: form.value.firstName,
        last_name: form.value.lastName,
        email: form.value.email,
        phone: form.value.phone,
        country: form.value.country
      },
      marketing_emails: form.value.marketingEmails
    }

    console.log('Submitting booking with payload:', bookingPayload)
    const result = await bookingsStore.createBooking(bookingPayload)
    console.log('Booking result:', result)
    
    if (result.success) {
      console.log('Booking successful with ID:', result.booking.id)
      console.log('Setting successfulBooking to:', result.booking)
      console.log('Setting showSuccessMessage to true')
      // Store the successful booking data
      successfulBooking.value = result.booking
      showSuccessMessage.value = true
      console.log('After setting - showSuccessMessage:', showSuccessMessage.value)
      console.log('After setting - successfulBooking:', successfulBooking.value)
    } else {
      console.error('Booking failed:', result.error)
      error.value = result.error || 'Failed to create booking'
    }
  } catch (err) {
    error.value = err.message || 'Failed to create booking'
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push(`/rooms/${bookingData.value.roomId}`)
}

const retryLoading = () => {
  error.value = null
  loadBookingData()
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

const goToDashboard = () => {
  router.push('/dashboard')
}

const createNewBooking = () => {
  // Reset form and go to rooms
  bookingsStore.clearBookingForm()
  showSuccessMessage.value = false
  successfulBooking.value = null
  error.value = null
  router.push('/rooms')
}

const clearSuccessMessage = () => {
  showSuccessMessage.value = false
  successfulBooking.value = null
  error.value = null
}

const goHome = () => {
  router.push('/')
}

const testSuccessMessage = () => {
  console.log('Testing success message...')
  successfulBooking.value = {
    id: 'TEST-123',
    room: { name: 'Test Room', type: 'Deluxe' },
    guest_count: 2,
    check_in_date: '2025-01-15',
    check_out_date: '2025-01-17',
    total_price: 299.99
  }
  showSuccessMessage.value = true
  console.log('Test success message set - showSuccessMessage:', showSuccessMessage.value)
  console.log('Test success message set - successfulBooking:', successfulBooking.value)
}

const copyBookingId = async () => {
  try {
    await navigator.clipboard.writeText(successfulBooking.value.id)
    // You could add a toast notification here
    console.log('Booking ID copied to clipboard')
  } catch (err) {
    console.error('Failed to copy booking ID:', err)
  }
}

const resendEmail = () => {
  // Implement email resend functionality
  console.log('Resending confirmation email...')
  // You could add a toast notification here
}

const downloadPDF = () => {
  // Implement PDF download functionality
  console.log('Downloading booking PDF...')
  // You could add a toast notification here
}

const viewHotelInfo = () => {
  // Navigate to hotel information page
  router.push('/hotel-info')
}

const contactSupport = () => {
  // Open support contact modal or navigate to support page
  console.log('Opening support contact...')
  // You could add a modal or navigation here
}

// Lifecycle
onMounted(() => {
  loadBookingData()
  
  // For testing purposes - remove this in production
  if (!bookingData.value || !bookingData.value.roomId) {
    console.log('No booking data found, you can test by going to a room detail page and selecting dates')
  }
})
</script>

<style scoped>
.booking-form {
  padding: 2rem 0;
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--color-gray-50) 0%, 
    var(--color-gray-100) 50%, 
    var(--color-gray-50) 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
}

.booking-form::before {
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
}

.loading-container,
.error-container,
.no-data-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  background: linear-gradient(135deg, 
    var(--color-primary-800) 0%, 
    var(--color-primary-900) 100%);
  padding: 2rem 0;
}

.success-content {
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-header {
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
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
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.success-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.success-icon {
  font-size: 4rem;
  position: relative;
  z-index: 2;
  animation: bounce 0.6s ease-out 0.3s both;
}

.success-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 1.5s ease-out infinite;
}

.success-ripple:nth-child(2) {
  animation-delay: 0.5s;
}

.success-ripple:nth-child(3) {
  animation-delay: 1s;
}

@keyframes bounce {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 120px;
    height: 120px;
    opacity: 0;
  }
}

.success-title {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.success-message {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.success-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

.badge-icon {
  font-size: 1rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.booking-details-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.booking-details-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  gap: 2rem;
}

.header-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  background: linear-gradient(135deg, #1f2937, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.booking-id {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  min-width: 200px;
}

.id-label {
  font-weight: 600;
  color: #4b5563;
  font-size: 0.875rem;
}

.id-value {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.copy-btn {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.copy-btn:hover {
  background: #059669;
  transform: scale(1.05);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-icon {
  font-size: 1.25rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e7ff;
  border-radius: 6px;
  color: #4f46e5;
}

.section-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-label {
  font-weight: 500;
  color: #4b5563;
  font-size: 0.875rem;
}

.detail-value {
  color: #111827;
  font-weight: 500;
  font-size: 0.95rem;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 10px;
  border: 1px solid #d1d5db;
}

.contact-avatar {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 600;
  flex-shrink: 0;
}

.contact-details {
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.contact-email,
.contact-phone {
  font-size: 0.875rem;
  color: #4b5563;
  margin-top: 0.25rem;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.service-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.service-icon {
  font-size: 1.1rem;
  color: #3b82f6;
  margin-right: 0.75rem;
}

.service-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.95rem;
}

.service-status {
  font-size: 0.75rem;
  color: #06b6d4;
  font-weight: 600;
  background: #ecfeff;
  padding: 0.25rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #cffafe;
}

.date-timeline {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e5e7eb;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.timeline-icon {
  font-size: 1.25rem;
  color: #3b82f6;
}

.timeline-content {
  display: flex;
  flex-direction: column;
}

.timeline-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.timeline-value {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.timeline-connector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.connector-line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.connector-days {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.price-breakdown {
  border-top: 2px solid #e2e8f0;
  padding-top: 2rem;
}

.price-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.price-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

.price-summary {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.summary-amount {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
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
  border-top: 1px solid #e2e8f0;
  padding-top: 1rem;
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #3b82f6;
}

.next-steps {
  margin-bottom: 2rem;
}

.next-steps h2 {
  margin: 0 0 2rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
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
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.step-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.step-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.step-item h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

.step-item p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.step-action {
  margin-top: 1rem;
}

.action-btn {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn:hover {
  background: #2563eb;
}

.action-btn-dashboard {
  background: #4f46e5;
}

.action-btn-dashboard:hover {
  background: #4338ca;
}

.action-btn-primary {
  background: #10b981;
}

.action-btn-primary:hover {
  background: #059669;
}

.action-btn-home {
  background: #6b7280;
}

.action-btn-home:hover {
  background: #4b5563;
}

.btn-icon {
  font-size: 1rem;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.no-data-actions,
.error-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon,
.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(229, 231, 235, 0.6);
}

.breadcrumb-link {
  color: #3b82f6;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: #94a3b8;
}

.breadcrumb-current {
  color: #64748b;
  font-weight: 500;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.6);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600), var(--color-primary-700));
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
}

.page-header p {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
  position: relative;
  z-index: 1;
}

.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  background: var(--color-gray-200);
  color: var(--color-gray-600);
  border: 2px solid var(--color-gray-300);
  transition: all 0.3s ease;
}

.progress-step.completed .step-icon {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.progress-step.active .step-icon {
  background: var(--color-primary-600);
  color: white;
  border-color: var(--color-primary-600);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  animation: pulse 2s infinite;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-gray-600);
  text-align: center;
  white-space: nowrap;
}

.progress-step.completed .step-label,
.progress-step.active .step-label {
  color: var(--color-primary-700);
  font-weight: 600;
}

.progress-line {
  width: 60px;
  height: 2px;
  background: var(--color-gray-300);
  border-radius: 1px;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.6);
  }
}

.booking-layout {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 2.5rem;
  align-items: start;
}

.form-section-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(249, 250, 251, 0.9) 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  border: 1px solid var(--color-gray-100);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.form-section::before {
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

.form-section:hover::before {
  opacity: 1;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.05) 0%, 
    rgba(16, 185, 129, 0.08) 100%);
  border-radius: 12px;
  border-left: 4px solid var(--color-primary-500);
  position: relative;
}

.section-icon {
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%);
  border: 2px solid var(--color-primary-200);
  border-radius: 12px;
  color: var(--color-primary-600);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
}

.section-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.section-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Enhanced Contact Form Styles */
.guest-type-selection {
  margin-bottom: 2rem;
}

.guest-type-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid var(--color-gray-200);
  border-radius: 16px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.guest-type-option::before {
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

.guest-type-option.active {
  border-color: var(--color-primary-500);
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.1) 0%, 
    rgba(16, 185, 129, 0.15) 100%);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
  transform: translateY(-2px);
}

.guest-type-option.active::before {
  opacity: 1;
}

.guest-type-icon {
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%);
  border: 2px solid var(--color-primary-200);
  border-radius: 12px;
  color: var(--color-primary-600);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
  position: relative;
  z-index: 1;
}

.guest-type-content {
  flex: 1;
}

.guest-type-title {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.guest-type-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.contact-form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
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

.form-input,
.form-select {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid var(--color-gray-200);
  border-radius: 12px;
  font-size: 1rem;
  color: #374151;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.form-input:hover,
.form-select:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15), 0 4px 16px rgba(16, 185, 129, 0.2);
  transform: translateY(-1px);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.field-hint {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-style: italic;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid var(--color-gray-200);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.form-textarea:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15), 0 4px 16px rgba(16, 185, 129, 0.2);
  transform: translateY(-1px);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.service-item {
  display: flex;
  align-items: center;
}

.service-checkbox {
  display: none;
}

.service-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid var(--color-gray-200);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.service-label::before {
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

.service-checkbox:checked + .service-label {
  border-color: var(--color-primary-500);
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.1) 0%, 
    rgba(16, 185, 129, 0.15) 100%);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
  transform: translateY(-2px);
}

.service-checkbox:checked + .service-label::before {
  opacity: 1;
}

.service-icon {
  font-size: 1.75rem;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%);
  border: 2px solid var(--color-primary-200);
  border-radius: 12px;
  color: var(--color-primary-600);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
  position: relative;
  z-index: 1;
}

.service-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.25rem;
}

.service-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
}

.service-description {
  font-size: 0.875rem;
  color: #64748b;
}

.service-price {
  font-size: 1rem;
  color: var(--color-primary-600);
  font-weight: 600;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.1) 0%, 
    rgba(16, 185, 129, 0.15) 100%);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-primary-200);
}

.terms-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
  accent-color: var(--color-primary-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-checkbox:checked {
  transform: scale(1.1);
}

.checkbox-label {
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.4;
}

.link {
  color: var(--color-primary-600);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary-600);
  transition: width 0.3s ease;
}

.link:hover::after {
  width: 100%;
}

.link:hover {
  color: var(--color-primary-700);
}

/* Booking Summary Sidebar */
.booking-summary-sidebar {
  position: sticky;
  top: 2rem;
}

.summary-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(249, 250, 251, 0.9) 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 2rem;
  border: 1px solid var(--color-gray-100);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600), var(--color-primary-700));
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.summary-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.hotel-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.hotel-icon {
  font-size: 1rem;
}

.room-info {
  margin-bottom: 2rem;
}

.room-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.room-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.room-type,
.room-capacity {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.dates-section {
  margin-bottom: 2rem;
}

.date-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.date-label {
  font-weight: 500;
  color: #64748b;
  font-size: 0.875rem;
}

.date-value {
  text-align: right;
}

.date-day {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
}

.date-full {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.date-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.nights-badge {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.price-breakdown {
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.price-item.total {
  border-top: 2px solid #3b82f6;
  padding-top: 1rem;
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
}

.price-label {
  color: #64748b;
  font-size: 0.875rem;
}

.price-value {
  color: #1e293b;
  font-weight: 500;
}

.price-item.total .price-label,
.price-item.total .price-value {
  color: #1e293b;
  font-weight: 600;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.back-button {
  width: 100%;
  justify-content: center;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border: 2px solid var(--color-gray-300);
  color: var(--color-gray-700);
  font-weight: 600;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.back-button::before {
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

.back-button:hover {
  border-color: var(--color-primary-400);
  color: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.back-button:hover::before {
  opacity: 1;
}

.complete-button {
  width: 100%;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-500) 0%, 
    var(--color-primary-600) 100%);
  border: 2px solid var(--color-primary-500);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.complete-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.complete-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.complete-button:hover {
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  border-color: var(--color-primary-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
}

.complete-button:hover::before {
  left: 100%;
}

.complete-button:hover::after {
  opacity: 1;
}

.complete-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
}

.complete-button:disabled {
  background: linear-gradient(135deg, 
    var(--color-gray-400) 0%, 
    var(--color-gray-500) 100%);
  border-color: var(--color-gray-400);
  color: var(--color-gray-600);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.complete-button:disabled::before,
.complete-button:disabled::after {
  display: none;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.08) 0%, 
    rgba(16, 185, 129, 0.12) 100%);
  border: 2px solid var(--color-primary-200);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
  position: relative;
  overflow: hidden;
}

.security-badge::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.05) 0%, 
    transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.security-badge:hover::before {
  opacity: 1;
}

.security-icon {
  font-size: 1.5rem;
  position: relative;
  z-index: 1;
}

.security-title {
  font-weight: 600;
  color: var(--color-primary-700);
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
}

.security-subtitle {
  color: var(--color-primary-600);
  font-size: 0.75rem;
  position: relative;
  z-index: 1;
}

.modal-content {
  line-height: 1.6;
}

.modal-content h4 {
  margin: 0 0 1rem 0;
  color: #1e293b;
}

.modal-content ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.modal-content li {
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .booking-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .booking-summary-sidebar {
    position: static;
  }
  
  .progress-indicator {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .progress-line {
    width: 2px;
    height: 20px;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .page-header {
    padding: 2rem 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    padding: 1.5rem;
  }

  .date-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .date-value {
    text-align: left;
  }

  .no-data-actions {
    flex-direction: column;
    width: 100%;
  }

  .no-data-actions .btn {
    width: 100%;
  }
  
  .form-section {
    padding: 1.5rem;
  }
  
  .section-header {
    padding: 0.875rem 1.25rem;
  }

  .success-content h1 {
    font-size: 2rem;
  }

  .success-header {
    padding: 2rem 1rem;
  }

  .booking-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .booking-id {
    min-width: auto;
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .date-timeline {
    flex-direction: column;
    gap: 1rem;
  }

  .timeline-connector {
    flex-direction: column;
    gap: 0.5rem;
  }

  .connector-line {
    width: 1px;
    height: 20px;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .success-actions {
    flex-direction: column;
  }

  .contact-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .price-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .summary-card {
    padding: 1rem;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
