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
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <div class="section-title-content">
                  <h2>Room Description</h2>
                  <p class="section-subtitle">Discover what makes this room special</p>
                </div>
              </div>
                             <div class="description-content">
                 <div class="description-text">
                   <p>{{ room.description }}</p>
                 </div>
                 <div class="description-highlights">
                   <div class="highlight-item">
                     <div class="highlight-icon">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                       </svg>
                     </div>
                     <div class="highlight-content">
                       <span class="highlight-title">Premium Experience</span>
                       <span class="highlight-text">Luxurious amenities and exceptional service</span>
                     </div>
                   </div>
                   <div class="highlight-item">
                     <div class="highlight-icon">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                       </svg>
                     </div>
                     <div class="highlight-content">
                       <span class="highlight-title">Secure & Private</span>
                       <span class="highlight-text">Your comfort and privacy are our priority</span>
                     </div>
                   </div>
                 </div>
               </div>
            </section>

            <!-- Amenities -->
            <section class="room-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div class="section-title-content">
                  <h2>Amenities</h2>
                  <p class="section-subtitle">Everything you need for a comfortable stay</p>
                </div>
              </div>
              <div class="amenities-grid">
                <div 
                  v-for="amenity in room.amenities" 
                  :key="amenity"
                  class="amenity-item"
                >
                  <div class="amenity-icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                  <span class="amenity-text">{{ amenity }}</span>
                </div>
              </div>
            </section>

            <!-- Room Details -->
            <section class="room-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18"/>
                    <path d="M8 11h8M8 15h6"/>
                  </svg>
                </div>
                <div class="section-title-content">
                  <h2>Room Details</h2>
                  <p class="section-subtitle">Complete specifications and information</p>
                </div>
              </div>
              <div class="details-grid">
                <div class="detail-item">
                  <div class="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 7V5a2 2 0 0 1 2-2h2M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18"/>
                    </svg>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Room Type</span>
                    <span class="detail-value">{{ room.type }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Capacity</span>
                    <span class="detail-value">{{ room.capacity }} guests</span>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Size</span>
                    <span class="detail-value">{{ room.size }}m²</span>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Bed Type</span>
                    <span class="detail-value">{{ room.bedType }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">View</span>
                    <span class="detail-value">{{ room.view }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <div class="detail-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                  </div>
                  <div class="detail-content">
                    <span class="detail-label">Floor</span>
                    <span class="detail-value">{{ room.floor }}</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- House Rules -->
            <section class="room-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div class="section-title-content">
                  <h2>House Rules</h2>
                  <p class="section-subtitle">Important guidelines for your stay</p>
                </div>
              </div>
              <div class="house-rules-container">
                <ul class="house-rules">
                  <li>
                    <div class="rule-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    <div class="rule-content">
                      <span class="rule-title">Check-in</span>
                      <span class="rule-text">3:00 PM</span>
                    </div>
                  </li>
                  <li>
                    <div class="rule-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    <div class="rule-content">
                      <span class="rule-title">Check-out</span>
                      <span class="rule-text">11:00 AM</span>
                    </div>
                  </li>
                  <li>
                    <div class="rule-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                      </svg>
                    </div>
                    <div class="rule-content">
                      <span class="rule-title">No smoking</span>
                      <span class="rule-text">Smoking is not allowed</span>
                    </div>
                  </li>
                  <li>
                    <div class="rule-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
                        <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
                        <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"/>
                        <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"/>
                      </svg>
                    </div>
                    <div class="rule-content">
                      <span class="rule-title">No pets</span>
                      <span class="rule-text">Pets are not allowed</span>
                    </div>
                  </li>
                  <li>
                    <div class="rule-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <div class="rule-content">
                      <span class="rule-title">Quiet hours</span>
                      <span class="rule-text">10:00 PM - 8:00 AM</span>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <!-- Booking Sidebar -->
          <div class="booking-sidebar">
            <div class="booking-card">
              <div class="booking-header">
                <div class="booking-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7h18"/>
                    <path d="M8 11h8M8 15h6"/>
                  </svg>
                </div>
                <h3>Book This Room</h3>
                <p class="booking-subtitle">Secure your luxury stay today</p>
              </div>
              
              <!-- Date Selection -->
              <div class="booking-section">
                <div class="section-title">
                  <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>Select Dates</span>
                </div>
                <div class="date-selection">
                  <div class="date-input-group">
                    <BaseInput
                      v-model="bookingDates.checkIn"
                      label="Check-in"
                      type="date"
                      :min="today"
                      @change="updateAvailability"
                      class="date-input"
                    />
                    <div class="date-separator">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                    <BaseInput
                      v-model="bookingDates.checkOut"
                      label="Check-out"
                      type="date"
                      :min="minCheckOut"
                      @change="updateAvailability"
                      class="date-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Guest Selection -->
              <div class="booking-section">
                <div class="section-title">
                  <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>Guests</span>
                </div>
                <div class="guest-selection">
                  <div class="guest-selector">
                    <button 
                      @click="decreaseGuests" 
                      :disabled="bookingDates.guests <= 1"
                      class="guest-btn"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    <div class="guest-count">
                      <span class="guest-number">{{ bookingDates.guests }}</span>
                      <span class="guest-label">{{ bookingDates.guests === 1 ? 'Guest' : 'Guests' }}</span>
                    </div>
                    <button 
                      @click="increaseGuests" 
                      :disabled="bookingDates.guests >= room.capacity"
                      class="guest-btn"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>
                  <p class="guest-note">Maximum {{ room.capacity }} guests allowed</p>
                </div>
              </div>

              <!-- Availability Status -->
              <div v-if="availabilityChecked" class="booking-section">
                <div v-if="isAvailable" class="availability-status available">
                  <div class="status-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                  <div class="status-content">
                    <span class="status-title">Available</span>
                    <span class="status-subtitle">Your selected dates are confirmed</span>
                  </div>
                </div>
                <div v-else class="availability-status unavailable">
                  <div class="status-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                  <div class="status-content">
                    <span class="status-title">Not Available</span>
                    <span class="status-subtitle">Please select different dates</span>
                  </div>
                </div>
              </div>

              <!-- Price Calculation -->
              <div v-if="isAvailable && totalNights > 0" class="booking-section">
                <div class="section-title">
                  <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <span>Price Breakdown</span>
                </div>
                <div class="price-breakdown">
                  <div class="price-row">
                    <span class="price-label">Price per night</span>
                    <span class="price-value">S${{ room.price }}</span>
                  </div>
                  <div class="price-row">
                    <span class="price-label">Number of nights</span>
                    <span class="price-value">{{ totalNights }}</span>
                  </div>
                  <div class="price-divider"></div>
                  <div class="price-row total">
                    <span class="price-label">Total Amount</span>
                    <span class="price-value total-price">S${{ totalPrice }}</span>
                  </div>
                  <div class="price-note">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    <span>Free cancellation up to 24h before check-in</span>
                  </div>
                </div>
              </div>

              <!-- Booking Actions -->
              <div class="booking-actions">
                <BaseButton
                  v-if="!isAuthenticated"
                  @click="goToLogin"
                  variant="primary"
                  fullWidth
                  class="booking-btn login-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10,17 15,12 10,7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Login to Book
                </BaseButton>
                <BaseButton
                  v-else-if="!isAvailable"
                  variant="secondary"
                  fullWidth
                  disabled
                  class="booking-btn disabled-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  Not Available
                </BaseButton>
                <BaseButton
                  v-else
                  @click="proceedToBooking"
                  variant="primary"
                  fullWidth
                  :loading="isCheckingAvailability"
                  class="booking-btn book-now-btn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
                    <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
                    <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"/>
                    <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"/>
                  </svg>
                  Book Now
                </BaseButton>
              </div>

              <!-- Quick Info -->
              <div class="quick-info">
                <div class="info-item">
                  <div class="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-title">Need assistance?</span>
                    <span class="info-text">Call us at +65 6123 4567</span>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div class="info-content">
                    <span class="info-title">Secure booking</span>
                    <span class="info-text">Your data is protected with SSL encryption</span>
                  </div>
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

const increaseGuests = () => {
  bookingDates.value.guests++
  updateAvailability()
}

const decreaseGuests = () => {
  bookingDates.value.guests--
  updateAvailability()
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
  grid-template-columns: 1.2fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.room-main {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-gray-100);
}

.room-section {
  margin-bottom: 2.5rem;
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

/* Enhanced Section Header */
.section-header {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 14px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.section-header:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.1);
  transform: translateY(-2px);
}

.section-icon-wrapper {
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
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.section-header:hover .section-icon-wrapper {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.section-icon {
  width: 24px;
  height: 24px;
}

.section-title-content {
  flex: 1;
}

.section-title-content h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  border: none;
  padding: 0;
}

.section-subtitle {
  font-size: 1rem;
  color: var(--color-gray-600);
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

/* Description Content */
.description-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: start;
}

.description-text {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.description-text:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.description-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #374151;
  margin: 0;
  font-weight: 500;
}

.description-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.875rem;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.highlight-item:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  transform: translateX(4px);
}

.highlight-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-gold-50) 0%, 
    var(--color-gold-100) 100%);
  border: 2px solid var(--color-gold-200);
  border-radius: 10px;
  color: var(--color-gold-600);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.highlight-item:hover .highlight-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.2);
}

