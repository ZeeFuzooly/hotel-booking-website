<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <div class="not-found-illustration">
          <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <h1 class="not-found-title">404</h1>
        <h2 class="not-found-subtitle">Page Not Found</h2>
        <p class="not-found-description">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <div class="not-found-actions">
          <BaseButton 
            size="lg" 
            @click="$router.push('/')"
          >
            Go Home
          </BaseButton>
          <BaseButton 
            variant="outline" 
            size="lg"
            @click="$router.push('/rooms')"
          >
            Browse Rooms
          </BaseButton>
        </div>
        
        <div class="not-found-links">
          <router-link to="/" class="not-found-link">Home</router-link>
          <router-link to="/rooms" class="not-found-link">Rooms</router-link>
          <router-link to="/login" class="not-found-link">Login</router-link>
          <router-link to="/register" class="not-found-link">Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-800) 0%, 
    var(--color-primary-900) 100%);
  color: white;
  text-align: center;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow: hidden;
}

.not-found::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop') center/cover;
  opacity: 0.1;
  z-index: 0;
}

.not-found::after {
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

.not-found-content {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.not-found-illustration {
  margin-bottom: 2rem;
  opacity: 0.8;
}

.not-found-title {
  font-size: 6rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, 
    var(--color-gold-300) 0%, 
    var(--color-gold-400) 50%, 
    var(--color-gold-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.not-found-subtitle {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.not-found-description {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  line-height: 1.6;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.not-found-links {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.not-found-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity var(--transition-fast);
  opacity: 0.8;
}

.not-found-link:hover {
  opacity: 1;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .not-found-title {
    font-size: 4rem;
  }
  
  .not-found-subtitle {
    font-size: 1.5rem;
  }
  
  .not-found-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .not-found-links {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .not-found {
    padding: 1rem;
  }
  
  .not-found-title {
    font-size: 3rem;
  }
  
  .not-found-subtitle {
    font-size: 1.25rem;
  }
  
  .not-found-description {
    font-size: 1rem;
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
