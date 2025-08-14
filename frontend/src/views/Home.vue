<template>
  <div class="home">
    <!-- Enhanced Hero Section with Advanced Search -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <div class="floating-elements">
          <div class="floating-shape shape-1"></div>
          <div class="floating-shape shape-2"></div>
          <div class="floating-shape shape-3"></div>
          <div class="floating-shape shape-4"></div>
        </div>
        <div class="particles-container" id="particles-js"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">
              <span class="badge-icon">🏆</span>
              <span class="badge-text">World-Class Luxury Hotels</span>
            </div>
            <h1 class="hero-title">
              Experience Luxury
              <span class="gradient-text">Beyond Imagination</span>
            </h1>
            <p class="hero-subtitle">
              Discover the world's most prestigious accommodations with unparalleled service, 
              breathtaking views, and memories that last a lifetime
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number" data-count="5000">0</span>
                <span class="stat-label">Luxury Hotels</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" data-count="150">0</span>
                <span class="stat-label">Countries</span>
              </div>
              <div class="stat-item">
                <span class="stat-number" data-count="99">0</span>
                <span class="stat-label">% Satisfaction</span>
              </div>
            </div>
            <div class="hero-features">
              <div class="feature-item">
                <div class="feature-icon-wrapper">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span class="feature-text">5-Star Excellence</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon-wrapper">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span class="feature-text">Secure Booking</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon-wrapper">
                  <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <span class="feature-text">Best Price Guarantee</span>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Search Form -->
          <div class="search-container">
            <div class="search-card glass">
              <div class="search-header">
                <div class="search-header-content">
                  <h3>Find Your Perfect Luxury Stay</h3>
                  <p>Experience world-class accommodations with personalized service</p>
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
                        v-model="searchData.checkIn"
                        type="date"
                        class="form-input"
                        :min="minDate"
                        required
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
                        v-model="searchData.checkOut"
                        type="date"
                        class="form-input"
                        :min="searchData.checkIn || minDate"
                        required
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
                      <select v-model="searchData.guests" class="form-select">
                        <option v-for="i in 10" :key="i" :value="i">
                          {{ i }} {{ i === 1 ? 'Guest' : 'Guests' }}
                        </option>
                      </select>
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
                      <select v-model="searchData.roomType" class="form-select">
                        <option value="">All Luxury Types</option>
                        <option value="standard">Standard Suite</option>
                        <option value="deluxe">Deluxe Suite</option>
                        <option value="premium">Premium Suite</option>
                        <option value="presidential">Presidential Suite</option>
                        <option value="villa">Private Villa</option>
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
                            v-model="searchData.minPrice"
                            type="number"
                            class="form-input price-input"
                            placeholder="Min"
                            :min="0"
                          />
                        </div>
                        <div class="price-separator">
                          <div class="separator-line"></div>
                          <span>to</span>
                          <div class="separator-line"></div>
                        </div>
                        <div class="input-wrapper">
                          <input
                            v-model="searchData.maxPrice"
                            type="number"
                            class="form-input price-input"
                            placeholder="Max"
                            :min="0"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div class="amenities-group">
                      <label class="form-label">Must-Have Amenities</label>
                      <div class="amenities-grid">
                        <label class="amenity-checkbox">
                          <input type="checkbox" v-model="searchData.amenities" value="wifi">
                          <span class="checkmark"></span>
                          <span class="amenity-text">WiFi</span>
                        </label>
                        <label class="amenity-checkbox">
                          <input type="checkbox" v-model="searchData.amenities" value="pool">
                          <span class="checkmark"></span>
                          <span class="amenity-text">Pool</span>
                        </label>
                        <label class="amenity-checkbox">
                          <input type="checkbox" v-model="searchData.amenities" value="spa">
                          <span class="checkmark"></span>
                          <span class="amenity-text">Spa</span>
                        </label>
                        <label class="amenity-checkbox">
                          <input type="checkbox" v-model="searchData.amenities" value="gym">
                          <span class="checkmark"></span>
                          <span class="amenity-text">Gym</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="search-actions">
                  <button type="submit" class="search-button gradient-primary">
                    <span v-if="isSearching" class="loading-spinner"></span>
                    <svg v-else class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                    Search Luxury Hotels
                  </button>
                  <button type="button" class="clear-button" @click="clearSearch">
                    <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>
                    </svg>
                    Clear All
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Destinations -->
    <section class="destinations">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Popular Destinations</h2>
          <p class="section-subtitle">Explore our most sought-after locations</p>
        </div>
        
        <div class="destinations-grid">
          <div class="destination-card" @click="searchDestination('city-center')">
            <div class="destination-image">
              <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop" alt="City Center" />
            </div>
            <div class="destination-content">
              <h3>City Center</h3>
              <p>Heart of the city with easy access to attractions</p>
              <span class="destination-price">From S$150/night</span>
            </div>
          </div>
          
          <div class="destination-card" @click="searchDestination('business-district')">
            <div class="destination-image">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop" alt="Business District" />
            </div>
            <div class="destination-content">
              <h3>Business District</h3>
              <p>Perfect for business travelers and corporate events</p>
              <span class="destination-price">From S$200/night</span>
            </div>
          </div>
          
          <div class="destination-card" @click="searchDestination('airport-area')">
            <div class="destination-image">
              <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop" alt="Airport Area" />
            </div>
            <div class="destination-content">
              <h3>Airport Area</h3>
              <p>Convenient for early flights and layovers</p>
              <span class="destination-price">From S$120/night</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Rooms Section -->
    <section class="featured-rooms">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Featured Rooms</h2>
          <p class="section-subtitle">Our most popular accommodations</p>
        </div>
        
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading featured rooms...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <div class="error-icon">⚠️</div>
          <h3>Error Loading Rooms</h3>
          <p>{{ error }}</p>
          <button @click="loadFeaturedRooms" class="retry-button">Try Again</button>
        </div>
        
        <div v-else class="rooms-grid">
          <div 
            v-for="room in featuredRooms" 
            :key="room.id" 
            class="room-card"
            @click="viewRoom(room.id)"
          >
            <div class="room-image">
              <img :src="room.images[0]" :alt="room.name" />
              <div class="room-price-overlay">
                <span class="room-price">S${{ room.price }}/night</span>
              </div>
            </div>
            <div class="room-content">
              <h3 class="room-title">{{ room.name }}</h3>
              <p class="room-description">{{ room.description }}</p>
              <div class="room-meta">
                <span class="room-type">{{ room.type }}</span>
                <span class="room-capacity">{{ room.capacity }} guests</span>
                <span class="room-size">{{ room.size }}m²</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="section-actions">
          <button class="view-all-button" @click="$router.push('/rooms')">
            View All Rooms
          </button>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="why-choose-us">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Choose Us</h2>
          <p class="section-subtitle">Experience the difference with our premium services</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🏨</div>
            <h3>Premium Accommodations</h3>
            <p>Luxurious rooms with modern amenities and stunning views</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📍</div>
            <h3>Prime Locations</h3>
            <p>Strategic locations near major attractions and business centers</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Best Price Guarantee</h3>
            <p>We guarantee the best rates for your stay</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3>Flexible Cancellation</h3>
            <p>Free cancellation up to 24 hours before check-in</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Secure Booking</h3>
            <p>Safe and secure payment processing</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📞</div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock customer support for your needs</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Book Your Perfect Stay?</h2>
          <p>Join thousands of satisfied guests who have experienced luxury and comfort</p>
          <div class="cta-actions">
            <button class="cta-button primary" @click="$router.push('/register')">
              Create Account
            </button>
            <button class="cta-button secondary" @click="$router.push('/rooms')">
              Browse Rooms
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoomsStore } from '@/stores/rooms'