.highlight-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.highlight-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.highlight-text {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
  font-weight: 500;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.875rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.amenity-item:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  transform: translateX(4px);
}

.amenity-icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%);
  border: 2px solid var(--color-primary-200);
  border-radius: 8px;
  color: var(--color-primary-600);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.amenity-item:hover .amenity-icon-wrapper {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
}

.amenity-icon-wrapper svg {
  width: 16px;
  height: 16px;
}

.amenity-text {
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.875rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.detail-item:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  transform: translateX(4px);
}

.detail-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-gold-50) 0%, 
    var(--color-gold-100) 100%);
  border: 2px solid var(--color-gold-200);
  border-radius: 8px;
  color: var(--color-gold-600);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.detail-item:hover .detail-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.2);
}

.detail-icon svg {
  width: 16px;
  height: 16px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  color: #111827;
  font-weight: 700;
  font-size: 1rem;
}

.house-rules-container {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(249, 250, 251, 0.8) 100%);
  border: 1px solid rgba(229, 231, 235, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.house-rules-container:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.house-rules {
  list-style: none;
  padding: 0;
  margin: 0;
}

.house-rules li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  color: #374151;
  border-bottom: 1px solid rgba(229, 231, 235, 0.4);
  transition: all 0.3s ease;
}

.house-rules li:last-child {
  border-bottom: none;
}

