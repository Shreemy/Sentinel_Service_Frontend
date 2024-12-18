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
          <select v-model="form.account_type" class="form-select form-select-sm border-dark w-100" id="accountType" :disabled="isProfileRoute">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
  
        <div class="mb-3">
          <label for="status" class="form-label small d-block mb-0">Status</label>
          <select v-model="form.is_active" class="form-select form-select-sm border-dark w-100" id="status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
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

// const router = useRouter();
const route = useRoute();
const router = useRouter();

const apiBaseUrl = import.meta.env.VITE_API_URL;

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
 
  function fillForm(user) {
    form.value.login = user.login;
    form.value.email = user.email || null;
    form.value.phone_number = user.phone_number || null;
    form.value.account_type = user.account_type;
    form.value.is_active = user.is_active;
    // console.log(form.value);
    console.log(JSON.stringify(form.value))
}


// Funkcja anulowania
function cancel() {
    router.push('/users');
    }
  
  // Funkcja zapisu
async function save() {
    try {
        const userId = route.params.guid
        if (!userId) {
            alert('User ID is missing!');
            return;
        }

        const response = await fetch(`${apiBaseUrl}/user?id=${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        alert('User updated successfully!');
        // router.push('/users');
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
  
// Pobierz dane użytkownika 
async function fetchUserDetails() {
    try {
        const userId = route.params.guid;
        if (!userId) {
            console.error('User GUID is missing in the route!');
            return;
        }

        const response = await fetch(`${apiBaseUrl}/user?id=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            fillForm(data[0]);
        } else {
            console.error('API returned an empty array or invalid data format:', data);
        }

    } catch (error) {
        console.error('Error fetching user details:', error.message);
    }
}

onMounted(() => {
  if (route.params.guid) {
    fetchUserDetails();
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
  