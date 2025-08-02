<template>
  <div class="tenants-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Tenants</h1>
        <p class="page-subtitle">Manage tenant information and assignments</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          Add Tenant
        </el-button>
      </div>
    </div>

    <!-- Search and Filters -->
    <el-card class="search-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            placeholder="Search tenants..."
            prefix-icon="Search"
            clearable
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterNationality" placeholder="Nationality" clearable>
            <el-option label="All Nationalities" value="" />
            <el-option label="UAE" value="UAE" />
            <el-option label="India" value="India" />
            <el-option label="Pakistan" value="Pakistan" />
            <el-option label="Philippines" value="Philippines" />
            <el-option label="Other" value="Other" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" placeholder="Status" clearable>
            <el-option label="All Status" value="" />
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
            <el-option label="Expired" value="expired" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button @click="handleSearch">
            <el-icon><Search /></el-icon>
            Search
          </el-button>
          <el-button @click="resetFilters">
            <el-icon><Refresh /></el-icon>
            Reset
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- Tenants Table -->
    <el-card class="table-container">
      <el-table
        :data="filteredTenants"
        v-loading="loading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="Tenant" min-width="200">
          <template #default="{ row }">
            <div class="tenant-info">
              <el-avatar :size="40" :src="row.profile_photo">
                {{ row.full_name?.charAt(0) }}
              </el-avatar>
              <div class="tenant-details">
                <div class="tenant-name">{{ row.full_name }}</div>
                <div class="tenant-email">{{ row.email }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="mobile_number" label="Mobile" width="120" />
        
        <el-table-column prop="nationality" label="Nationality" width="100" />
        
        <el-table-column label="Documents" width="120">
          <template #default="{ row }">
            <div class="document-status">
              <el-tag 
                :type="row.passport_expiry && isExpiringSoon(row.passport_expiry) ? 'danger' : 'success'"
                size="small"
              >
                Passport
              </el-tag>
              <el-tag 
                :type="row.visa_expiry && isExpiringSoon(row.visa_expiry) ? 'danger' : 'success'"
                size="small"
              >
                Visa
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="Current Assignment" width="150">
          <template #default="{ row }">
            <div v-if="row.current_bed" class="current-assignment">
              <div>{{ row.current_bed.room_number }}</div>
              <div class="bed-number">Bed {{ row.current_bed.bed_number }}</div>
            </div>
            <span v-else class="no-assignment">Not Assigned</span>
          </template>
        </el-table-column>
        
        <el-table-column label="Status" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="viewTenant(row)">
                <el-icon><View /></el-icon>
                View
              </el-button>
              <el-button type="info" size="small" @click="editTenant(row)">
                <el-icon><Edit /></el-icon>
                Edit
              </el-button>
              <el-button type="danger" size="small" @click="deleteTenant(row)">
                <el-icon><Delete /></el-icon>
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalTenants"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- Add/Edit Tenant Dialog -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingTenant ? 'Edit Tenant' : 'Add New Tenant'"
      width="800px"
    >
      <el-form
        ref="tenantFormRef"
        :model="tenantForm"
        :rules="tenantRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Full Name" prop="full_name">
              <el-input v-model="tenantForm.full_name" placeholder="Enter full name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Mobile Number" prop="mobile_number">
              <el-input v-model="tenantForm.mobile_number" placeholder="Enter mobile number" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Email">
              <el-input v-model="tenantForm.email" placeholder="Enter email address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Nationality" prop="nationality">
              <el-select v-model="tenantForm.nationality" placeholder="Select nationality">
                <el-option label="UAE" value="UAE" />
                <el-option label="India" value="India" />
                <el-option label="Pakistan" value="Pakistan" />
                <el-option label="Philippines" value="Philippines" />
                <el-option label="Other" value="Other" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Profession">
              <el-input v-model="tenantForm.profession" placeholder="Enter profession" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Employer">
              <el-input v-model="tenantForm.employer" placeholder="Enter employer" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Passport Number">
              <el-input v-model="tenantForm.passport_number" placeholder="Enter passport number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Passport Expiry">
              <el-date-picker
                v-model="tenantForm.passport_expiry"
                type="date"
                placeholder="Select expiry date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Visa Number">
              <el-input v-model="tenantForm.visa_number" placeholder="Enter visa number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Visa Expiry">
              <el-date-picker
                v-model="tenantForm.visa_expiry"
                type="date"
                placeholder="Select expiry date"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Emergency Contact">
              <el-input v-model="tenantForm.emergency_contact" placeholder="Emergency contact name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Emergency Phone">
              <el-input v-model="tenantForm.emergency_phone" placeholder="Emergency phone number" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="Profile Photo">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="tenantForm.profile_photo" :src="tenantForm.profile_photo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="saveTenant" :loading="saving">
          {{ editingTenant ? 'Update' : 'Add' }} Tenant
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()

// Data
const tenants = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterNationality = ref('')
const filterStatus = ref('')
const showAddDialog = ref(false)
const editingTenant = ref(null)
const saving = ref(false)
const selectedTenants = ref([])

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)
const totalTenants = ref(0)