.house-rules li:hover {
  transform: translateX(4px);
}

.rule-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%);
  border: 2px solid var(--color-primary-200);
  border-radius: 8px;
  color: var(--color-primary-600);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.house-rules li:hover .rule-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
}

.rule-icon svg {
  width: 16px;
  height: 16px;
}

.rule-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.rule-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rule-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.booking-sidebar {
  position: sticky;
  top: 2rem;
}

.booking-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.98) 100%);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 
    0 16px 32px rgba(0, 0, 0, 0.08),
    0 6px 12px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.booking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    var(--color-primary-500) 0%, 
    var(--color-gold-500) 50%, 
    var(--color-primary-600) 100%);
  border-radius: 20px 20px 0 0;
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.12),
    0 12px 24px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: rgba(16, 185, 129, 0.3);
}

.booking-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(243, 244, 246, 0.8);
  position: relative;
}

.booking-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, 
    var(--color-primary-500) 0%, 
    var(--color-gold-500) 100%);
  border-radius: 1px;
}

.booking-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.booking-icon {
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
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.booking-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.booking-subtitle {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  font-weight: 500;
  letter-spacing: 0.025em;
}

.booking-section {
  margin-bottom: 2rem;
}

.booking-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  padding: 0.625rem 0.875rem;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.05) 0%, 
    rgba(16, 185, 129, 0.08) 100%);
  border-radius: 8px;
  border-left: 3px solid var(--color-primary-500);
}

