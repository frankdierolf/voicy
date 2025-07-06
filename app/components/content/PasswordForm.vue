<script setup lang="ts">
defineProps<{
  question?: string
}>()

const password = ref('')
const loading = ref(false)
const verified = ref(false)
const error = ref('')
const secureData = ref('')

async function verifyPassword() {
  if (!password.value.trim()) {
    error.value = 'Please enter a password'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/verify-password', {
      method: 'POST',
      body: { password: password.value }
    })

    if (response.success) {
      verified.value = true
      
      // Fetch secure data (cookie auth is automatic)
      const dataResponse = await $fetch('/api/secure-data', {
        method: 'GET'
      })
      
      secureData.value = dataResponse.data
    } else {
      error.value = response.message || 'Incorrect password'
    }
  } catch (err) {
    error.value = 'Verification failed. Please try again.'
  } finally {
    loading.value = false
  }
}

function onSubmit() {
  verifyPassword()
}

function reset() {
  verified.value = false
  password.value = ''
  error.value = ''
  secureData.value = ''
}
</script>

<template>
  <div class="password-form bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-4">
    <div v-if="!verified">
      <div class="flex items-center gap-2 mb-3">
        <UIcon name="i-lucide-lock" class="text-amber-500" />
        <h3 class="text-lg font-semibold">Password Required</h3>
      </div>
      
      <p class="text-muted mb-4">
        <span v-if="question">To access information about "{{ question }}", please</span>
        <span v-else>To access your secure data, please</span>
        enter your password:
      </p>

      <UForm :state="{ password }" @submit="onSubmit" class="space-y-3">
        <div class="flex gap-2">
          <UInput 
            v-model="password" 
            type="password" 
            placeholder="Enter your password"
            :loading="loading"
            :disabled="loading"
            class="flex-1"
            @keydown.enter="onSubmit"
          />
          <UButton 
            type="submit" 
            :loading="loading"
            :disabled="!password.trim() || loading"
            color="primary"
          >
            Verify
          </UButton>
        </div>
        
        <div v-if="error" class="flex items-center gap-2 text-red-500 text-sm">
          <UIcon name="i-lucide-alert-circle" />
          <span>{{ error }}</span>
        </div>
      </UForm>
    </div>

    <div v-else class="space-y-3">
      <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
        <UIcon name="i-lucide-check-circle" />
        <h3 class="text-lg font-semibold">Access Granted</h3>
      </div>
      
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md p-3">
        <h4 class="font-medium mb-2">Your Secure Data:</h4>
        <div class="text-sm space-y-1" v-html="secureData"></div>
      </div>

      <UButton 
        size="sm" 
        variant="outline" 
        @click="reset"
        class="mt-3"
      >
        Hide Data
      </UButton>
    </div>
  </div>
</template>

<style scoped>
.password-form {
  max-width: 100%;
  transition: all 0.3s ease;
}
</style>