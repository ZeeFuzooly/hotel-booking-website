import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views (will be created next)
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Dashboard from '@/views/Dashboard.vue'
import Profile from '@/views/Profile.vue'
import RoomSearch from '@/views/RoomSearch.vue'
import RoomDetail from '@/views/RoomDetail.vue'
import BookingForm from '@/views/BookingForm.vue'
import BookingConfirmation from '@/views/BookingConfirmation.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home - Hotel Booking' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      title: 'Login - Hotel Booking',
      requiresGuest: true 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { 
      title: 'Register - Hotel Booking',
      requiresGuest: true 
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      title: 'Dashboard - Hotel Booking',
      requiresAuth: true 
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { 
      title: 'Profile - Hotel Booking',
      requiresAuth: true 
    }
  },
  {
    path: '/rooms',
    name: 'RoomSearch',
    component: RoomSearch,
    meta: { title: 'Search Rooms - Hotel Booking' }
  },
  {
    path: '/rooms/:id',
    name: 'RoomDetail',
    component: RoomDetail,
    props: true,
    meta: { title: 'Room Details - Hotel Booking' }
  },
  {
    path: '/booking/form',
    name: 'BookingForm',
    component: BookingForm,
    meta: { 
      title: 'Book Room - Hotel Booking',
      requiresAuth: true 
    }
  },
  {
    path: '/booking/:roomId',
    name: 'BookingFormWithRoom',
    component: BookingForm,
    props: true,
    meta: { 
      title: 'Book Room - Hotel Booking',
      requiresAuth: true 
    }
  },
  {
    path: '/booking/confirmation/:bookingId',
    name: 'BookingConfirmation',
    component: BookingConfirmation,
    props: true,
    meta: { 
      title: 'Booking Confirmation - Hotel Booking',
      requiresAuth: true 
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page Not Found - Hotel Booking' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Initialize auth if needed
  if (authStore.accessToken && !authStore.user) {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      authStore.logout()
    }
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if trying to access protected route
    next({ 
      name: 'Login', 
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirect to dashboard if trying to access guest-only route
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

// After navigation
router.afterEach((to, from) => {
  // Clear any global errors
  const authStore = useAuthStore()
  authStore.clearError()
})

export default router
