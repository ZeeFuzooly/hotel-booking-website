<template>
  <div id="app">
    <nav class="navbar" v-if="!isAuthPage">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          <span class="logo-icon">🏨</span>
          <span class="logo-text">Hotel Booking</span>
        </router-link>
        
        <div class="nav-menu">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/rooms" class="nav-link">Rooms</router-link>
          <router-link to="/dashboard" class="nav-link" v-if="isAuthenticated">Dashboard</router-link>
        </div>
        
        <div class="nav-auth">
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="btn btn-outline">Login</router-link>
            <router-link to="/register" class="btn btn-primary">Register</router-link>
          </template>
          <template v-else>
            <div class="user-menu">
              <button @click="toggleUserMenu" class="user-menu-btn">
                <span class="user-avatar">{{ userInitials }}</span>
                <span class="user-name">{{ user?.first_name }}</span>
                <span class="dropdown-arrow">▼</span>
              </button>
              <div v-if="showUserMenu" class="user-dropdown">
                <router-link to="/dashboard" class="dropdown-item">Dashboard</router-link>
                <router-link to="/profile" class="dropdown-item">Profile</router-link>
                <button @click="logout" class="dropdown-item logout-btn">Logout</button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer" v-if="!isAuthPage">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Hotel Booking</h3>
          <p>Find your perfect stay with our easy-to-use booking platform.</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <router-link to="/" class="footer-link">Home</router-link>
          <router-link to="/rooms" class="footer-link">Rooms</router-link>
          <router-link to="/dashboard" class="footer-link" v-if="isAuthenticated">Dashboard</router-link>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>Email: info@hotelbooking.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 Hotel Booking. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    const showUserMenu = ref(false)

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const user = computed(() => authStore.user)
    
    const isAuthPage = computed(() => {
      return ['login', 'register'].includes(route.name)
    })

    const userInitials = computed(() => {
      if (!user.value) return ''
      return `${user.value.first_name?.[0] || ''}${user.value.last_name?.[0] || ''}`.toUpperCase()
    })

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const logout = async () => {
      await authStore.logout()
      showUserMenu.value = false
      router.push('/login')
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        showUserMenu.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isAuthenticated,
      user,
      isAuthPage,
      userInitials,
      showUserMenu,
      toggleUserMenu,
      logout
    }
  }
}
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  border-bottom: 1px solid var(--color-gray-200);
  transition: all var(--transition-normal);
}

.nav-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
}

.nav-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-gray-900);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
  transition: all var(--transition-fast);
}

.nav-logo:hover {
  transform: translateY(-1px);
}

.logo-icon {
  font-size: var(--font-size-2xl);
  margin-right: var(--spacing-2);
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  gap: var(--spacing-8);
}

.nav-link {
  text-decoration: none;
  color: var(--color-gray-600);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

.nav-link.router-link-active {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
  font-weight: var(--font-weight-semibold);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-primary-500);
  border-radius: var(--border-radius-full);
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.btn {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-lg);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-slow);
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary-600);
  border: 2px solid var(--color-primary-500);
}

.btn-outline:hover {
  background: var(--color-primary-500);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.user-menu {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--border-radius-xl);
  transition: all var(--transition-fast);
  border: 1px solid var(--color-gray-200);
}

.user-menu-btn:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-300);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-sm);
}

.user-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
}

.dropdown-arrow {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  transition: transform var(--transition-fast);
}

.user-menu-btn:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-2));
  right: 0;
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  min-width: 180px;
  z-index: var(--z-dropdown);
  animation: slideInDown var(--transition-fast);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.dropdown-item {
  display: block;
  padding: var(--spacing-3) var(--spacing-4);
  text-decoration: none;
  color: var(--color-gray-700);
  transition: all var(--transition-fast);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: 0;
}

.dropdown-item:first-child {
  border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
}

.dropdown-item:hover {
  background: var(--color-gray-50);
  color: var(--color-primary-600);
  transform: translateX(4px);
}

.logout-btn {
  color: var(--color-error-600);
  border-top: 1px solid var(--color-gray-200);
}

.logout-btn:hover {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.main-content {
  min-height: calc(100vh - var(--header-height) - 300px);
}

.footer {
  background: linear-gradient(135deg, var(--color-gray-900) 0%, var(--color-gray-800) 100%);
  color: white;
  margin-top: auto;
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.05"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.05"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.footer-content {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-12) var(--spacing-4) var(--spacing-8);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-8);
  position: relative;
  z-index: 1;
}

.footer-section h3 {
  margin-bottom: var(--spacing-4);
  color: var(--color-white);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-300));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-section h4 {
  margin-bottom: var(--spacing-3);
  color: var(--color-gray-100);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.footer-section p {
  color: var(--color-gray-300);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-3);
}

.footer-link {
  display: block;
  color: var(--color-gray-300);
  text-decoration: none;
  margin-bottom: var(--spacing-2);
  transition: all var(--transition-fast);
  padding: var(--spacing-1) 0;
  position: relative;
}

.footer-link::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary-400), var(--color-primary-300));
  transition: width var(--transition-fast);
}

.footer-link:hover {
  color: var(--color-white);
  transform: translateX(4px);
}

.footer-link:hover::before {
  width: 100%;
}

.footer-bottom {
  border-top: 1px solid var(--color-gray-700);
  padding: var(--spacing-4);
  text-align: center;
  color: var(--color-gray-400);
  position: relative;
  z-index: 1;
  background: rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .nav-container {
    padding: 0 var(--spacing-2);
  }
  
  .user-name {
    display: none;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--spacing-6);
  }
  
  .nav-logo {
    font-size: var(--font-size-lg);
  }
  
  .logo-icon {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 var(--spacing-3);
  }
  
  .btn {
    padding: var(--spacing-2) var(--spacing-3);
    font-size: var(--font-size-xs);
  }
  
  .footer-content {
    padding: var(--spacing-8) var(--spacing-3) var(--spacing-6);
  }
}
</style>
