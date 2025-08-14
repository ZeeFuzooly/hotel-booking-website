<template>
  <div class="form-group">
    <label v-if="label" :for="inputId" class="form-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="input-wrapper">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup="handleKeyup"
      />
      
      <div v-if="error" class="error-icon">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      
      <div v-if="success" class="success-icon">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-if="hint" class="hint-text">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time', 'datetime-local'
    ].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  min: {
    type: [String, Number],
    default: null
  },
  max: {
    type: [String, Number],
    default: null
  },
  step: {
    type: [String, Number],
    default: null
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'keyup'])

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  const baseClasses = [
    'w-full',
    'border-2',
    'rounded-xl',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-0',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'readonly:bg-gray-50',
    'bg-white',
    'shadow-sm'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['px-3', 'py-2', 'text-sm'],
    md: ['px-4', 'py-3', 'text-base'],
    lg: ['px-5', 'py-4', 'text-lg']
  }

  // State classes
  let stateClasses = [
    'border-gray-200',
    'focus:border-blue-500',
    'focus:ring-blue-500',
    'hover:border-gray-300'
  ]

  if (props.error) {
    stateClasses = [
      'border-red-300',
      'focus:border-red-500',
      'focus:ring-red-500',
      'bg-red-50'
    ]
  } else if (props.success) {
    stateClasses = [
      'border-green-300',
      'focus:border-green-500',
      'focus:ring-green-500',
      'bg-green-50'
    ]
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...stateClasses
  ]
})

const handleInput = (event) => {
  let value = event.target.value
  
  // Handle number type
  if (props.type === 'number') {
    value = value === '' ? '' : Number(value)
  }
  
  emit('update:modelValue', value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}

const handleKeyup = (event) => {
  emit('keyup', event)
}
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
}

.form-label {
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-snug);
  margin-bottom: var(--spacing-1);
}

.required-mark {
  color: var(--color-error-500);
  margin-left: var(--spacing-1);
  font-weight: var(--font-weight-bold);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  padding-right: 2.5rem; /* Space for icons */
}

.error-icon,
.success-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.error-icon {
  color: var(--color-error-500);
  animation: fadeInUp 0.3s ease-out;
}

.success-icon {
  color: var(--color-success-500);
  animation: fadeInUp 0.3s ease-out;
}

.error-message {
  color: var(--color-error-600);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-snug);
  margin-top: var(--spacing-1);
  font-weight: var(--font-weight-medium);
  animation: fadeInUp 0.3s ease-out;
}

.hint-text {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-snug);
  margin-top: var(--spacing-1);
}

/* Focus styles */
input:focus {
  outline: none;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

input:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Placeholder styles */
input::placeholder {
  color: var(--color-gray-400);
  font-style: italic;
}

/* Input hover effect */
input:hover:not(:disabled):not(:focus) {
  border-color: var(--color-gray-300);
  box-shadow: var(--shadow-sm);
}

/* Disabled styles */
input:disabled {
  background-color: var(--gray-100);
  cursor: not-allowed;
}

/* Readonly styles */
input:read-only {
  background-color: var(--gray-50);
  cursor: default;
}

/* Number input arrows */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Search input clear button */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

/* Date input calendar icon */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

/* Time input clock icon */
input[type="time"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
