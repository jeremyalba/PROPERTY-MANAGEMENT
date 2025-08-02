<template>
  <div class="property-rooms-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Property Rooms</h1>
        <p class="page-subtitle">Manage rooms for this property</p>
      </div>
      <div class="header-actions">
        <el-button type="primary">
          <el-icon><Plus /></el-icon>
          Add Room
        </el-button>
      </div>
    </div>

    <el-card>
      <div class="empty-state">
        <el-icon><House /></el-icon>
        <h3>Room Management</h3>
        <p>This feature will allow you to manage rooms within properties.</p>
        <p>Features include:</p>
        <ul>
          <li>Add and configure rooms</li>
          <li>Set room types and occupancy limits</li>
          <li>Manage bed assignments</li>
          <li>Track room status</li>
          <li>View room details and history</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// Room management functionality will be implemented here
</script>

<style scoped>
.property-rooms-page {
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