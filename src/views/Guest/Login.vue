<template>
  <!-- fill-height makes this row take full remaining height inside v-main -->
  <v-row no-gutters class="fill-height" style="min-height: calc(100vh - 40px)">

    <!-- LEFT: Image panel — hidden on mobile -->
    <v-col
      cols="12"
      md="6"
      class="d-none d-md-flex align-end"
      style="
        background: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200') center/cover no-repeat;
        position: relative;
      "
    >
      <!-- Dark overlay — inline style required for gradient over bg image -->
      <div
        class="w-100 h-100 position-absolute"
        style="inset:0; background: linear-gradient(160deg,rgba(10,48,60,.90) 0%,rgba(10,48,60,.65) 100%);"
      />

      <!-- Content on top of overlay -->
      <div class="position-relative pa-10 pb-14 text-white">
        <p class="text-caption text-uppercase font-weight-bold mb-3 opacity-60">
          Real Estate Platform
        </p>
        <div class="text-h4 font-weight-bold mb-3" style="line-height:1.2">
          Your Trusted Partner<br/>in Real Estate
        </div>
        <p class="text-body-2 opacity-75 mb-8" style="max-width:360px; line-height:1.8">
          Thousands of verified properties across the Philippines, with expert agents ready to help.
        </p>
        <div class="d-flex ga-8">
          <div v-for="s in heroStats" :key="s.label">
            <div class="text-h6 font-weight-bold">{{ s.val }}</div>
            <div class="text-caption opacity-60">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </v-col>

    <!-- RIGHT: Form panel -->
    <v-col
      cols="12"
      md="6"
      class="d-flex align-center justify-center pa-6 bg-grey-lighten-5"
    >
      <v-sheet max-width="420" width="100%" color="transparent">

        <div class="mb-8">
          <p class="text-overline text-primary font-weight-bold mb-1">Welcome Back</p>
          <h1 class="text-h5 font-weight-bold text-grey-darken-4">Sign in to your account</h1>
          <p class="text-body-2 text-medium-emphasis mt-1">Enter your credentials to continue</p>
        </div>

        <v-form ref="formRef" @submit.prevent="handleLogin">

          <v-text-field
            v-model="form.email"
            :rules="emailRules"
            variant="outlined"
            density="comfortable"
            label="Email Address"
            placeholder="you@example.com"
            prepend-inner-icon="mdi-email-outline"
            rounded="lg"
            class="mb-3"
            :disabled="loading"
            bg-color="white"
          />

          <v-text-field
            v-model="form.password"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            label="Password"
            placeholder="••••••••"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append-inner="showPassword = !showPassword"
            rounded="lg"
            class="mb-1"
            :disabled="loading"
            bg-color="white"
          />

          <div class="d-flex justify-space-between align-center mb-5">
            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              density="compact"
              hide-details
              color="primary"
            />
            <v-btn variant="text" color="primary" size="small" class="text-caption">
              Forgot password?
            </v-btn>
          </div>

          <!-- Error Alert -->
          <v-alert
            v-if="errorMsg"
            type="error"
            variant="tonal"
            rounded="lg"
            class="mb-4"
            density="compact"
            :text="errorMsg"
            closable
            @click:close="errorMsg = ''"
          />

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            rounded="lg"
            variant="flat"
            :loading="loading"
            class="font-weight-bold"
          >
            Sign In
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>

        </v-form>

        <p class="text-center text-caption text-medium-emphasis mt-6">
          By signing in you agree to our
          <v-btn variant="text" color="primary" size="x-small" class="px-1">Terms</v-btn>
          and
          <v-btn variant="text" color="primary" size="x-small" class="px-1">Privacy Policy</v-btn>
        </p>

      </v-sheet>
    </v-col>

  </v-row>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router    = useRouter()
const authStore = useAuthStore()
const formRef   = ref(null)
const loading   = ref(false)
const showPassword = ref(false)
const rememberMe   = ref(false)
const errorMsg     = ref('')

const form = reactive({ email: '', password: '' })

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Must be a valid email',
]
const passwordRules = [
  v => !!v || 'Password is required',
  // v => v.length >= 6 || 'Minimum 6 characters',
]

const heroStats = [
  { val: '12K+', label: 'Properties' },
  { val: '350+', label: 'Agents' },
  { val: '8.5K+', label: 'Happy Clients' },
]

const handleLogin = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  errorMsg.value = ''

  try {
    await authStore.login(form.email, form.password)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    errorMsg.value = err?.response?.data?.error || 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>