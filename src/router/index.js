import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // GUEST LAYOUT
  {
    path: '/',
    component: () => import('@/layouts/GuestLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Guest/Home.vue'),
        meta: { guest: true },
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Guest/Login.vue'),
        meta: { guest: true, hideAppBar: true },
      },
    ],
  },

  // USER LAYOUT (auth required)
  {
    path: '/dashboard',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/User/Dashboard.vue'),
      },
    ],
  },
  {
    path: '/analytics',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Analytics',
        component: () => import('@/views/User/Dashboard.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Dynamic import error handling
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

// Navigation Guard — use return instead of next() to avoid deprecation warning
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth)

  // Not logged in, trying to access protected route → redirect to login
  if (requiresAuth && !token) {
    return { name: 'Login' }
  }

  // Already logged in, trying to access login page → redirect to dashboard
  if (to.name === 'Login' && token) {
    return { name: 'Dashboard' }
  }

  // All good — proceed
  return true
})

export default router