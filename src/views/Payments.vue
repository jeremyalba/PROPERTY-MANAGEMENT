<template>
  <div class="payments-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Payments</h1>
        <p class="page-subtitle">Track rent payments and financial transactions</p>
      </div>
      <div class="header-actions">
        <el-button type="primary">
          <el-icon><Plus /></el-icon>
          Record Payment
        </el-button>
      </div>
    </div>

    <el-card>
      <div class="empty-state">
        <el-icon><Money /></el-icon>
        <h3>Payment Management</h3>
        <p>This feature will allow you to track all financial transactions.</p>
        <p>Features include:</p>
        <ul>
          <li>Record rent payments and receipts</li>
          <li>Track security deposits</li>
          <li>Manage fines and additional charges</li>
          <li>Generate payment reports</li>
          <li>Send payment reminders</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// Payment management functionality will be implemented here
</script>

<style scoped>
.payments-page {
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