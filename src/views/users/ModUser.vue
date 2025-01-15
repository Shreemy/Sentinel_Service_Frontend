<template>
  <div class="d-flex justify-content-center align-items-center">
    <form @submit.prevent="save" class="p-4 border rounded text-light bg-dark d-flex flex-column justify-content-between">
      <Logo />
      <div class="mb-2">
        <label for="login" class="form-label small d-block mb-0">Login</label>
        <input
          v-model="form.login"
          type="text"
          class="form-control-sm border-dark w-100"
          id="login"
          required
          placeholder="Enter login"
        />
      </div>

      <div class="mb-2">
        <label for="password" class="form-label small d-block mb-0">Password</label>
        <div class="input-group w-100">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-control-sm border-dark flex-grow-1 me-1 rounded-end"
            id="password"
            placeholder="Enter password"
          />
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm text-bg-secondary rounded"
            @click="togglePasswordVisibility('password')"
            tabindex="-1"
          >
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
      </div>

      <div class="mb-2">
        <label for="retypePassword" class="form-label small d-block mb-0">Confirm Password</label>
        <div class="input-group w-100">
          <input
            v-model="form.retypePassword"
            :type="showRetypePassword ? 'text' : 'password'"
            class="form-control-sm border-dark flex-grow-1 me-1 rounded-end"
            id="retypePassword"
            placeholder="Confirm password"
          />
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm text-bg-secondary rounded"
            @click="togglePasswordVisibility('retypePassword')"
            tabindex="-1"
          >
            <i :class="showRetypePassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <small v-if="form.password !== form.retypePassword && form.retypePassword" class="text-danger">
          Passwords do not match!
        </small>
      </div>

      <div class="mb-2">
        <label for="email" class="form-label small d-block mb-0">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="form-control-sm border-dark w-100"
          id="email"
          placeholder="Enter email"
        />
      </div>

      <div class="mb-2">
        <label for="phone" class="form-label small d-block mb-0">Phone Number</label>
        <input
          v-model="form.phone_number"
          type="text"
          id="phone"
          class="form-control-sm border-dark w-100"
          pattern="^[+]?[0-9]{10,15}$"
          placeholder="Enter phone number"
        />
      </div>

      <div class="mb-2">
        <label for="accountType" class="form-label small d-block mb-0">Account Type</label>
        <select
          v-model="form.account_type"
          class="form-select form-select-sm border-dark w-100"
          id="accountType"
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="status" class="form-label small d-block mb-0">Status</label>
        <select
          v-model="form.is_active"
          class="form-select form-select-sm border-dark w-100"
          id="status"
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <!-- Buttons section -->
      <div class="d-flex justify-content-between mt-3">
        <button
          type="submit"
          class="btn text-bg-success flex-fill me-2"
          :disabled="!isFormValid"
        >
          Save
        </button>
        <button type="button" class="btn text-bg-danger flex-fill" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const apiBaseUrl = import.meta.env.VITE_API_URL;

// Pola formularza
const form = ref({
  login: '',
  email: '',
  password: '',
  retypePassword: '',
  phone_number: null,
  account_type: '',
  is_active: '',
});

// Stany dla podglądu haseł
const showPassword = ref(false);
const showRetypePassword = ref(false);

// Walidacja formularza
const isFormValid = computed(() => {
  return (
    form.value.login &&
    (!form.value.email || form.value.email) &&
    form.value.account_type &&
    form.value.is_active &&
    (!form.value.password || form.value.password === form.value.retypePassword)
  );
});

// Funkcja podglądu hasła
function togglePasswordVisibility(field) {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else if (field === 'retypePassword') {
    showRetypePassword.value = !showRetypePassword.value;
  }
}

// Funkcja anulowania
function cancel() {
  router.push('/users');
}

// Funkcja pobierania danych użytkownika
async function fetchUserDetails() {
  try {
    const userId = route.params.guid;
    if (!userId) {
      console.error('User GUID is missing in the route!');
      return;
    }

    const response = await fetch(`${apiBaseUrl}/user?id=${userId}`,
      { method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      fillForm(data[0]);
    }
  } catch (error) {
    console.error('Error fetching user details:', error.message);
  }
}

// Funkcja wypełniania formularza
function fillForm(user) {
  form.value.login = user.login || '';
  form.value.email = user.email || null;
  form.value.phone_number = user.phone_number || null;
  form.value.account_type = user.account_type || '';
  form.value.is_active = user.is_active || '';
}

// Funkcja zapisu
async function save() {
  try {
    const userId = route.params.guid;
    if (!userId) {
      console.error('User GUID is missing in the route!');
      return;
    }

    if (form.value.password && form.value.password !== form.value.retypePassword) {
      alert('Passwords do not match!');
      return;
    }
    
    const payload = {
      ...form.value,
      email: form.value.email ? form.value.email : null,
      phone_number: form.value.phone_number ? form.value.phone_number : null,
     };
    if (!form.value.password) {
      delete payload.password;
    }


    const response = await fetch(`${apiBaseUrl}/user?id=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to save user data');
    }

    alert('User updated successfully!');
    router.push('/users');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Inicjalizacja
onMounted(() => {
  if (route.params.guid) {
    fetchUserDetails();
  }
});
</script>
<style scoped>
form {
  width: 40%;
  min-width: 280px;
  max-width: 350px;
}
.input-group .btn {
  border-left: none;
}
</style>
