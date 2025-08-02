<template>
  <div class="properties-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Properties</h1>
        <p class="page-subtitle">Manage your properties and buildings</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          Add Property
        </el-button>
      </div>
    </div>

    <!-- Search and Filters -->
    <el-card class="search-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="searchQuery"
            placeholder="Search properties..."
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterType" placeholder="Property Type" clearable @change="handleSearch">
            <el-option label="All Types" value="" />
            <el-option label="Building" value="building" />
            <el-option label="Villa" value="villa" />
            <el-option label="Apartment" value="apartment" />
            <el-option label="Studio" value="studio" />
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

    <!-- Properties Grid -->
    <div class="properties-grid">
      <el-row :gutter="20">
        <el-col 
          v-for="property in filteredProperties" 
          :key="property.id" 
          :span="8"
          class="property-col"
        >
          <el-card class="property-card" shadow="hover">
            <div class="property-image">
              <img :src="property.image || '/placeholder-property.jpg'" :alt="property.name" />
              <div class="property-status">
                <el-tag :type="getStatusType(property.status)">
                  {{ property.status }}
                </el-tag>
              </div>
            </div>
            
            <div class="property-content">
              <h3 class="property-name">{{ property.name }}</h3>
              <p class="property-address">{{ property.address }}</p>
              <p class="property-type">{{ property.property_type }}</p>
              
              <div class="property-stats">
                <div class="stat">
                  <span class="stat-label">Rooms:</span>
                  <span class="stat-value">{{ property.total_rooms }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Beds:</span>
                  <span class="stat-value">{{ property.total_beds }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Occupancy:</span>
                  <span class="stat-value">{{ getOccupancyRate(property) }}%</span>
                </div>
              </div>
              
              <div class="property-actions">
                <el-button type="primary" size="small" @click="viewRooms(property)">
                  <el-icon><House /></el-icon>
                  View Rooms
                </el-button>
                <el-button type="info" size="small" @click="editProperty(property)">
                  <el-icon><Edit /></el-icon>
                  Edit
                </el-button>
                <el-button type="danger" size="small" @click="deleteProperty(property)">
                  <el-icon><Delete /></el-icon>
                  Delete
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProperties.length === 0" class="empty-state">
      <el-icon><House /></el-icon>
      <h3>No properties found</h3>
      <p>Add your first property to get started</p>
      <el-button type="primary" @click="showAddDialog = true">
        Add Property
      </el-button>
    </div>

    <!-- Add/Edit Property Dialog -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingProperty ? 'Edit Property' : 'Add New Property'"
      width="600px"
    >
      <el-form
        ref="propertyFormRef"
        :model="propertyForm"
        :rules="propertyRules"
        label-width="120px"
      >
        <el-form-item label="Property Name" prop="name">
          <el-input v-model="propertyForm.name" placeholder="Enter property name" />
        </el-form-item>
        
        <el-form-item label="Address" prop="address">
          <el-input v-model="propertyForm.address" placeholder="Enter property address" />
        </el-form-item>
        
        <el-form-item label="Property Type" prop="property_type">
          <el-select v-model="propertyForm.property_type" placeholder="Select property type">
            <el-option label="Building" value="building" />
            <el-option label="Villa" value="villa" />
            <el-option label="Apartment" value="apartment" />
            <el-option label="Studio" value="studio" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="Description">
          <el-input
            v-model="propertyForm.description"
            type="textarea"
            :rows="3"
            placeholder="Enter property description"
          />
        </el-form-item>
        
        <el-form-item label="Location Coordinates">
          <el-input v-model="propertyForm.location_coordinates" placeholder="Latitude, Longitude" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">Cancel</el-button>
        <el-button type="primary" @click="saveProperty" :loading="saving">
          {{ editingProperty ? 'Update' : 'Add' }} Property
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// Data
const properties = ref([])
const searchQuery = ref('')
const filterType = ref('')
const showAddDialog = ref(false)
const editingProperty = ref(null)
const saving = ref(false)

// Form
const propertyFormRef = ref()
const propertyForm = reactive({
  name: '',
  address: '',
  property_type: '',
  description: '',
  location_coordinates: ''
})

const propertyRules = {
  name: [
    { required: true, message: 'Property name is required', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'Property address is required', trigger: 'blur' }
  ],
  property_type: [
    { required: true, message: 'Property type is required', trigger: 'change' }
  ]
}

// Computed
const filteredProperties = computed(() => {
  let filtered = properties.value

  if (searchQuery.value) {
    filtered = filtered.filter(property =>
      property.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (filterType.value) {
    filtered = filtered.filter(property => property.property_type === filterType.value)
  }

  return filtered
})

// Methods
const loadProperties = async () => {
  try {
    const data = await window.electronAPI.dbAll(`
      SELECT p.*, 
             COUNT(DISTINCT r.id) as total_rooms,
             COUNT(DISTINCT b.id) as total_beds,
             COUNT(DISTINCT CASE WHEN b.status = 'occupied' THEN b.id END) as occupied_beds
      FROM properties p
      LEFT JOIN rooms r ON p.id = r.property_id
      LEFT JOIN beds b ON r.id = b.room_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `)
    properties.value = data
  } catch (error) {
    console.error('Error loading properties:', error)
    ElMessage.error('Failed to load properties')
  }
}

const handleSearch = () => {
  // Search is handled by computed property
}

const resetFilters = () => {
  searchQuery.value = ''
  filterType.value = ''
}

const getStatusType = (status) => {
  const types = {
    active: 'success',
    inactive: 'info',
    maintenance: 'warning'
  }
  return types[status] || 'info'
}

const getOccupancyRate = (property) => {
  if (!property.total_beds) return 0
  return Math.round((property.occupied_beds / property.total_beds) * 100)
}

const viewRooms = (property) => {
  router.push(`/properties/${property.id}/rooms`)
}

const editProperty = (property) => {
  editingProperty.value = property
  Object.assign(propertyForm, {
    name: property.name,
    address: property.address,
    property_type: property.property_type,
    description: property.description || '',
    location_coordinates: property.location_coordinates || ''
  })
  showAddDialog.value = true
}

const deleteProperty = async (property) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${property.name}"? This action cannot be undone.`,
      'Delete Property',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    await window.electronAPI.dbExec('DELETE FROM properties WHERE id = ?', [property.id])
    ElMessage.success('Property deleted successfully')
    loadProperties()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting property:', error)
      ElMessage.error('Failed to delete property')
    }
  }
}

const saveProperty = async () => {
  if (!propertyFormRef.value) return

  try {
    await propertyFormRef.value.validate()
    saving.value = true

    if (editingProperty.value) {
      await window.electronAPI.dbExec(`
        UPDATE properties 
        SET name = ?, address = ?, property_type = ?, description = ?, location_coordinates = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        propertyForm.name,
        propertyForm.address,
        propertyForm.property_type,
        propertyForm.description,
        propertyForm.location_coordinates,
        editingProperty.value.id
      ])
      ElMessage.success('Property updated successfully')
    } else {
      await window.electronAPI.dbExec(`
        INSERT INTO properties (name, address, property_type, description, location_coordinates)
        VALUES (?, ?, ?, ?, ?)
      `, [
        propertyForm.name,
        propertyForm.address,
        propertyForm.property_type,
        propertyForm.description,
        propertyForm.location_coordinates
      ])
      ElMessage.success('Property added successfully')
    }

    showAddDialog.value = false
    resetForm()
    loadProperties()
  } catch (error) {
    console.error('Error saving property:', error)
    ElMessage.error('Failed to save property')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  editingProperty.value = null
  Object.assign(propertyForm, {
    name: '',
    address: '',
    property_type: '',
    description: '',
    location_coordinates: ''
  })
  if (propertyFormRef.value) {
    propertyFormRef.value.resetFields()
  }
}

onMounted(() => {
  loadProperties()
})
</script>

<style scoped>
.properties-page {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.properties-grid {
  margin-bottom: 20px;
}

.property-col {
  margin-bottom: 20px;
}

.property-card {
  height: 100%;
  transition: transform 0.2s;
}

.property-card:hover {
  transform: translateY(-2px);
}

.property-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 16px;
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-status {
  position: absolute;
  top: 12px;
  right: 12px;
}

.property-content {
  padding: 0 8px;
}

.property-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.property-address {
  color: #606266;
  margin-bottom: 8px;
  font-size: 14px;
}

.property-type {
  color: #909399;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.property-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.property-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
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
  margin-bottom: 8px;
  color: #606266;
}

.empty-state p {
  margin-bottom: 20px;
}
</style>