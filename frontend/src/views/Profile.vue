<template>
  <div class="profile">
    <div class="container">
      <div class="profile-header">
        <h1 class="profile-title">Profile Settings</h1>
        <p class="profile-subtitle">
          Manage your account information and preferences
        </p>
      </div>

      <div class="profile-content">
        <!-- Personal Information -->
        <div class="profile-section">
          <h2 class="section-title">Personal Information</h2>
          
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-row">
              <BaseInput
                v-model="profileForm.firstName"
                type="text"
                label="First Name"
                placeholder="Enter your first name"
                :error="v$.firstName.$error ? v$.firstName.$errors[0].$message : ''"
                required
                @blur="v$.firstName.$touch"
              />

              <BaseInput
                v-model="profileForm.lastName"
                type="text"
                label="Last Name"
                placeholder="Enter your last name"
                :error="v$.lastName.$error ? v$.lastName.$errors[0].$message : ''"
                required
                @blur="v$.lastName.$touch"
              />
            </div>

            <BaseInput
              v-model="profileForm.email"
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              :error="v$.email.$error ? v$.email.$errors[0].$message : ''"
              required
              @blur="v$.email.$touch"
            />

            <BaseInput
              v-model="profileForm.phone"
              type="tel"
              label="Phone Number"
              placeholder="Enter your phone number"
              :error="v$.phone.$error ? v$.phone.$errors[0].$message : ''"
              required
              @blur="v$.phone.$touch"
            />

            <div class="form-actions">
              <BaseButton 
                type="submit" 
                :loading="isUpdating"
                class="save-button"
              >
                Save Changes
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Change Password -->
        <div class="profile-section">
          <h2 class="section-title">Change Password</h2>
          
          <form @submit.prevent="changePassword" class="password-form">
            <BaseInput
              v-model="passwordForm.currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter your current password"
              :error="v$.currentPassword.$error ? v$.currentPassword.$errors[0].$message : ''"
              required
              @blur="v$.currentPassword.$touch"
            />

            <BaseInput
              v-model="passwordForm.newPassword"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              :error="v$.newPassword.$error ? v$.newPassword.$errors[0].$message : ''"
              required
              @blur="v$.newPassword.$touch"
            />

            <BaseInput
              v-model="passwordForm.confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              :error="v$.confirmPassword.$error ? v$.confirmPassword.$errors[0].$message : ''"
              required
              @blur="v$.confirmPassword.$touch"
            />

            <div class="form-actions">
              <BaseButton 
                type="submit" 
                :loading="isChangingPassword"
                class="change-password-button"
              >
                Change Password
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Account Settings -->
        <div class="profile-section">
          <h2 class="section-title">Account Settings</h2>
          
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">Marketing Emails</h3>
                <p class="setting-description">
                  Receive updates about special offers and promotions
                </p>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.marketingEmails"
                  type="checkbox"
                  @change="updateSettings"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h3 class="setting-title">Booking Notifications</h3>
                <p class="setting-description">
                  Get notified about booking confirmations and updates
                </p>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.bookingNotifications"
                  type="checkbox"
                  @change="updateSettings"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="profile-section danger-zone">
          <h2 class="section-title">Danger Zone</h2>
          
          <div class="danger-actions">
            <div class="danger-item">
              <div class="danger-info">
                <h3 class="danger-title">Delete Account</h3>
                <p class="danger-description">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <BaseButton 
                variant="danger" 
                @click="showDeleteModal = true"
              >
                Delete Account
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <BaseModal 
      v-model:isOpen="showDeleteModal"
      title="Delete Account"
      size="md"
    >
      <div class="delete-modal-content">
        <div class="warning-message">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <h3>Are you sure?</h3>
          <p>
            This action will permanently delete your account and all associated data including:
          </p>
          <ul class="delete-list">
            <li>All booking history</li>
            <li>Personal information</li>
            <li>Account preferences</li>
            <li>This action cannot be undone</li>
          </ul>
        </div>

        <form @submit.prevent="deleteAccount" class="delete-form">
          <BaseInput
            v-model="deleteForm.password"
            type="password"
            label="Enter your password to confirm"
            placeholder="Enter your password"
            :error="deleteForm.error"
            required
          />
        </form>
      </div>
      
      <template #footer>
        <BaseButton 
          variant="outline" 
          @click="showDeleteModal = false"
        >
          Cancel
        </BaseButton>
        <BaseButton 
          variant="danger" 
          @click="deleteAccount"
          :loading="isDeleting"
        >
          Delete Account
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// State
const isUpdating = ref(false)
const isChangingPassword = ref(false)
const isDeleting = ref(false)
const showDeleteModal = ref(false)

