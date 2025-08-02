import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import bcrypt from 'bcryptjs'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const login = async (username, password) => {
    try {
      // Get user from database
      const userData = await window.electronAPI.dbGet(
        'SELECT * FROM users WHERE username = ?',
        [username]
      )

      if (!userData) {
        throw new Error('Invalid username or password')
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userData.password_hash)
      if (!isValidPassword) {
        throw new Error('Invalid username or password')
      }

      // Update last login
      await window.electronAPI.dbExec(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [userData.id]
      )

      // Set user and token
      user.value = {
        id: userData.id,
        username: userData.username,
        role: userData.role,
        fullName: userData.full_name,
        email: userData.email
      }

      // Generate simple token (in production, use JWT)
      const newToken = btoa(JSON.stringify({
        userId: userData.id,
        username: userData.username,
        role: userData.role,
        timestamp: Date.now()
      }))

      token.value = newToken
      localStorage.setItem('auth_token', newToken)

      return { success: true, user: user.value }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      const tokenData = JSON.parse(atob(token.value))
      const userData = await window.electronAPI.dbGet(
        'SELECT id, username, role, full_name, email FROM users WHERE id = ?',
        [tokenData.userId]
      )

      if (userData) {
        user.value = {
          id: userData.id,
          username: userData.username,
          role: userData.role,
          fullName: userData.full_name,
          email: userData.email
        }
        return true
      } else {
        logout()
        return false
      }
    } catch (error) {
      console.error('Auth check error:', error)
      logout()
      return false
    }
  }

  const hasPermission = (permission) => {
    if (!user.value) return false

    const permissions = {
      admin: ['all'],
      manager: ['properties', 'tenants', 'contracts', 'payments', 'maintenance', 'reports'],
      accountant: ['payments', 'reports']
    }

    const userPermissions = permissions[user.value.role] || []
    return userPermissions.includes('all') || userPermissions.includes(permission)
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    hasPermission
  }
})