const router = useRouter()
const roomsStore = useRoomsStore()

// Search data
const searchData = reactive({
  checkIn: '',
  checkOut: '',
  guests: 1,
  roomType: '',
  minPrice: null,
  maxPrice: null,
  amenities: []
})

const isSearching = ref(false)
const featuredRooms = ref([])
const isLoading = ref(false)
const error = ref(null)
const showAdvanced = ref(false)

// Computed properties
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Methods
const handleSearch = () => {
  // Validate required fields
  if (!searchData.checkIn || !searchData.checkOut) {
    alert('Please select both check-in and check-out dates')
    return
  }
  
  if (searchData.checkIn >= searchData.checkOut) {
    alert('Check-out date must be after check-in date')
    return
  }
  
  isSearching.value = true
  
  // Build query parameters
  const query = {}
  if (searchData.checkIn) query.checkIn = searchData.checkIn
  if (searchData.checkOut) query.checkOut = searchData.checkOut
  if (searchData.guests) query.guests = searchData.guests
  if (searchData.roomType) query.roomType = searchData.roomType
  if (searchData.minPrice) query.minPrice = searchData.minPrice
  if (searchData.maxPrice) query.maxPrice = searchData.maxPrice
  
  // Navigate to search page with filters
  router.push({
    path: '/rooms',
    query
  })
  
  setTimeout(() => {
    isSearching.value = false
  }, 1000)
}

const clearSearch = () => {
  Object.assign(searchData, {
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
    minPrice: null,
    maxPrice: null,
    amenities: []
  })
}

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

// Animate numbers on scroll
const animateNumbers = () => {
  const numbers = document.querySelectorAll('[data-count]')
  numbers.forEach(number => {
    const target = parseInt(number.getAttribute('data-count'))
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      number.textContent = Math.floor(current)
    }, 16)
  })
}

