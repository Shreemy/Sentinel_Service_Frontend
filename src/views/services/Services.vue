<template>
    <div class="container my-4">
      <!-- Unified Alert Handling -->
      <div
        v-if="alertMessage"
        :class="['alert', alertTypeClass, 'd-flex', 'justify-content-between', 'align-items-center']"
        role="alert"
      >
        <span>{{ alertMessage }}</span>
        <button type="button" class="btn-close" @click="clearAlert" aria-label="Close"></button>
      </div>
  
      <!-- Search Form -->
      <div class="search-container p-3 rounded bg-dark text-light">
        <form @submit.prevent="search" class="mb-3">
          <div class="row g-3 align-items-end">
            <!-- Name -->
            <div class="col-md-4 position-relative">
              <label for="name" class="form-label">Service Name</label>
              <div class="input-wrapper">
                <input
                  v-model="filters.name"
                  type="text"
                  id="name"
                  class="form-control pe-5"
                  placeholder="Search by name"
                />
                <button
                  type="button"
                  class="btn-close-field"
                  @click="clearField('name')"
                  aria-label="Clear"
                ></button>
              </div>
            </div>
  
            <!-- Address -->
            <div class="col-md-4 position-relative">
              <label for="address" class="form-label">Address</label>
              <div class="input-wrapper">
                <input
                  v-model="filters.address"
                  type="text"
                  id="address"
                  class="form-control pe-5"
                  placeholder="Search by address"
                />
                <button
                  type="button"
                  class="btn-close-field"
                  @click="clearField('address')"
                  aria-label="Clear"
                ></button>
              </div>
            </div>
  
            <!-- Actual State -->
            <div class="col-md-4 position-relative">
              <label for="actual_state" class="form-label">Actual State</label>
              <select
                v-model="filters.actual_state"
                id="actual_state"
                class="form-select"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
  
            <!-- Status -->
            <div class="col-md-4">
              <label for="status" class="form-label">Status</label>
              <select
                v-model="filters.status"
                id="status"
                class="form-select"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
  
            <!-- Buttons -->
            <div class="col-md-8 d-flex justify-content-end">
                <button type="button" class="btn btn-success col-md-3 me-3" @click="newService">
                    <i class="bi bi-database-add me-1"></i>Add service</button>
                <button type="submit" class="btn btn-primary col-md-3 me-3">
                    <i class="bi bi-search me-1"></i>Search</button>
                <button type="button" class="btn btn-secondary col-md-3" @click="resetFilters">
                    <i class="bi bi-arrow-counterclockwise me-1"></i>Reset</button>
            </div>
          </div>
        </form>
      </div>
  
      <!-- Service Table -->
      <div class="table-container p-3 rounded bg-dark text-light mt-3">
        <table class="table table-hover table-dark table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Address</th>
              <th>Actual State</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(service, index) in services" :key="service.setting.guid">
              <td>{{ index + 1 }}</td>
              <td>{{ service.name }}</td>
              <td>{{ service.setting.address }}</td>
              <td>
                <button type="button" class="btn btn-success btn-sm" v-if="service.actual_state === 'available'">Available</button>
                <button type="button" class="btn btn-danger btn-sm" v-else-if="service.actual_state === 'unavailable'">Unavailable</button>
                <button type="button" class="btn btn-sm btn-secondary" v-else>N/A</button>
              </td>
              <td>{{ service.setting.status }}</td>
              <td>
                <button type="button" class="btn btn-success btn-sm me-2" 
                @click="lookInto(service.guid)">
                    <i class="bi bi-search"></i>
                </button>
                <button
                  class="btn btn-warning btn-sm me-2"
                  @click="modifyService(service.guid)"
                >
                  <i class="bi bi-tools"></i>
                </button>
                <button
                  class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal"
                  @click="openDeleteModal(service.guid)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-light">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmDeleteModalLabel">Confirm Delete</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">Are you sure you want to delete this service?</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="confirmDelete">Confirm</button>
          </div>
        </div>
      </div>
    </div>

    </div>
  </template>
  

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const apiBaseUrl = import.meta.env.VITE_API_URL;
const router = useRouter();

// Services List
const services = ref([]);

// Filters for Search
const filters = ref({
  name: '',
  address: '',
  actual_state: '',
  status: '',
});

const serviceToDelete = ref(null);

// Alert Handling
const alertMessage = ref('');
const alertType = ref('');
const alertTypeClass = computed(() => {
  switch (alertType.value) {
    case 'success':
      return 'alert-success';
    case 'danger':
      return 'alert-danger';
    default:
      return 'alert-info';
  }
});

function newService() {
  router.push('/newService');
}

// Reset Filters
function resetFilters() {
  filters.value = {
    name: '',
    address: '',
    actual_state: '',
    status: '',
  };
  search();
}

// Search Services
async function search() {
  try {
    const queryParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters.value).filter(([_, v]) => v !== '')
      )
    );

    const response = await fetch(`${apiBaseUrl}/searchService?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      setAlert(errorData.message || 'Failed to fetch services', 'danger');
      services.value = []; // Clear the table on error
      throw new Error(errorData.message);
    }

    services.value = await response.json();
    clearAlert(); // Clear alert on success
  } catch (error) {
    services.value = [];
    console.error('Error fetching services:', error.message);
  }
}

// Clear Specific Field
function clearField(field) {
  filters.value[field] = '';
}

// Alert Functions
function setAlert(message, type) {
  alertMessage.value = message;
  alertType.value = type;
  closeModal();
}

function clearAlert() {
  alertMessage.value = '';
  alertType.value = '';
}

// Modify Service
function modifyService(guid) {
  router.push(`/service/${guid}`);
}

function lookInto(guid) {
  router.push(`/serviceDetails/${guid}`);
}

function openDeleteModal(guid) {
  serviceToDelete.value = guid;
}
// Delete Service
async function confirmDelete() {
    if (!serviceToDelete.value) return;
  try {
    const response = await fetch(`${apiBaseUrl}/service?id=${serviceToDelete.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData.message);
      // setAlert(errorData.message || 'Failed to delete service', 'danger');
      alert(errorData.message || 'Failed to delete service');
      throw new Error(errorData.message);
    }
    services.value = [];
    // setAlert('Service deleted successfully', 'success');
    alert('Service deleted successfully');
  } catch (error) {
    console.error('Error deleting service:', error.message);
  }
  await search();
}

// Close Modal Programmatically
function closeModal() {
  const modal = document.getElementById('confirmDeleteModal');
  if (modal) {
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal.hide();
  }
}

// Fetch Services on Component Mount
onMounted(search);
</script>


<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-container {
  color: white;
}

label {
  font-weight: bold;
}

.alert {
  margin-top: 20px;
}

.modal-content.bg-dark {
  background-color: #343a40;
}

.position-relative {
  position: relative;
}

.input-wrapper {
  position: relative;
}

.btn-close-field {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
}

.btn-close-field::after {
  content: '✕';
  font-size: 14px;
  color: gray;
}
</style>