import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const data = response.data

    token.value = data.access_token
    user.value = data.user

    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Store token expiration from JWT
    try {
      const payload = JSON.parse(atob(data.access_token.split('.')[1]))
      localStorage.setItem('token_exp', (payload.exp * 1000).toString())
    } catch (e) {
      console.error('Failed to decode token exp', e)
    }

    return data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      // silent fail - still clear local state
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('token_exp')
      localStorage.removeItem('user')
    }
  }

  const fetchMe = async () => {
    const response = await api.get('/auth/me')
    user.value = response.data
    localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
  }

  return { user, token, isAuthenticated, login, logout, fetchMe }
})