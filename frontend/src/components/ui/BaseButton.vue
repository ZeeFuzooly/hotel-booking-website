<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'relative',
    'overflow-hidden'
  ]

  // Size classes
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-6', 'py-3', 'text-lg']
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-gradient-to-r',
      'from-blue-500',
      'to-blue-600',
      'text-white',
      'hover:from-blue-600',
      'hover:to-blue-700',
      'focus:ring-blue-500',
      'shadow-md',
      'hover:shadow-lg'
    ],
    secondary: [
      'bg-gray-200',
      'text-gray-800',
      'hover:bg-gray-300',
      'focus:ring-gray-500',
      'shadow-sm'
    ],
    success: [
      'bg-gradient-to-r',
      'from-green-500',
      'to-green-600',
      'text-white',
      'hover:from-green-600',
      'hover:to-green-700',
      'focus:ring-green-500',
      'shadow-md'
    ],
    warning: [
      'bg-gradient-to-r',
      'from-yellow-500',
      'to-yellow-600',
      'text-white',
      'hover:from-yellow-600',
      'hover:to-yellow-700',
      'focus:ring-yellow-500',
      'shadow-md'
    ],
    danger: [
      'bg-gradient-to-r',
      'from-red-500',
      'to-red-600',
      'text-white',
      'hover:from-red-600',
      'hover:to-red-700',
      'focus:ring-red-500',
      'shadow-md'
    ],
    outline: [
      'bg-transparent',
      'border-2',
      'border-blue-500',
      'text-blue-600',
      'hover:bg-blue-500',
      'hover:text-white',
      'focus:ring-blue-500',
      'shadow-sm'
    ],
    ghost: [
      'bg-transparent',
      'text-gray-600',
      'hover:bg-gray-100',
      'focus:ring-gray-500'
    ]
  }

  // Width classes
  const widthClasses = props.fullWidth ? ['w-full'] : []

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...widthClasses
  ]
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.loading-spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 0.5em;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Focus ring styles */
button:focus {
  outline: none;
}

button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Shimmer effect */
button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-slow);
}

button:hover::before {
  left: 100%;
}

/* Hover effects */
button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
}

/* Disabled state */
button:disabled {
  transform: none !important;
  box-shadow: none !important;
}
</style>
