<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome back, {{ authStore.user?.fullName }}</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="refreshData">
          <el-icon><Refresh /></el-icon>
          Refresh
        </el-button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card success">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatCurrency(stats.totalCollected) }}</div>
              <div class="stat-label">Total Collected</div>
            </div>
          </div>
        </div>
      </el-col>
      
      <el-col :span="6">
        <div class="stat-card warning">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatCurrency(stats.pendingRent) }}</div>
              <div class="stat-label">Pending Rent</div>
            </div>
          </div>
        </div>
      </el-col>
      
      <el-col :span="6">
        <div class="stat-card info">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalTenants }}</div>
              <div class="stat-label">Total Tenants</div>
            </div>
          </div>
        </div>
      </el-col>
      
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><House /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.occupancyRate }}%</div>
              <div class="stat-label">Occupancy Rate</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Charts and Tables Row -->
    <el-row :gutter="20" class="charts-row">
      <!-- Recent Activities -->
      <el-col :span="12">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>Recent Activities</span>
              <el-button type="text" @click="viewAllActivities">View All</el-button>
            </div>
          </template>
          
          <div v-if="recentActivities.length === 0" class="empty-state">
            <el-icon><Document /></el-icon>
            <p>No recent activities</p>
          </div>
          
          <div v-else class="activity-list">
            <div 
              v-for="activity in recentActivities" 
              :key="activity.id" 
              class="activity-item"
            >
              <div class="activity-icon">
                <el-icon v-if="activity.type === 'payment'"><Money /></el-icon>
                <el-icon v-else-if="activity.type === 'contract'"><Document /></el-icon>
                <el-icon v-else-if="activity.type === 'tenant'"><User /></el-icon>
                <el-icon v-else><InfoFilled /></el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ formatTime(activity.created_at) }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Quick Actions -->
      <el-col :span="12">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>Quick Actions</span>
            </div>
          </template>
          
          <div class="quick-actions">
            <el-button 
              v-for="action in quickActions" 
              :key="action.name"
              :type="action.type"
              :icon="action.icon"
              class="quick-action-btn"
              @click="action.handler"
            >
              {{ action.label }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Alerts and Notifications -->
    <el-row :gutter="20" class="alerts-row">
      <el-col :span="24">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>Important Alerts</span>
              <el-button type="text" @click="viewAllAlerts">View All</el-button>
            </div>
          </template>
          
          <div v-if="alerts.length === 0" class="empty-state">
            <el-icon><Check /></el-icon>
            <p>No alerts at the moment</p>
          </div>
          
          <div v-else class="alerts-list">
            <el-alert
              v-for="alert in alerts"
              :key="alert.id"
              :title="alert.title"
              :description="alert.message"
              :type="alert.type"
              :closable="false"
              show-icon
              class="alert-item"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import dayjs from 'dayjs'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const stats = ref({
  totalCollected: 0,
  pendingRent: 0,
  totalTenants: 0,
  occupancyRate: 0
})

const recentActivities = ref([])
const alerts = ref([])

// Quick actions
const quickActions = [
  {
    name: 'add-tenant',
    label: 'Add Tenant',
    icon: 'User',
    type: 'primary',
    handler: () => router.push('/tenants')
  },
  {
    name: 'add-property',
    label: 'Add Property',
    icon: 'House',
    type: 'success',
    handler: () => router.push('/properties')
  },
  {
    name: 'create-contract',
    label: 'Create Contract',
    icon: 'Document',
    type: 'warning',
    handler: () => router.push('/contracts')
  },
  {
    name: 'record-payment',
    label: 'Record Payment',
    icon: 'Money',
    type: 'info',
    handler: () => router.push('/payments')
  }
]

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AED'
  }).format(amount)
}

// Format time
const formatTime = (time) => {
  return dayjs(time).fromNow()
}

// Load dashboard data
const loadDashboardData = async () => {
  try {
    loading.value = true

    // Load statistics
    const statsData = await Promise.all([
      window.electronAPI.dbGet('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = "paid"'),
      window.electronAPI.dbGet('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = "pending"'),
      window.electronAPI.dbGet('SELECT COUNT(*) as total FROM tenants'),
      window.electronAPI.dbGet('SELECT COUNT(*) as total FROM beds'),
      window.electronAPI.dbGet('SELECT COUNT(*) as total FROM beds WHERE status = "occupied"')
    ])

    stats.value = {
      totalCollected: statsData[0]?.total || 0,
      pendingRent: statsData[1]?.total || 0,
      totalTenants: statsData[2]?.total || 0,
      occupancyRate: statsData[3]?.total > 0 ? Math.round((statsData[4]?.total / statsData[3]?.total) * 100) : 0
    }

    // Load recent activities (from notifications)
    const activities = await window.electronAPI.dbAll(`
      SELECT * FROM notifications 
      ORDER BY created_at DESC 
      LIMIT 10
    `)
    recentActivities.value = activities

    // Load alerts
    const alertsData = await window.electronAPI.dbAll(`
      SELECT * FROM notifications 
      WHERE type IN ('contract_expiry', 'document_expiry', 'payment_due')
      AND is_read = 0
      ORDER BY created_at DESC 
      LIMIT 5
    `)
    alerts.value = alertsData.map(alert => ({
      ...alert,
      type: alert.type === 'contract_expiry' ? 'warning' : 
            alert.type === 'document_expiry' ? 'error' : 'info'
    }))

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Refresh data
const refreshData = () => {
  loadDashboardData()
}

// Navigation handlers
const viewAllActivities = () => {
  // TODO: Navigate to activities page
}

const viewAllAlerts = () => {
  // TODO: Navigate to alerts page
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 12px;
  color: white;
  height: 120px;
  display: flex;
  align-items: center;
}

.stat-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.stat-icon {
  font-size: 48px;
  margin-right: 16px;
  opacity: 0.8;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.charts-row {
  margin-bottom: 20px;
}

.alerts-row {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #1890ff;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.quick-action-btn {
  height: 60px;
  font-size: 14px;
}

.alerts-list {
  max-height: 300px;
  overflow-y: auto;
}

.alert-item {
  margin-bottom: 12px;
}

.alert-item:last-child {
  margin-bottom: 0;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #909399;
}

.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
</style>