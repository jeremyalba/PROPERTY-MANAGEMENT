<template>
  <div class="users-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Users</h1>
        <p class="page-subtitle">Manage system users and permissions</p>
      </div>
      <div class="header-actions">
        <el-button type="primary">
          <el-icon><Plus /></el-icon>
          Add User
        </el-button>
      </div>
    </div>

    <el-card>
      <div class="empty-state">
        <el-icon><UserFilled /></el-icon>
        <h3>User Management</h3>
        <p>This feature will allow you to manage system users and their permissions.</p>
        <p>Features include:</p>
        <ul>
          <li>Create and manage user accounts</li>
          <li>Set role-based permissions</li>
          <li>Track user activity</li>
          <li>Manage access controls</li>
          <li>Audit user actions</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// User management functionality will be implemented here
</script>

<style scoped>
.users-page {
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