<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="logo-section">
            <h1 class="logo">🏨 HotelBook</h1>
            <p class="tagline">Your perfect stay starts here</p>
          </div>
          <h2 class="register-title">Create your account</h2>
        </div>

        <form @submit.prevent="handleSubmit" class="register-form">
          <div v-if="authStore.error" class="error-alert">
            <div class="error-icon">⚠️</div>
            <span>{{ authStore.error }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <div class="input-wrapper">
                <input
                  v-model="form.firstName"
                  type="text"
                  class="form-input"
                  placeholder="Enter your first name"
                  :class="{ 'error': v$.firstName.$error }"
                  required
                  autocomplete="given-name"
                  @blur="v$.firstName.$touch"
                />
                <span class="input-icon">👤</span>
              </div>
              <span v-if="v$.firstName.$error" class="error-text">
                {{ v$.firstName.$errors[0].$message }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">Last Name</label>
              <div class="input-wrapper">
                <input
                  v-model="form.lastName"
                  type="text"
                  class="form-input"
                  placeholder="Enter your last name"
                  :class="{ 'error': v$.lastName.$error }"
                  required
                  autocomplete="family-name"
                  @blur="v$.lastName.$touch"
                />
                <span class="input-icon">👤</span>
              </div>
              <span v-if="v$.lastName.$error" class="error-text">
                {{ v$.lastName.$errors[0].$message }}
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <div class="input-wrapper">
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="Enter your email address"
                :class="{ 'error': v$.email.$error }"
                required
                autocomplete="email"
                @blur="v$.email.$touch"
              />
              <span class="input-icon">📧</span>
            </div>
            <span v-if="v$.email.$error" class="error-text">
              {{ v$.email.$errors[0].$message }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <div class="input-wrapper">
              <input
                v-model="form.phone"
                type="tel"
                class="form-input"
                placeholder="Enter your phone number"
                :class="{ 'error': v$.phone.$error }"
                required
                autocomplete="tel"
                @blur="v$.phone.$touch"
              />
              <span class="input-icon">📞</span>
            </div>
            <span v-if="v$.phone.$error" class="error-text">
              {{ v$.phone.$errors[0].$message }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-wrapper">
              <input
                v-model="form.password"
                type="password"
                class="form-input"
                placeholder="Create a strong password"
                :class="{ 'error': v$.password.$error }"
                required
                autocomplete="new-password"
                @blur="v$.password.$touch"
                @input="checkPasswordStrength"
              />
              <span class="input-icon">🔒</span>
            </div>
            <span v-if="v$.password.$error" class="error-text">
              {{ v$.password.$errors[0].$message }}
            </span>
            
            <!-- Password Strength Indicator -->
            <div v-if="form.password" class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill"
                  :class="passwordStrengthClass"
                  :style="{ width: passwordStrength + '%' }"
                ></div>
              </div>
              <p class="strength-text" :class="passwordStrengthClass">
                {{ passwordStrengthText }}
              </p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <div class="input-wrapper">
              <input
                v-model="form.confirmPassword"
                type="password"
                class="form-input"
                placeholder="Confirm your password"
                :class="{ 'error': v$.confirmPassword.$error }"
                required
                autocomplete="new-password"
                @blur="v$.confirmPassword.$touch"
              />
              <span class="input-icon">🔒</span>
            </div>
            <span v-if="v$.confirmPassword.$error" class="error-text">
              {{ v$.confirmPassword.$errors[0].$message }}
            </span>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input
                v-model="form.agreeToTerms"
                type="checkbox"
                class="checkbox-input"
                required
              />
              <span class="checkbox-text">
                I agree to the 
                <a href="#" class="terms-link">Terms of Service</a> 
                and 
                <a href="#" class="terms-link">Privacy Policy</a>
              </span>
            </label>
            
            <label class="checkbox-label">
              <input
                v-model="form.marketingEmails"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-text">
                Send me marketing emails and updates
              </span>
            </label>
          </div>

          <button
            type="submit"
            class="register-button"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading" class="loading-spinner"></span>
            {{ authStore.isLoading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="register-divider">
          <span class="divider-text">or continue with</span>
        </div>

        <div class="social-register">
          <button
            type="button"
            class="social-button"
            @click="handleGoogleRegister"
          >
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div class="register-footer">
          <p class="footer-text">
            Already have an account?
            <router-link to="/login" class="footer-link">
              Sign in here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  marketingEmails: false
})

// Password strength
const passwordStrength = ref(0)
const passwordStrengthText = ref('')

// Custom validators
const phoneRegex = helpers.regex(/^[\+]?[1-9][\d]{0,15}$/)

// Validation rules
const rules = {
  firstName: { required },
  lastName: { required },
  email: { required, email },
  phone: { required, phoneRegex },
  password: { 
    required, 
    minLength: minLength(6)
  },
  confirmPassword: { 
    required, 
    sameAsPassword: helpers.withMessage('Passwords must match', (value) => value === form.password)
  }
}

const v$ = useVuelidate(rules, form)

const checkPasswordStrength = () => {
  const password = form.password
  let strength = 0
  let text = ''

  if (password.length >= 6) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 25

  passwordStrength.value = strength

  if (strength < 25) {
    text = 'Very Weak'
  } else if (strength < 50) {
    text = 'Weak'
  } else if (strength < 75) {
    text = 'Fair'
  } else if (strength < 100) {
    text = 'Good'
  } else {
    text = 'Strong'
  }

  passwordStrengthText.value = text
}

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength < 25) return 'strength-very-weak'
  if (strength < 50) return 'strength-weak'
  if (strength < 75) return 'strength-fair'
  if (strength < 100) return 'strength-good'
  return 'strength-strong'
})

const handleSubmit = async () => {
  // Trim whitespace from text inputs
  form.firstName = form.firstName.trim()
  form.lastName = form.lastName.trim()
  form.email = form.email.trim()
  form.phone = form.phone.trim()
  
  const isValid = await v$.value.$validate()
  
  if (!isValid) {
    return
  }

  if (!form.agreeToTerms) {
    authStore.setError('You must agree to the Terms of Service and Privacy Policy')
    return
  }

  const result = await authStore.register({
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    email: form.email,
    phone: form.phone,
    password: form.password,
    marketingEmails: form.marketingEmails
  })

  if (result.success) {
    router.push('/dashboard')
  }
}

const handleGoogleRegister = () => {
  // Implement Google OAuth registration
  console.log('Google register clicked')
}

// Clear error when component mounts
onMounted(() => {
  authStore.clearError()
})
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-primary-800) 0%, 
    var(--color-primary-900) 50%, 
    var(--color-primary-950) 100%);
  padding: 1rem;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.register-page::before {
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

.register-page::after {
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

.register-container {
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 2;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  padding: 2.5rem;
  animation: fadeInUp 0.6s ease-out;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
}

.register-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  margin-bottom: 1.5rem;
}

.logo {
  font-size: 2.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  margin-bottom: 0.5rem;
}

.tagline {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.register-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.register-form {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #374151;
  background: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.form-input::placeholder {
  color: #9ca3af;
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

.error-text {
  display: block;
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.error-icon {
  font-size: 1rem;
}

/* Password Strength Indicator */
.password-strength {
  margin: 0.75rem 0;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-very-weak {
  background: #ef4444;
}

.strength-weak {
  background: #f97316;
}

.strength-fair {
  background: #eab308;
}

.strength-good {
  background: #22c55e;
}

.strength-strong {
  background: #16a34a;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
  margin: 0;
}

.strength-text.strength-very-weak {
  color: #ef4444;
}

.strength-text.strength-weak {
  color: #f97316;
}

.strength-text.strength-fair {
  color: #eab308;
}

.strength-text.strength-good {
  color: #22c55e;
}

.strength-text.strength-strong {
  color: #16a34a;
}

.form-options {
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.125rem;
  flex-shrink: 0;
  appearance: none;
  position: relative;
}

.checkbox-input:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-input:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.checkbox-text {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
}

.terms-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.terms-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.register-button {
  width: 100%;
  padding: 0.875rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.register-button:hover {
  background: #2563eb;
}

.register-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.register-divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
}

.register-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider-text {
  background: white;
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.social-register {
  margin-bottom: 1.5rem;
}

.social-button {
  width: 100%;
  padding: 0.875rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.social-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.google-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.register-footer {
  text-align: center;
}

.footer-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.footer-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #2563eb;
  text-decoration: underline;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .register-card {
    padding: 2rem;
  }
  
  .register-title {
    font-size: 1.25rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem;
  }
  
  .form-options {
    gap: 0.75rem;
  }
}
</style>