.section-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary-600);
  flex-shrink: 0;
}

.date-selection {
  margin-bottom: 1.5rem;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: linear-gradient(135deg, 
    rgba(249, 250, 251, 0.8) 0%, 
    rgba(255, 255, 255, 0.9) 100%);
  border: 2px solid rgba(229, 231, 235, 0.6);
  border-radius: 10px;
  padding: 0.875rem 1rem;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.date-input-group:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.date-input-group:focus-within {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.date-input {
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: #374151;
  outline: none;
  font-weight: 500;
}

.date-input:focus {
  color: var(--color-primary-700);
}

.date-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--color-primary-500);
  flex-shrink: 0;
}

.guest-selection {
  margin-bottom: 1.5rem;
}

.guest-selector {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: linear-gradient(135deg, 
    rgba(249, 250, 251, 0.8) 0%, 
    rgba(255, 255, 255, 0.9) 100%);
  border: 2px solid rgba(229, 231, 235, 0.6);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.guest-selector:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.guest-btn {
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%);
  border: 2px solid var(--color-primary-200);
  border-radius: 10px;
  cursor: pointer;
  padding: 0.75rem;
  color: var(--color-primary-600);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.guest-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, 
    var(--color-primary-100) 0%, 
    var(--color-primary-200) 100%);
  border-color: var(--color-primary-300);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
}

.guest-btn:disabled {
  background: #f3f4f6;
  border-color: #e5e7eb;
  color: var(--color-gray-400);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.guest-btn svg {
  width: 16px;
  height: 16px;
}

.guest-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.guest-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary-700);
}

.guest-label {
  font-size: 0.875rem;
  color: #374151;
}

.guest-note {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-top: 0.5rem;
}

.availability-status {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid;
}

.availability-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 2px solid;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.availability-status.available {
  background: linear-gradient(135deg, 
    rgba(240, 253, 244, 0.8) 0%, 
    rgba(220, 252, 231, 0.9) 100%);
  color: #166534;
  border-color: #bbf7d0;
}

.availability-status.unavailable {
  background: linear-gradient(135deg, 
    rgba(254, 242, 242, 0.8) 0%, 
    rgba(254, 226, 226, 0.9) 100%);
  color: #dc2626;
  border-color: #fecaca;
}

.status-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.availability-status.available .status-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.availability-status.unavailable .status-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status-content {
  display: flex;
  flex-direction: column;
}

.status-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.status-subtitle {
  font-size: 0.875rem;
  color: #374151;
}

.price-breakdown {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, 
    rgba(249, 250, 251, 0.8) 0%, 
    rgba(255, 255, 255, 0.9) 100%);
  border: 2px solid rgba(229, 231, 235, 0.6);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.price-breakdown:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: #374151;
  padding: 0.5rem 0;
}

.price-row.total {
  border-top: 2px solid rgba(229, 231, 235, 0.8);
  padding-top: 1rem;
  margin-top: 1rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: #111827;
}

.total-price {
  background: linear-gradient(135deg, 
    var(--color-gold-500) 0%, 
    var(--color-gold-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.price-label {
  font-weight: 600;
}

.price-value {
  color: #111827;
  font-weight: 500;
}

.price-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
}

.price-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-top: 1rem;
}

.booking-actions {
  margin-bottom: 2rem;
}

.booking-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.booking-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.2) 50%, 
    transparent 100%);
  transition: left 0.5s ease;
}

.booking-btn:hover::before {
  left: 100%;
}

.booking-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.booking-btn:hover svg {
  transform: scale(1.1);
}

