import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'properties',
        name: 'Properties',
        component: () => import('@/views/Properties.vue')
      },
      {
        path: 'properties/:id/rooms',
        name: 'PropertyRooms',
        component: () => import('@/views/PropertyRooms.vue')
      },
      {
        path: 'rooms/:id/beds',
        name: 'RoomBeds',
        component: () => import('@/views/RoomBeds.vue')
      },
      {
        path: 'tenants',
        name: 'Tenants',
        component: () => import('@/views/Tenants.vue')
      },
      {
        path: 'tenants/:id',
        name: 'TenantDetail',
        component: () => import('@/views/TenantDetail.vue')
      },
      {
        path: 'contracts',
        name: 'Contracts',
        component: () => import('@/views/Contracts.vue')
      },
      {
        path: 'contracts/:id',
        name: 'ContractDetail',
        component: () => import('@/views/ContractDetail.vue')
      },
      {
        path: 'payments',
        name: 'Payments',
        component: () => import('@/views/Payments.vue')
      },
      {
        path: 'maintenance',
        name: 'Maintenance',
        component: () => import('@/views/Maintenance.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/Reports.vue')
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router