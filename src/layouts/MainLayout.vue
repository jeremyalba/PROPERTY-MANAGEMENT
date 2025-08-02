<template>
  <el-container class="layout-container">
    <!-- Sidebar -->
    <el-aside width="250px" class="sidebar">
      <div class="logo">
        <h2>Property Management</h2>
      </div>
      
      <el-menu
        :default-active="$route.path"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>

        <el-menu-item index="/properties" v-if="authStore.hasPermission('properties')">
          <el-icon><OfficeBuilding /></el-icon>
          <span>Properties</span>
        </el-menu-item>

        <el-menu-item index="/tenants" v-if="authStore.hasPermission('tenants')">
          <el-icon><User /></el-icon>
          <span>Tenants</span>
        </el-menu-item>

        <el-menu-item index="/contracts" v-if="authStore.hasPermission('contracts')">
          <el-icon><Document /></el-icon>
          <span>Contracts</span>
        </el-menu-item>

        <el-menu-item index="/payments" v-if="authStore.hasPermission('payments')">
          <el-icon><Money /></el-icon>
          <span>Payments</span>
        </el-menu-item>

        <el-menu-item index="/maintenance" v-if="authStore.hasPermission('maintenance')">
          <el-icon><Tools /></el-icon>
          <span>Maintenance</span>
        </el-menu-item>

        <el-menu-item index="/reports" v-if="authStore.hasPermission('reports')">
          <el-icon><DataAnalysis /></el-icon>
          <span>Reports</span>
        </el-menu-item>

        <el-menu-item index="/users" v-if="authStore.hasPermission('users')">
          <el-icon><UserFilled /></el-icon>
          <span>Users</span>
        </el-menu-item>

        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>Settings</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main Content -->
    <el-container>
      <!-- Header -->
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <!-- Notifications -->
          <el-dropdown @command="handleNotificationCommand" class="notification-dropdown">
            <el-badge :value="notificationStore.unreadCount" :hidden="notificationStore.unreadCount === 0">
              <el-button type="text" size="large">
                <el-icon><Bell /></el-icon>
              </el-button>
            </el-badge>
            
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="notificationStore.notifications.length === 0">
                  No notifications
                </el-dropdown-item>
                <el-dropdown-item 
                  v-for="notification in notificationStore.notifications.slice(0, 5)" 
                  :key="notification.id"
                  :command="`view-${notification.id}`"
                  :class="{ 'unread': !notification.is_read }"
                >
                  <div class="notification-item">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-message">{{ notification.message }}</div>
                    <div class="notification-time">{{ formatTime(notification.created_at) }}</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided command="view-all">
                  View all notifications
                </el-dropdown-item>
                <el-dropdown-item command="mark-all-read">
                  Mark all as read
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- User Menu -->
          <el-dropdown @command="handleUserCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userAvatar">
                {{ authStore.user?.fullName?.charAt(0) || 'U' }}
              </el-avatar>
              <span class="username">{{ authStore.user?.fullName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  Profile
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  Settings
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  Logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main Content Area -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const userAvatar = ref('')

// Breadcrumbs
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  const items = [{ path: '/', name: 'Home' }]
  
  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const name = path.charAt(0).toUpperCase() + path.slice(1)
    items.push({ path: currentPath, name })
  })
  
  return items
})

// Format time
const formatTime = (time) => {
  return dayjs(time).fromNow()
}

// Handle notification commands
const handleNotificationCommand = (command) => {
  if (command === 'view-all') {
    // TODO: Navigate to notifications page
    return
  }
  
  if (command === 'mark-all-read') {
    notificationStore.markAllAsRead()
    return
  }
  
  if (command.startsWith('view-')) {
    const notificationId = parseInt(command.replace('view-', ''))
    notificationStore.markAsRead(notificationId)
    // TODO: Navigate to related item
  }
}

// Handle user commands
const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      // TODO: Navigate to profile page
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      authStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  color: white;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #435266;
}

.logo h2 {
  color: white;
  margin: 0;
  font-size: 18px;
}

.sidebar-menu {
  border: none;
  margin-top: 20px;
}

.header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-dropdown {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-weight: 500;
  color: #303133;
}

.main-content {
  background-color: #f0f2f5;
  overflow-y: auto;
}

.notification-item {
  text-align: left;
  min-width: 250px;
}

.notification-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 11px;
  color: #c0c4cc;
}

.unread {
  background-color: #f0f9ff;
}

.unread .notification-title {
  color: #1890ff;
}
</style>