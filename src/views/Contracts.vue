<template>
  <div class="contracts-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Contracts</h1>
        <p class="page-subtitle">Manage rental contracts and agreements</p>
      </div>
      <div class="header-actions">
        <el-button type="primary">
          <el-icon><Plus /></el-icon>
          Create Contract
        </el-button>
      </div>
    </div>

    <el-card>
      <div class="empty-state">
        <el-icon><Document /></el-icon>
        <h3>Contracts Management</h3>
        <p>This feature will allow you to create and manage rental contracts with tenants.</p>
        <p>Features include:</p>
        <ul>
          <li>Create contracts with start/end dates</li>
          <li>Set rent amounts and payment schedules</li>
          <li>Upload signed agreements</li>
          <li>Track contract status and renewals</li>
          <li>Generate automatic reminders</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// Contract management functionality will be implemented here
</script>

<style scoped>
.contracts-page {
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