// Form
const tenantFormRef = ref()
const tenantForm = reactive({
  full_name: '',
  mobile_number: '',
  email: '',
  nationality: '',
  profession: '',
  employer: '',
  passport_number: '',
  passport_expiry: '',
  visa_number: '',
  visa_expiry: '',
  emergency_contact: '',
  emergency_phone: '',
  profile_photo: ''
})

const tenantRules = {
  full_name: [
    { required: true, message: 'Full name is required', trigger: 'blur' }
  ],
  mobile_number: [
    { required: true, message: 'Mobile number is required', trigger: 'blur' }
  ],
  nationality: [
    { required: true, message: 'Nationality is required', trigger: 'change' }
  ]
}

// Computed
const filteredTenants = computed(() => {
  let filtered = tenants.value

  if (searchQuery.value) {
    filtered = filtered.filter(tenant =>
      tenant.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tenant.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tenant.mobile_number?.includes(searchQuery.value)
    )
  }

  if (filterNationality.value) {
    filtered = filtered.filter(tenant => tenant.nationality === filterNationality.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(tenant => tenant.status === filterStatus.value)
  }

  return filtered
})

// Methods
const loadTenants = async () => {
  try {
    loading.value = true
    const data = await window.electronAPI.dbAll(`
      SELECT t.*, 
             b.bed_number,
             r.room_number,
             p.name as property_name
      FROM tenants t
      LEFT JOIN bed_assignments ba ON t.id = ba.tenant_id AND ba.status = 'active'
      LEFT JOIN beds b ON ba.bed_id = b.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN properties p ON r.property_id = p.id
      ORDER BY t.created_at DESC
    `)
    
    tenants.value = data.map(tenant => ({
      ...tenant,
      current_bed: tenant.bed_number ? {
        bed_number: tenant.bed_number,
        room_number: tenant.room_number,
        property_name: tenant.property_name
      } : null
    }))
    
    totalTenants.value = tenants.value.length
  } catch (error) {
    console.error('Error loading tenants:', error)
    ElMessage.error('Failed to load tenants')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  searchQuery.value = ''
  filterNationality.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

const handleSelectionChange = (selection) => {
  selectedTenants.value = selection
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const getStatusType = (status) => {
  const types = {
    active: 'success',
    inactive: 'info',
    expired: 'danger'
  }
  return types[status] || 'info'
}

const isExpiringSoon = (date) => {
  if (!date) return false
  const expiryDate = dayjs(date)
  const today = dayjs()
  return expiryDate.diff(today, 'day') <= 30
}

const viewTenant = (tenant) => {
  router.push(`/tenants/${tenant.id}`)
}

const editTenant = (tenant) => {
  editingTenant.value = tenant
  Object.assign(tenantForm, {
    full_name: tenant.full_name,
    mobile_number: tenant.mobile_number,
    email: tenant.email || '',
    nationality: tenant.nationality,
    profession: tenant.profession || '',
    employer: tenant.employer || '',
    passport_number: tenant.passport_number || '',
    passport_expiry: tenant.passport_expiry || '',
    visa_number: tenant.visa_number || '',
    visa_expiry: tenant.visa_expiry || '',
    emergency_contact: tenant.emergency_contact || '',
    emergency_phone: tenant.emergency_phone || '',
    profile_photo: tenant.profile_photo || ''
  })
  showAddDialog.value = true
}

const deleteTenant = async (tenant) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${tenant.full_name}"? This action cannot be undone.`,
      'Delete Tenant',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    await window.electronAPI.dbExec('DELETE FROM tenants WHERE id = ?', [tenant.id])
    ElMessage.success('Tenant deleted successfully')
    loadTenants()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting tenant:', error)
      ElMessage.error('Failed to delete tenant')
    }
  }
}

const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('Avatar picture must be JPG or PNG format!')
  }
  if (!isLt2M) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
  }
  return isJPG && isLt2M
}