// Profile form
const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Settings
const settings = reactive({
  marketingEmails: false,
  bookingNotifications: true
})

// Delete form
const deleteForm = reactive({
  password: '',
  error: ''
})

// Validation rules
const profileRules = {
  firstName: { required },
  lastName: { required },
  email: { required, email },
  phone: { required }
}

const passwordRules = {
  currentPassword: { required },
  newPassword: { 
    required, 
    minLength: minLength(8),
    passwordRegex: helpers.withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      helpers.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    )
  },
  confirmPassword: { 
    required, 
    sameAs: sameAs(passwordForm.newPassword)
  }
}

const v$ = useVuelidate(profileRules, profileForm)
const v$Password = useVuelidate(passwordRules, passwordForm)

// Methods
const loadProfile = () => {
  if (authStore.user) {
    profileForm.firstName = authStore.user.firstName || ''
    profileForm.lastName = authStore.user.lastName || ''
    profileForm.email = authStore.user.email || ''
    profileForm.phone = authStore.user.phone || ''
  }
}

const updateProfile = async () => {
  const isValid = await v$.value.$validate()
  
  if (!isValid) {
    return
  }

  try {
    isUpdating.value = true
    const result = await authStore.updateProfile(profileForm)
    
    if (result.success) {
      // Show success message
      console.log('Profile updated successfully')
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    isUpdating.value = false
  }
}

const changePassword = async () => {
  const isValid = await v$Password.value.$validate()
  
  if (!isValid) {
    return
  }

  try {
    isChangingPassword.value = true
    const result = await authStore.updateProfile({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    if (result.success) {
      // Clear form and show success message
      Object.assign(passwordForm, {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      v$Password.value.$reset()
      console.log('Password changed successfully')
    }
  } catch (error) {
    console.error('Failed to change password:', error)
  } finally {
    isChangingPassword.value = false
  }
}

const updateSettings = async () => {
  try {
    // Update user settings
    console.log('Settings updated:', settings)
  } catch (error) {
    console.error('Failed to update settings:', error)
  }
}

const deleteAccount = async () => {
  if (!deleteForm.password) {
    deleteForm.error = 'Password is required'
    return
  }

  try {
    isDeleting.value = true
    const result = await authStore.deleteAccount(deleteForm.password)
    
    if (result.success) {
      showDeleteModal.value = false
      router.push('/')
    }
  } catch (error) {
    deleteForm.error = 'Invalid password'
  } finally {
    isDeleting.value = false
  }
}

// Load profile data on mount
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile {
  padding: 2rem 0;
  min-height: 100vh;
  background: var(--color-gray-50);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
}

.profile-title {
  font-size: 2.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.profile-subtitle {
  color: var(--color-gray-600);
  font-size: 1.125rem;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.profile-content {
  max-width: 800px;
  margin: 0 auto;
}

.profile-section {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-gray-100);
  transition: all 0.4s ease;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.profile-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary-200);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.save-button,
.change-password-button {
  min-width: 150px;
}

/* Settings */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--gray-200);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 0.25rem 0;
}

.setting-description {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin: 0;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--gray-300);
  transition: var(--transition-fast);
  border-radius: 1.5rem;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 1.25rem;
  width: 1.25rem;
  left: 0.125rem;
  bottom: 0.125rem;
  background-color: white;
  transition: var(--transition-fast);
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(1.5rem);
}

/* Danger Zone */
.danger-zone {
  border: 1px solid var(--danger-color);
  background: #fef2f2;
}

.danger-zone .section-title {
  color: var(--danger-color);
}

.danger-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.danger-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 0.25rem 0;
}

.danger-description {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin: 0;
  max-width: 400px;
}

/* Delete Modal */
.delete-modal-content {
  text-align: center;
}

.warning-message {
  margin-bottom: 2rem;
}

.warning-message svg {
  color: var(--warning-color);
  margin-bottom: 1rem;
}

.warning-message h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 1rem 0;
}

.warning-message p {
  color: var(--gray-600);
  margin-bottom: 1rem;
}

.delete-list {
  text-align: left;
  list-style: disc;
  padding-left: 1.5rem;
  color: var(--gray-600);
  margin: 0;
}

.delete-list li {
  margin-bottom: 0.5rem;
}

.delete-form {
  margin-top: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-title {
    font-size: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .setting-item,
  .danger-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .save-button,
  .change-password-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile {
    padding: 1rem 0;
  }
  
  .profile-section {
    padding: 1.5rem;
  }
  
  .profile-title {
    font-size: 1.75rem;
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
