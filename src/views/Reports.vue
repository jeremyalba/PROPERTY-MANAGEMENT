<template>
  <div class="reports-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Reports</h1>
        <p class="page-subtitle">Generate and view detailed reports</p>
      </div>
      <div class="header-actions">
        <el-button type="primary">
          <el-icon><Download /></el-icon>
          Export Report
        </el-button>
      </div>
    </div>

    <el-card>
      <div class="empty-state">
        <el-icon><DataAnalysis /></el-icon>
        <h3>Reports & Analytics</h3>
        <p>This feature will provide comprehensive reporting and analytics.</p>
        <p>Available reports:</p>
        <ul>
          <li>Rent collection reports</li>
          <li>Occupancy reports</li>
          <li>Tenant history reports</li>
          <li>Payment history reports</li>
          <li>Financial summaries</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// Reports functionality will be implemented here
</script>

<style scoped>
.reports-page {
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