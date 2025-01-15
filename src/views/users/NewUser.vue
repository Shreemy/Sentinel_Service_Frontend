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
            required
            minlength="8"
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
        <label for="retypePassword" class="form-label small d-block mb-0">Retype Password</label>
        <div class="input-group w-100">
          <input
            v-model="form.retypePassword"
            :type="showRetypePassword ? 'text' : 'password'"
            class="form-control-sm border-dark flex-grow-1 me-1 rounded-end"
            id="retypePassword"
            required
            minlength="8"
            :class="{ 'is-invalid': form.password !== form.retypePassword && form.retypePassword }"
            placeholder="Retype password"
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
        <div v-if="form.password !== form.retypePassword && form.retypePassword" class="invalid-feedback small">
          Passwords do not match.
        </div>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Import router and environment variables
const router = useRouter();
const apiBaseUrl = import.meta.env.VITE_API_URL;
const showPassword = ref(false);
const showRetypePassword = ref(false);

// Reactive form object
const form = ref({
  login: '',
  email: '',
  password: '',
  retypePassword: '',
  phone_number: '',
  account_type: 'user',
  is_active: 'active',
});

// Computed property to check form validity
const isFormValid = computed(() => {
  return (
    form.value.login &&
    form.value.password &&
    form.value.password === form.value.retypePassword &&
    form.value.account_type &&
    form.value.is_active
  );
});

function togglePasswordVisibility(field) {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else if (field === 'retypePassword') {
    showRetypePassword.value = !showRetypePassword.value;
  }
}

// Cancel function
function cancel() {
  router.push('/users');
}

// Save function
async function save() {
  try {
    if (form.value.password !== form.value.retypePassword) {
      alert('Passwords do not match.');
      return;
    }

    const payload = {
      ...form.value,
      password: form.value.password,
      phone_number: form.value.phone_number ? form.value.phone_number : null,
      email: form.value.email ? form.value.email : null,
    };

    const response = await fetch(`${apiBaseUrl}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error('Failed to create user');
    }

    alert('User created successfully!');
    router.push('/users');
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
</script>

<style scoped>
form {
  height: 70%;
  min-height: 530px;
  max-height: 620px;
  width: 40%;
  min-width: 280px;
  max-width: 350px;
}
</style>
