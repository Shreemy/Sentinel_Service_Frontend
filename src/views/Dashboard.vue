<template>
  <div class="container bg-dark p-4 rounded">
    <h1 class="mb-4 text-white">Unavailable Services</h1>
    <div v-if="success" class="alert alert-success mt-3">
      {{ success }}
    </div>
    <table v-else class="table table-dark table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Actual State</th>
          <th>Address</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in services" :key="service.guid">
          <td>{{ service.name }}</td>
            <td>
            <span class="badge bg-danger" style="height: 100%;">
              {{ service.actual_state }}
            </span>
            </td>
          <td>{{ service.address }}</td>
          <td>
            <button
              @click="goToServiceDetails(service.guid)"
              class="btn btn-sm btn-primary"
            >
              Details
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="isLoading" class="text-center mt-3">
      <span>Loading...</span>
    </div>
    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const apiBaseUrl = import.meta.env.VITE_API_URL;
const router = useRouter();

const services = ref([]);
const isLoading = ref(false);
const error = ref(null);
const success = ref(null);
let intervalId = null;

// Pobieranie danych z API
async function fetchServices() {
  isLoading.value = true;
  error.value = null;
  success.value = null;

  try {
    const response = await fetch(`${apiBaseUrl}/servicesDown`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },

    });
    if (!response.ok) {
      throw new Error('Failed to fetch services data');
    }

    const data = await response.json();

    // Sprawdź, czy odpowiedź zawiera komunikat zamiast listy usług
    if (data.message) {
      success.value = data.message;
      services.value = [];
    } else if (Array.isArray(data)) {
      services.value = data;
      success.value = null;
    }

  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

// Nawigacja do szczegółów usługi
function goToServiceDetails(guid) {
  if (guid) {
    router.push(`/serviceDetails/${guid}`);
  }
}

// Automatyczne odświeżanie co minutę
onMounted(() => {
  fetchServices();
  intervalId = setInterval(fetchServices, 60000); // 60 sekund
});

// Zatrzymanie odświeżania przy odmontowaniu komponentu
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
}
.table th {
  text-align: center;
}
.table td {
  text-align: center;
}
.btn {
  width: 100px;
}
.alert {
  text-align: center;
}
</style>