const searchDestination = (destination) => {
  // Set default search for destination
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  searchData.checkIn = today.toISOString().split('T')[0]
  searchData.checkOut = tomorrow.toISOString().split('T')[0]
  searchData.guests = 2
  
  // Build query parameters
  const query = {
    checkIn: searchData.checkIn,
    checkOut: searchData.checkOut,
    guests: searchData.guests
  }
  
  // Add destination-specific filters
  if (destination === 'business-district') {
    query.roomType = 'premium'
    query.minPrice = 200
  } else if (destination === 'city-center') {
    query.roomType = 'deluxe'
    query.minPrice = 150
  } else if (destination === 'airport-area') {
    query.roomType = 'standard'
    query.maxPrice = 150
  }
  
  // Navigate to search page with filters
  router.push({
    path: '/rooms',
    query
  })
}

const loadFeaturedRooms = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const result = await roomsStore.getRooms({ limit: 3 })
    if (result.success) {
      featuredRooms.value = roomsStore.rooms.slice(0, 3)
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Failed to load featured rooms'
  } finally {
    isLoading.value = false
  }
}

const viewRoom = (roomId) => {
  router.push(`/rooms/${roomId}`)
}

onMounted(() => {
  loadFeaturedRooms()
  
  // Initialize particles
  if (typeof window !== 'undefined' && window.particlesJS) {
    window.particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'repulse' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        }
      },
      retina_detect: true
    })
  }
  
  // Animate numbers when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumbers()
        observer.unobserve(entry.target)
      }
    })
  })
  
  const statsSection = document.querySelector('.hero-stats')
  if (statsSection) {
    observer.observe(statsSection)
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Enhanced Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  color: white;
  background: linear-gradient(135deg, 
    var(--color-primary-800) 0%, 
    var(--color-primary-900) 50%, 
    var(--color-primary-950) 100%);
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop') center/cover;
  opacity: 0.15;
  z-index: 0;
}

.hero::after {
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
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop') center/cover;
  z-index: -2;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-overlay);
  z-index: -1;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: -5s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: 30%;
  right: 15%;
  animation-delay: -10s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: 20%;
  animation-delay: -15s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-30px) translateX(20px) scale(1.1);
    opacity: 1;
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Enhanced Badge */
.hero-badge {
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
.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
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
.hero-subtitle {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.95) !important;
  line-height: 1.6;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4) !important;
  font-weight: 400;
  animation: fadeInUp 0.8s ease-out 0.6s both;
  text-align: center;
}

.hero-text {
  margin-bottom: 3rem;
}

/* Enhanced Stats */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
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
  font-weight: 900;
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

/* Enhanced Features */
.hero-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 1s both;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.1) 0%, 
    rgba(16, 185, 129, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: rgba(16, 185, 129, 0.3);
}

.feature-item:hover::before {
  opacity: 1;
}

.feature-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, 
    var(--color-primary-400) 0%, 
    var(--color-primary-500) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.feature-item:hover .feature-icon-wrapper {
  background: linear-gradient(135deg, 
    var(--color-gold-400) 0%, 
    var(--color-gold-500) 100%);
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
}

.feature-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.feature-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4) !important;
  letter-spacing: 0.025em;
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

/* Search Container */
.search-container {
  margin-top: 2rem;
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
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: white;
}

.search-header p {
  font-size: 1.125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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

.search-row:last-of-type {
  grid-template-columns: 1fr;
  max-width: 600px;
  margin: 0 auto;
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
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
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

.input-icon {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1rem;
  pointer-events: none;
}

.select-icon {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.75rem;
  pointer-events: none;
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
  color: #6b7280;
  font-weight: 500;
  font-size: 1rem;
}

.search-advanced {
  border-top: 1px solid var(--color-gray-200);
  padding-top: 1.5rem;
}

.advanced-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--color-primary-600);
  font-weight: 600;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.advanced-toggle:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.toggle-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.advanced-options {
  animation: fadeInUp 0.3s ease-out;
}

.price-range-group {
  margin-bottom: 1.5rem;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-separator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray-500);
  font-weight: 500;
}

.separator-line {
  width: 20px;
  height: 1px;
  background: var(--color-gray-300);
}

.amenities-group {
  margin-bottom: 1.5rem;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 0.75rem;
}

.amenity-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.amenity-checkbox:hover {
  background: var(--color-gray-50);
}

.amenity-checkbox input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-300);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.amenity-checkbox input:checked + .checkmark {
  background: var(--color-primary-500);
  border-color: var(--color-primary-500);
}

.amenity-checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.amenity-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
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
  font-weight: 700;
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

.search-button:active {
  transform: translateY(0);
}

.search-button:disabled {
  background: var(--color-gray-400);
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--shadow-sm);
}

