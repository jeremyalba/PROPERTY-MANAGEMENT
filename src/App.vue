<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

onMounted(async () => {
  // Check for stored authentication
  await authStore.checkAuth()
  
  // Start notification polling
  notificationStore.startPolling()
})
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.el-main {
  padding: 0 !important;
}

.el-aside {
  background-color: #304156;
}

.el-menu {
  border-right: none;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
}

.el-menu-item:hover {
  background-color: #263445 !important;
}

.dashboard-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.stat-card.success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-card.warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card.info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.table-container {
  margin: 20px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.page-header {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #909399;
  font-size: 14px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
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

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #409eff;
}

.upload-area.dragover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-top: 8px;
}

.file-preview img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f56c6c;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.available {
  background: #f0f9ff;
  color: #0369a1;
}

.status-badge.occupied {
  background: #fef2f2;
  color: #dc2626;
}

.status-badge.reserved {
  background: #fffbeb;
  color: #d97706;
}

.status-badge.maintenance {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.active {
  background: #f0fdf4;
  color: #16a34a;
}

.status-badge.expired {
  background: #fef2f2;
  color: #dc2626;
}

.status-badge.paid {
  background: #f0fdf4;
  color: #16a34a;
}

.status-badge.pending {
  background: #fffbeb;
  color: #d97706;
}

.status-badge.overdue {
  background: #fef2f2;
  color: #dc2626;
}
</style>