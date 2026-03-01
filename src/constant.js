export default {
  main_site: 'http://192.168.1.9:3000',

  apiv1: 'http://192.168.1.9:8080/api',
  apiv1_ip: 'http://192.168.1.9:3000/',

  timeout: 60000,

  // Auth endpoints
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  me: '/auth/me',

  // Static helpers (use computed if needed, not static localStorage)
  get bearer_token() {
    return `?token=${localStorage.getItem('token')}`
  },
  get headers() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  },
  headers_tokenless: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  api_status: '/api-status',
}