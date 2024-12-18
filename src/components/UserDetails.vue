<template>
  <div class="d-flex justify-content-center align-items-center">
    <form @submit.prevent="save" class="p-4 border rounded shadow-sm text-light bg-dark d-flex flex-column justify-content-between">
      <Logo />
      <div class="mb-2">
        <label for="login" class="form-label small d-block mb-0">Login</label>
        <input v-model="form.login" type="text" class="form-control-sm border-dark w-100" id="login">
      </div>

      <div class="mb-2">
        <label for="email" class="form-label small d-block mb-0">Email</label>
        <input v-model="form.email" type="email" class="form-control-sm border-dark w-100" id="email">
      </div>

      <div class="mb-2">
        <label for="phone" class="form-label small d-block mb-0">Phone number</label>
        <input v-model="form.phone_number" type="text" id="phone" class="form-control-sm border-dark w-100" pattern="^[+]?[0-9]{10,15}$">
      </div>

      <div class="mb-2">
        <label for="accountType" class="form-label small d-block mb-0">Account Type</label>
        <input v-model="form.account_type" type="text" class="form-control-sm border-dark w-100" id="accountType" :disabled="isProfileRoute" readonly>
      </div>

      <div class="mb-3">
        <label for="status" class="form-label small d-block mb-0">Status</label>
        <input v-model="form.is_active" type="text" class="form-control-sm border-dark w-100" id="status">
      </div>

      <!-- Buttons section -->
      <div v-if="showButtons" class="d-flex justify-content-between mt-3">
        <button type="submit" class="btn text-bg-success flex-fill me-2">Save</button>
        <button type="button" class="btn text-bg-danger flex-fill" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Props dla danych użytkownika (gdy wywołane z listy)
defineProps({
  user: {
    type: Object,
    required: false, // Opcjonalny, bo może pochodzić z /profile
  },
  showButtons: {
    type: Boolean, 
    required: false}
});
alert(user.value);
alert(user.login);
alert(user.login.value);
const router = useRouter();
const route = useRoute();

// Sprawdź, czy działamy w trybie standalone (/profile)
const isProfileRoute = route.path === '/profile';

// Stan formularza
const form = ref({
  login: '',
  email: '',
  phone_number: '',
  account_type: '',
  is_active: '',
});

// Funkcja zapisu
async function save() {
  try {
    const userId = route.query.id || user.guid; // ID z query lub przekazany w props
    if (!userId) {
      alert('User ID is missing!');
      return;
    }

    const response = await fetch(`https://your-backend.com/api/user?id=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    alert('User updated successfully!');
    router.push('/');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Pobierz dane użytkownika z backendu (gdy działamy na /profile)
// async function fetchUserDetails() {
//   try {
//     const userId = route.query.id;
//     if (!userId) return;

//     const response = await fetch(`https://your-backend.com/api/user?id=${userId}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch user details');
//     }

//     const data = await response.json();
//     form.value = data; // Wypełnij formularz danymi z backendu
//   } catch (error) {
//     console.error('Error fetching user details:', error.message);
//   }
// }

// Inicjalizacja danych w formularzu
onMounted(() => {
  // if (isProfileRoute) {
  //   // fetchUserDetails(); // Pobierz dane użytkownika z backendu
  // } else 
  if (user) {
    form.value = {
      login: user.login || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
      account_type: user.account_type || '',
      is_active: user.is_active || '',
    }; // Wypełnij formularz danymi przekazanymi w props
  }
});
</script>

<style scoped>
form {
  height: 55%;
  min-height: 415px;
  max-height: 420px;
  width: 40%;
  min-width: 280px;
  max-width: 350px;
}
</style>
