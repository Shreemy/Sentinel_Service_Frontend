<template>
    <div class="container my-4">
      <!-- Formularz wyszukiwania -->
      <div class="search-container p-3 rounded bg-dark text-light" data-bs-theme="text-bg-secondary">
        <form @submit.prevent="search" class="mb-3">
          <div class="row g-3 align-items-end">
            <!-- Login -->
            <div class="col-md-4">
              <label for="login" class="form-label">Login</label>
              <input
                v-model="filters.login"
                type="text"
                id="login"
                class="form-control"
                placeholder="Search by login"
              />
            </div>
  
            <!-- Email -->
            <div class="col-md-4">
              <label for="email" class="form-label">Email</label>
              <input
                v-model="filters.email"
                type="text"
                id="email"
                class="form-control"
                placeholder="Search by email"
              />
            </div>
  
            <!-- Phone Number -->
            <div class="col-md-4">
              <label for="phone_number" class="form-label">Phone Number</label>
              <input
                v-model="filters.phone_number"
                type="text"
                id="phone_number"
                class="form-control"
                placeholder="Search by phone number"
              />
            </div>
  
            <!-- Account Type -->
            <div class="col-md-4">
              <label for="account_type" class="form-label">Account Type</label>
              <select v-model="filters.account_type" id="account_type" class="form-select">
                <option value="">All</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
  
            <!-- Status -->
            <div class="col-md-4">
              <label for="is_active" class="form-label">Status</label>
              <select v-model="filters.is_active" id="is_active" class="form-select">
                <option value="">All</option>
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>
  
            <!-- Buttons -->
            <div class="col-md-4 d-flex justify-content-end">
              <button type="submit" class="btn btn-primary me-2">Search</button>
              <button type="button" class="btn btn-secondary" @click="resetFilters">Reset</button>
            </div>
          </div>
        </form>
      </div>
  
      <!-- Tabela użytkowników -->
      <div class="table-container p-3 rounded bg-dark text-light mt-3">
        <table class="table table-hover text-light">
          <thead>
            <tr>
              <th>#</th>
              <th>Login</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Account Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in users"
              :key="user.guid"
              @click="selectUser(user)"
              style="cursor: pointer;"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ user.login }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone_number }}</td>
              <td>{{ user.account_type }}</td>
              <td>{{ user.is_active }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Szczegóły użytkownika -->
      <UserDetail v-if="selectedUser" :user="selectedUser" @close="selectedUser = null" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import UserDetail from '../components/UserDetail.vue';
  
  // Lista użytkowników
  const users = ref([]);
  
  // Zmienna do przechowywania wybranego użytkownika
  const selectedUser = ref(null);
  
  // Filtry do wyszukiwania
  const filters = ref({
    login: '',
    email: '',
    phone_number: '',
    account_type: '',
    is_active: '',
  });
  
  // Funkcja wyszukiwania
  async function search() {
    try {
      // Budowanie URL z parametrami wyszukiwania
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters.value).filter(([_, v]) => v !== '')
        )
      );
  
      const response = await fetch(`https://your-backend.com/api/v1/searchUser?${queryParams}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
  
      users.value = await response.json();
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  }
  
  // Funkcja resetowania filtrów
  function resetFilters() {
    filters.value = {
      login: '',
      email: '',
      phone_number: '',
      account_type: '',
      is_active: '',
    };
    search(); // Odśwież listę użytkowników bez filtrów
  }
  
  // Wybranie użytkownika z tabeli
  function selectUser(user) {
    selectedUser.value = user; // Przechowuje szczegóły wybranego użytkownika
  }
  
  // Pobranie danych użytkowników po załadowaniu komponentu
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
  </style>
  