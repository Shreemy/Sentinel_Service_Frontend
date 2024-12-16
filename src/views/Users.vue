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
          <!-- Login -->
          <div class="col-md-4 position-relative">
            <label for="login" class="form-label">Login</label>
            <div class="input-wrapper">
              <input
                v-model="filters.login"
                type="text"
                id="login"
                class="form-control pe-5"
                placeholder="Search by login"
              />
              <button type="button" class="btn-close-field" @click="clearField('login')" aria-label="Clear"></button>
            </div>
          </div>

          <!-- Email -->
          <div class="col-md-4 position-relative">
            <label for="email" class="form-label">Email</label>
            <div class="input-wrapper">
              <input
                v-model="filters.email"
                type="text"
                id="email"
                class="form-control pe-5"
                placeholder="Search by email"
              />
              <button type="button" class="btn-close-field" @click="clearField('email')" aria-label="Clear"></button>
            </div>
          </div>

          <!-- Phone Number -->
          <div class="col-md-4 position-relative">
            <label for="phone_number" class="form-label">Phone Number</label>
            <div class="input-wrapper">
              <input
                v-model="filters.phone_number"
                type="text"
                id="phone_number"
                class="form-control pe-5"
                placeholder="Search by phone number"
              />
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
            <button type="button" class="btn btn-success col-md-3 me-3">
              <i class="bi bi-person-add me-1"></i>Add user</button>
            <button type="submit" class="btn btn-primary col-md-3 me-3">
              <i class="bi bi-search me-1"></i>Search</button>
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
            <td>{{ user.phone_number }}</td>
            <td>{{ user.account_type }}</td>
            <td>{{ user.is_active }}</td>
            <td>
              <!-- Action Buttons -->
              <button class="btn btn-warning btn-sm me-2" @click="selectUser(user)">
                <i class="bi bi-tools"></i>
              </button>
              <button class="btn btn-danger btn-sm" @click="deleteUser(user.guid)">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Users List
const users = ref([]);

// Alert Variables
const alertMessage = ref('');
const alertType = ref(''); // Types: 'success', 'danger', etc.

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

// Filters for Search
const filters = ref({
  login: '',
  email: '',
  phone_number: '',
  account_type: '',
  is_active: '',
});

// Search Users
async function search() {
  try {
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(filters.value).filter(([_, v]) => v !== ''))
    );

    const response = await fetch(`http://10.21.37.56:5000/api/v1/searchUser?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
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

// Delete User
async function deleteUser(guid) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const response = await fetch(`http://10.21.37.56:5000/api/v1/user?id=${guid}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorData = await response.json();
      setAlert(errorData.message || 'Failed to delete user', 'danger');
      throw new Error(errorData.message);
    }

    setAlert('User deleted successfully', 'success');
    search(); // Refresh user list after deletion
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }
}

// Clear Specific Field
function clearField(field) {
  filters.value[field] = '';
}

// Set Alert
function setAlert(message, type) {
  alertMessage.value = message;
  alertType.value = type;
}

// Clear Alert
function clearAlert() {
  alertMessage.value = '';
  alertType.value = '';
}

// Select User
function selectUser(user) {
  setAlert(`Selected user: ${user.guid}`, 'info');
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
