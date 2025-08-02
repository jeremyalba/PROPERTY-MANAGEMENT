<template>
  <div class="room-beds-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Room Beds</h1>
        <p class="page-subtitle">Manage beds in this room</p>
      </div>
      <div class="header-actions">
        <el-button type="primary">
          <el-icon><Plus /></el-icon>
          Add Bed
        </el-button>
      </div>
    </div>

    <el-card>
      <div class="empty-state">
        <el-icon><Bed /></el-icon>
        <h3>Bed Management</h3>
        <p>This feature will allow you to manage beds within rooms.</p>
        <p>Features include:</p>
        <ul>
          <li>Add and configure beds</li>
          <li>Set bed types and status</li>
          <li>Assign tenants to beds</li>
          <li>Track bed occupancy</li>
          <li>Manage bed assignments</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// Bed management functionality will be implemented here
</script>

<style scoped>
.room-beds-page {
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