import axios from 'axios'
import constant from '@/constant'
import router from '@/router'

const api = axios.create({
  baseURL: constant.apiv1,
  timeout: constant.timeout,
  headers: {
    Accept: 'application/json',
  },
  // withCredentials: true,
})

let isSessionDialogShown = false
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Helper function to check if token is expired
const isTokenExpired = () => {
  const tokenExp = localStorage.getItem('token_exp')
  if (!tokenExp) return true
  
  const expirationTime = parseInt(tokenExp)
  const currentTime = Date.now()
  
  // Token is expired if current time is past expiration
  return currentTime >= expirationTime
}

// Helper function to decode JWT without verification
const getTokenExpiration = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 // Convert to milliseconds
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

// RESPONSE interceptor with intelligent refresh token logic
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // CHECK IF TOKEN IS ACTUALLY EXPIRED
      const tokenExpired = isTokenExpired()
      
      if (!tokenExpired) {
        // Token is not expired, this is a different auth issue
        // (e.g., invalid token, revoked token, insufficient permissions)
        console.error('Authentication failed but token is not expired')
        
        localStorage.clear()
        const ui = useUIStore()
        if (!isSessionDialogShown) {
          isSessionDialogShown = true
          ui.showSessionExpired(
            'Authentication failed. Please login again.'
          )
        }
        return Promise.reject(error)
      }

      // TOKEN IS EXPIRED, PROCEED WITH REFRESH
      console.log('Token expired, attempting refresh...')
      
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Call refresh endpoint
        const response = await axios.post(
          `${constant.apiv1}${constant.refresh}`,
          {},
          {
            // withCredentials: true, // Send cookies with refresh token
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        if (response.data.status !== 200) {
          throw new Error('Refresh failed')
        }

        const newToken = response.data.access_token

        // Store new token
        localStorage.setItem('token', newToken)
        
        // Update token expiration
        const tokenExp = getTokenExpiration(newToken)
        if (tokenExp) {
          localStorage.setItem('token_exp', tokenExp)
        }

        console.log('Token refreshed successfully')

        // Update default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        // Process queued requests
        processQueue(null, newToken)
        
        isRefreshing = false

        // Retry original request
        return api(originalRequest)

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        
        processQueue(refreshError, null)
        isRefreshing = false

        // Clear storage and show session expired
        localStorage.clear()
        
        const ui = useUIStore()
        if (!isSessionDialogShown) {
          isSessionDialogShown = true
          ui.showSessionExpired(
            'Your session has expired. Please login again.'
          )
        }

        return Promise.reject(refreshError)
      }
    }

    // For other errors, just reject
    return Promise.reject(error)
  }
)

export default api