.booking-btn.login-btn {
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  color: white;
  border: none;
}

.booking-btn.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, 
    var(--color-primary-700) 0%, 
    var(--color-primary-800) 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.booking-btn.disabled-btn {
  background: linear-gradient(135deg, 
    #f3f4f6 0%, 
    #e5e7eb 100%);
  color: var(--color-gray-400);
  border: 2px solid #e5e7eb;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.booking-btn.disabled-btn:hover {
  transform: none;
  box-shadow: none;
}

.booking-btn.book-now-btn {
  background: linear-gradient(135deg, 
    var(--color-gold-600) 0%, 
    var(--color-gold-700) 100%);
  color: white;
  border: none;
}

.booking-btn.book-now-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, 
    var(--color-gold-700) 0%, 
    var(--color-gold-800) 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.quick-info {
  border-top: 2px solid rgba(229, 231, 235, 0.6);
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  margin-bottom: 1.25rem;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, 
    rgba(249, 250, 251, 0.6) 0%, 
    rgba(255, 255, 255, 0.8) 100%);
  border: 1px solid rgba(229, 231, 235, 0.4);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.info-item:hover {
  border-color: var(--color-primary-300);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
  transform: translateX(4px);
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%);
  border: 1px solid var(--color-primary-200);
  border-radius: 6px;
  color: var(--color-primary-600);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.info-item:hover .info-icon {
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.info-text {
  font-size: 0.75rem;
  color: #374151;
}

@media (max-width: 1024px) {
  .room-content-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .booking-sidebar {
    position: static;
  }
  
  .room-main {
    padding: 1.5rem;
  }
  
  .booking-card {
    padding: 1.75rem;
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

  .booking-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding-bottom: 1rem;
  }

  .booking-icon {
    font-size: 1.5rem;
  }

  .booking-subtitle {
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }

  .booking-section {
    margin-bottom: 2rem;
  }

  .date-input-group {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }

  .date-input {
    width: 100%;
  }

  .date-separator {
    display: none;
  }

  .guest-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }

  .guest-btn {
    width: 100%;
    justify-content: center;
  }

  .guest-count {
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .guest-number {
    font-size: 1.25rem;
  }

  .guest-label {
    font-size: 0.75rem;
  }

  .guest-note {
    font-size: 0.75rem;
  }

  .amenities-grid,
  .details-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
  }

  .section-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .section-icon {
    width: 24px;
    height: 24px;
  }

  .section-title-content h2 {
    font-size: 1.5rem;
  }

  .section-subtitle {
    font-size: 0.9rem;
  }

  .description-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .description-text {
    padding: 1.5rem;
  }

  .description-text p {
    font-size: 1rem;
  }

  .highlight-item {
    padding: 1.25rem;
  }

  .highlight-icon {
    width: 36px;
    height: 36px;
  }

  .highlight-title {
    font-size: 0.95rem;
  }

  .highlight-text {
    font-size: 0.8rem;
  }

  .amenity-item {
    padding: 1rem 1.25rem;
  }

  .amenity-icon-wrapper {
    width: 28px;
    height: 28px;
  }

  .amenity-icon-wrapper svg {
    width: 14px;
    height: 14px;
  }

  .amenity-text {
    font-size: 0.9rem;
  }

  .detail-item {
    padding: 1rem 1.25rem;
  }

  .detail-icon {
    width: 28px;
    height: 28px;
  }

  .detail-icon svg {
    width: 14px;
    height: 14px;
  }

  .detail-label {
    font-size: 0.8rem;
  }

  .detail-value {
    font-size: 0.95rem;
  }

  .house-rules-container {
    padding: 1.25rem;
  }

  .house-rules li {
    padding: 0.875rem 0;
  }

  .rule-icon {
    width: 28px;
    height: 28px;
  }

  .rule-icon svg {
    width: 14px;
    height: 14px;
  }

  .rule-title {
    font-size: 0.8rem;
  }

  .rule-text {
    font-size: 0.8rem;
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