.clear-button {
  background: white;
  color: var(--color-gray-700);
  border: 2px solid var(--color-gray-200);
  box-shadow: var(--shadow-sm);
}

.clear-button:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-300);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.button-icon {
  width: 18px;
  height: 18px;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Destinations Section */
.destinations {
  padding: 4rem 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.destination-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.destination-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.destination-image {
  height: 200px;
  overflow: hidden;
}

.destination-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.destination-card:hover .destination-image img {
  transform: scale(1.05);
}

.destination-content {
  padding: 1.5rem;
}

.destination-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.destination-content p {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.destination-price {
  color: var(--color-primary-600);
  font-weight: 600;
  font-size: 0.875rem;
}

/* Featured Rooms Section */
.featured-rooms {
  padding: 4rem 0;
  background: #f9fafb;
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.room-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.room-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.room-card:hover .room-image img {
  transform: scale(1.05);
}

.room-price-overlay {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  backdrop-filter: blur(4px);
}

.room-content {
  padding: 1.5rem;
}

.room-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.room-description {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.room-meta {
  display: flex;
  gap: 0.75rem;
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

.section-actions {
  text-align: center;
  margin-top: 3rem;
}

.view-all-button {
  padding: 0.875rem 2rem;
  background: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.view-all-button:hover {
  background: var(--color-primary-700);
}

/* Why Choose Us Section */
.why-choose-us {
  padding: 4rem 0;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #111827;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.5;
}

/* CTA Section */
.cta-section {
  padding: 4rem 0;
  background: var(--gradient-primary);
  color: white;
  text-align: center;
}

.cta-content h2 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cta-button.primary {
  background: white;
  color: var(--color-primary-600);
}

.cta-button.primary:hover {
  background: #f9fafb;
  transform: translateY(-2px);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button.secondary:hover {
  background: white;
  color: var(--color-primary-600);
  transform: translateY(-2px);
}

/* Loading and Error States */
.loading-container,
.error-container {
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

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.retry-button {
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

.retry-button:hover {
  background: var(--color-primary-700);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero {
    padding: 4rem 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .stat-item {
    padding: 0.75rem 1rem;
  }
  
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
  
  .destinations-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .rooms-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .search-card {
    margin: 0 1rem;
  }
  
  .search-form {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 1rem;
    min-height: 80vh;
  }
  
  .hero-title {
    font-size: 2rem;
    line-height: 1.3;
  }
  
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .hero-stats {
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
  
  .hero-features {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .feature-item {
    padding: 0.75rem 1rem;
  }
  
  .feature-icon-wrapper {
    width: 2rem;
    height: 2rem;
  }
  
  .feature-icon {
    width: 1rem;
    height: 1rem;
  }
  
  .feature-text {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 2rem 0.75rem;
    min-height: 70vh;
  }
  
  .hero-title {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
  }
  
  .hero-subtitle {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  
  .hero-stats {
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
  
  .hero-features {
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .feature-item {
    padding: 0.625rem 0.875rem;
  }
  
  .feature-icon-wrapper {
    width: 1.75rem;
    height: 1.75rem;
  }
  
  .feature-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
  
  .feature-text {
    font-size: 0.625rem;
  }
}

/* Text Visibility Improvements */
.hero-title {
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.stat-label {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.feature-text {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.search-header h3 {
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}

.search-header p {
  color: rgba(255, 255, 255, 0.95) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

.destination-content h3 {
  color: var(--color-gray-900) !important;
  font-weight: 700 !important;
}

.destination-content p {
  color: var(--color-gray-600) !important;
  line-height: 1.5 !important;
}

.destination-price {
  color: var(--color-primary-600) !important;
  font-weight: 600 !important;
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

.section-title {
  color: var(--color-gray-900) !important;
  font-weight: 700 !important;
}

.section-subtitle {
  color: var(--color-gray-600) !important;
}

.feature-card h3 {
  color: var(--color-gray-900) !important;
  font-weight: 600 !important;
}

.feature-card p {
  color: var(--color-gray-600) !important;
  line-height: 1.5 !important;
}

/* Enhanced Focus States for Better Accessibility */
.form-input:focus,
.form-select:focus {
  border-color: var(--color-primary-500) !important;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
  outline: none !important;
}

.search-button:focus,
.clear-button:focus,
.view-all-button:focus {
  outline: 2px solid var(--color-primary-500) !important;
  outline-offset: 2px !important;
}

/* Better Button Contrast */
.search-button {
  background: var(--gradient-primary) !important;
  color: white !important;
  font-weight: 600 !important;
}

.view-all-button {
  background: var(--color-primary-600) !important;
  color: white !important;
  font-weight: 600 !important;
}

.clear-button {
  background: white !important;
  color: var(--color-gray-700) !important;
  border-color: var(--color-gray-300) !important;
  font-weight: 600 !important;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
