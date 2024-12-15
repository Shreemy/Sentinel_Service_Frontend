<template>
    <div class="d-flex justify-content-center  vh-100 vw-100">
      <table class="table table-dark table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Login</th>
            <th>Account Type</th>
            <th>Is Active</th>
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
            <td>{{ user.account_type }}</td>
            <td>{{ user.is_active }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Wyświetl szczegóły użytkownika, jeśli wybrany -->
      <!-- <UserDetail v-if="selectedUser" :user="selectedUser" @close="selectedUser = null" /> -->
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  // Zaimportuj komponent UserDetail
  import UserDetail from '../components/UserDetail.vue';
  
  const users = ref([]); // Lista użytkowników
  const selectedUser = ref(null); // Wybrany użytkownik (szczegóły)
  
  async function fetchUsers() {
  try {
    const apiUrl = import.meta.env.VITE_API_URL; // Pobierz URL API z .env

    const response = await fetch(`${apiUrl}/users`, {
    // const response = await fetch('http://10.21.37.56:5000/api/v1/users', {
      method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        // mode: 'no-cors', // Ustaw tryb CORS
        headers: {
        'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    users.value = await response.json();
  } catch (error) {
    console.error('Error fetching users:', error.message);
  }
}

  
  // Otwórz szczegóły użytkownika po kliknięciu w wiersz
  function selectUser(user) {
    selectedUser.value = user; // Ustaw dane wybranego użytkownika
  }
  
  // Pobierz dane użytkowników po załadowaniu komponentu
  onMounted(fetchUsers);
  </script>
  
  <style scoped>
  table {
    width: 80%;
  }
  tr:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  </style>
  