const handleAvatarSuccess = (response, file) => {
  tenantForm.profile_photo = URL.createObjectURL(file.raw)
}

const saveTenant = async () => {
  if (!tenantFormRef.value) return

  try {
    await tenantFormRef.value.validate()
    saving.value = true

    const formData = {
      full_name: tenantForm.full_name,
      mobile_number: tenantForm.mobile_number,
      email: tenantForm.email,
      nationality: tenantForm.nationality,
      profession: tenantForm.profession,
      employer: tenantForm.employer,
      passport_number: tenantForm.passport_number,
      passport_expiry: tenantForm.passport_expiry ? dayjs(tenantForm.passport_expiry).format('YYYY-MM-DD') : null,
      visa_number: tenantForm.visa_number,
      visa_expiry: tenantForm.visa_expiry ? dayjs(tenantForm.visa_expiry).format('YYYY-MM-DD') : null,
      emergency_contact: tenantForm.emergency_contact,
      emergency_phone: tenantForm.emergency_phone,
      profile_photo: tenantForm.profile_photo
    }

    if (editingTenant.value) {
      await window.electronAPI.dbExec(`
        UPDATE tenants 
        SET full_name = ?, mobile_number = ?, email = ?, nationality = ?, 
            profession = ?, employer = ?, passport_number = ?, passport_expiry = ?,
            visa_number = ?, visa_expiry = ?, emergency_contact = ?, emergency_phone = ?,
            profile_photo = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        ...Object.values(formData),
        editingTenant.value.id
      ])
      ElMessage.success('Tenant updated successfully')
    } else {
      await window.electronAPI.dbExec(`
        INSERT INTO tenants (full_name, mobile_number, email, nationality, profession, employer,
                           passport_number, passport_expiry, visa_number, visa_expiry,
                           emergency_contact, emergency_phone, profile_photo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, Object.values(formData))
      ElMessage.success('Tenant added successfully')
    }

    showAddDialog.value = false
    resetForm()
    loadTenants()
  } catch (error) {
    console.error('Error saving tenant:', error)
    ElMessage.error('Failed to save tenant')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  editingTenant.value = null
  Object.assign(tenantForm, {
    full_name: '',
    mobile_number: '',
    email: '',
    nationality: '',
    profession: '',
    employer: '',
    passport_number: '',
    passport_expiry: '',
    visa_number: '',
    visa_expiry: '',
    emergency_contact: '',
    emergency_phone: '',
    profile_photo: ''
  })
  if (tenantFormRef.value) {
    tenantFormRef.value.resetFields()
  }
}

onMounted(() => {
  loadTenants()
})
</script>

<style scoped>
.tenants-page {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.tenant-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tenant-details {
  flex: 1;
}

.tenant-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.tenant-email {
  font-size: 12px;
  color: #909399;
}

.document-status {
  display: flex;
  gap: 4px;
  flex-direction: column;
}

.current-assignment {
  text-align: center;
}

.bed-number {
  font-size: 12px;
  color: #909399;
}

.no-assignment {
  color: #909399;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>