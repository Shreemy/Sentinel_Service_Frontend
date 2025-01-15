<template>
  <div class="d-flex justify-content-center align-items-center">
    <form @submit.prevent="save" class="p-4 border rounded text-light bg-dark d-flex flex-column justify-content-between">
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
        <input v-model="form.account_type" type="text" class="form-control-sm border-dark w-100" id="accountType" readonly>
      </div>

      <div v-if="!isProfileRoute" class="mb-3">
        <label for="status" class="form-label small d-block mb-0">Status</label>
        <input v-model="form.is_active" type="text" class="form-control-sm border-dark w-100" id="status" readonly>
      </div>

      <!-- Buttons section -->
      <div class="d-flex justify-content-between mt-3">
        <button type="submit" class="btn text-bg-success flex-fill me-2">Save</button>
        <button type="button" class="btn text-bg-danger flex-fill" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  
  let userId = ref('');

  // Stan formularza
  const form = ref({
    login: '',
    email: null,
    phone_number: null,
    account_type: '',
    is_active: 'active',
  });
  
  function fillForm(data) {
  form.value.login = data.login;
  form.value.email = data.email || null;
  form.value.phone_number = data.phone_number || null;
  form.value.account_type = data.account_type || '';
  form.value.is_active = data.is_active || 'inactive';
  userId = data.guid;
}

// Funkcja anulowania
function cancel() {
  router.push('/users');
}

// Funkcja zapisu
async function save() {
  try {
    // const userId = data[0].guid;
    // console.log(userId);
      if (!userId) {
        alert('User ID is missing!');
        return;
      }
  
      const response = await fetch(`${apiBaseUrl}/user?id=${userId}`, {
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
  
async function fetchUserDetails() {
  try {
    const response = await fetch(`${apiBaseUrl}/whoami`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    fillForm(data[0]); // Przekazujemy cały obiekt

  } catch (error) {
    console.error('Error fetching user details:', error.message);
  }
}


  
  // Inicjalizacja danych w formularzu
onMounted(() => {
  fetchUserDetails();
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
  