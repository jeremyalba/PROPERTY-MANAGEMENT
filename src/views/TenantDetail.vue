<template>
  <div class="tenant-detail-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Tenant Details</h1>
        <p class="page-subtitle">View and manage tenant information</p>
      </div>
      <div class="header-actions">
        <el-button type="primary">
          <el-icon><Edit /></el-icon>
          Edit Tenant
        </el-button>
      </div>
    </div>

    <el-card>
      <div class="empty-state">
        <el-icon><User /></el-icon>
        <h3>Tenant Details</h3>
        <p>This feature will show detailed tenant information.</p>
        <p>Features include:</p>
        <ul>
          <li>View tenant profile and details</li>
          <li>Check document expiry dates</li>
          <li>View current assignments</li>
          <li>Track payment history</li>
          <li>Manage tenant contracts</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// Tenant detail functionality will be implemented here
</script>

<style scoped>
.tenant-detail-page {
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