<template>
  <div class="maintenance-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Maintenance</h1>
        <p class="page-subtitle">Track maintenance requests and repairs</p>
      </div>
      <div class="header-actions">
        <el-button type="primary">
          <el-icon><Plus /></el-icon>
          New Request
        </el-button>
      </div>
    </div>

    <el-card>
      <div class="empty-state">
        <el-icon><Tools /></el-icon>
        <h3>Maintenance Management</h3>
        <p>This feature will allow you to track maintenance requests and repairs.</p>
        <p>Features include:</p>
        <ul>
          <li>Submit maintenance requests</li>
          <li>Track request status and progress</li>
          <li>Assign tasks to maintenance team</li>
          <li>Monitor completion times</li>
          <li>Generate maintenance reports</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// Maintenance management functionality will be implemented here
</script>

<style scoped>
.maintenance-page {
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state .el-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-state h3 {
  margin-bottom: 16px;
  color: #606266;
}

.empty-state ul {
  text-align: left;
  max-width: 400px;
  margin: 20px auto;
}
</style>