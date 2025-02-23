<template>
  <div class="container my-4">
    <!-- Unified Alert Handling -->
    <div
      v-if="alertMessage"
      :class="['alert', alertTypeClass, 'd-flex', 'justify-content-between', 'align-items-center']" role="alert">
      <span>{{ alertMessage }}</span>
      <button type="button" class="btn-close" @click="clearAlert" aria-label="Close"></button>
    </div>

    <!-- Search Form -->
    <div class="search-container p-3 rounded bg-dark text-light">
      <form @submit.prevent="search" class="mb-3">
        <div class="row g-3 align-items-end">
          <!-- Login -->
          <div class="col-md-4 position-relative">
            <label for="login" class="form-label">Login</label>
            <div class="input-wrapper">
              <input v-model="filters.login" type="text" id="login" class="form-control pe-5" placeholder="Search by login"/>
              <button type="button" class="btn-close-field" @click="clearField('login')" aria-label="Clear"></button>
            </div>
          </div>

          <!-- Email -->
          <div class="col-md-4 position-relative">
            <label for="email" class="form-label">Email</label>
            <div class="input-wrapper">
              <input v-model="filters.email" type="text" id="email" class="form-control pe-5" placeholder="Search by email"/>
              <button type="button" class="btn-close-field" @click="clearField('email')" aria-label="Clear"></button>
            </div>
          </div>

          <!-- Phone Number -->
          <div class="col-md-4 position-relative">
            <label for="phone_number" class="form-label">Phone Number</label>
            <div class="input-wrapper">
              <input v-model="filters.phone_number" type="text" id="phone_number" class="form-control pe-5" placeholder="Search by phone number"/>
              <button type="button" class="btn-close-field" @click="clearField('phone_number')" aria-label="Clear"></button>
            </div>
          </div>

          <!-- Account Type -->
          <div class="col-md-2">
            <label for="account_type" class="form-label">Type</label>
            <select v-model="filters.account_type" id="account_type" class="form-select">
              <option value="">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <!-- Status -->
          <div class="col-md-2">
            <label for="is_active" class="form-label">Status</label>
            <select v-model="filters.is_active" id="is_active" class="form-select">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="col-md-8 d-flex justify-content-end">
            <button type="button" class="btn btn-success col-md-3 me-3" @click="newUser"><i class="bi bi-person-add me-1"></i>Add user</button>
            <button type="submit" class="btn btn-primary col-md-3 me-3"><i class="bi bi-search me-1"></i>Search</button>
            <button type="button" class="btn btn-secondary col-md-3" @click="resetFilters">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Reset</button>
          </div>
        </div>
      </form>
    </div>

    <!-- User Table -->
    <div class="table-container p-3 rounded bg-dark text-light mt-3">
      <table class="table table-hover table-dark table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Login</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Account Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.guid">
            <td>{{ index + 1 }}</td>
            <td>{{ user.login }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone_number || 'N/A' }}</td>
            <td>{{ user.account_type }}</td>
            <td>{{ user.is_active }}</td>
            <td>
              <!-- Action Buttons -->
              <button class="btn btn-warning btn-sm me-2" data-bs-toggle="modal" data-bs-target="#modifyUserModal"
              @click="modifyUser(user.guid)"><i class="bi bi-tools"></i></button>
              <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal"
              @click="openDeleteModal(user.guid)"><i class="bi bi-trash"></i></button>
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
          <div class="modal-body">Are you sure you want to delete this user?</div>
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
import { Alert } from 'bootstrap/dist/js/bootstrap.bundle';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

// Users List
const users = ref([]);

const apiBaseUrl = import.meta.env.VITE_API_URL;

// Alert Variables
const alertMessage = ref('');
const alertType = ref(''); // Types: 'success', 'danger'

// Currently Selected User for Deletion
const userToDelete = ref(null);
const url = ref('');

// Dynamic Alert Class
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
  
// Set Alert
function setAlert(message, type) {
  alertMessage.value = message;
  alertType.value = type;
  closeModal();
}

// Clear Alert
function clearAlert() {
  alertMessage.value = '';
  alertType.value = '';
}

// Filters for Search
const filters = ref({
  login: '',
  email: '',
  phone_number: '',
  account_type: '',
  is_active: '',
});

// Reset Filters
function resetFilters() {
  filters.value = {
    login: '',
    email: '',
    phone_number: '',
    account_type: '',
    is_active: '',
  };
  search();
}

// Search Users
async function search() {
  try {
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(filters.value).filter(([_, v]) => v !== ''))
    );
    
    const response = await fetch(`${apiBaseUrl}/searchUser?${queryParams}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      setAlert(errorData.message || 'Failed to fetch users', 'danger');
      users.value = []; // Clear the table on error
      throw new Error(errorData.message);
    }
    
    users.value = await response.json();
    clearAlert(); // Clear alert on success
  } catch (error) {
    users.value = []; // Clear table on error
    console.error('Error fetching users:', error.message);
  }
}

// Clear Specific Field
function clearField(field) {
  filters.value[field] = '';
}

// Open Delete Modal
function openDeleteModal(guid) {
  userToDelete.value = guid;
}

// Confirm Delete
async function confirmDelete() {
  if (!userToDelete.value) return;

  try {
    const response = await fetch(`${apiBaseUrl}/user?id=${userToDelete.value}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      // setAlert(errorData.message || 'Failed to delete user', 'danger');
      alert(errorData.message || 'Failed to delete user')
      throw new Error(errorData.message);
    }

    // setAlert('User deleted successfully', 'success');
    alert('User deleted successfully');
    userToDelete.value = null; // Reset selected user
  } catch (error) {
    console.error('Error deleting user:', error.message);
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

// Modify User
function modifyUser(guid) {
  router.push('/profile/' + guid);
}

// New User
function newUser() {
  router.push('/newUser');
}

// Fetch Users on Component Mount
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
