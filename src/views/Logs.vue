<template>
  <div class="container bg-dark text-light p-4 rounded">
    <h2 class="mb-4">Logs</h2>

    <div class="row mb-3">
      <div class="col-md-4">
        <input v-model="filters.date" type="date" class="form-control" placeholder="Filter by Date" />
      </div>
      <div class="col-md-2">
        <button @click="fetchLogs" class="btn btn-primary w-100">
          <i class="bi bi-search me-1"></i>Search
        </button>
      </div>
      <div class="col-md-2">
        <button @click="resetFilters" class="btn btn-secondary w-100">
          <i class="bi bi-arrow-counterclockwise me-1"></i>Reset
        </button>
      </div>
    </div>

    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th @click="toggleSortOrder" class="sortable">
            Date/Time
            <span>{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </th>
          <th>Content</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, index) in logs" :key="index">
          <td>{{ log.time_stamp }}</td>
          <td>{{ log.content }}</td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-center mt-3">
      <button @click="loadMore" :disabled="isLoading" class="btn btn-sm btn-success">
        <i class="bi bi-plus-circle"></i>
        {{ isLoading ? 'Loading...' : 'Load More' }}
      </button>
    </div>

    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    <div v-if="logs.length === 0 && !isLoading" class="alert alert-info mt-3">No logs available.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const apiBaseUrl = import.meta.env.VITE_API_URL;

const logs = ref([]);
const filters = ref({ date: '' });
const sortOrder = ref('asc');
const currentPage = ref(1);
const isLoading = ref(false);
const error = ref(null);

async function fetchLogs(reset = true) {
  if (reset) {
    logs.value = [];
    currentPage.value = 0;
  }

  isLoading.value = true;
  error.value = null;

  try {
    let url = `${apiBaseUrl}/logs?sort=${sortOrder.value}&page=${currentPage.value}`;
    if (filters.value.date) {
      url += `&date=${filters.value.date}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch logs');
    }

    const data = await response.json();
    logs.value = reset ? data : [...logs.value, ...data];
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchLogs();
}

function resetFilters() {
  filters.value.date = '';
  fetchLogs();
}

function loadMore() {
  currentPage.value += 1;
  fetchLogs(false);
}

onMounted(() => {
  fetchLogs();
});
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable span {
  margin-left: 5px;
}

.table th {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.table td {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.table td:nth-child(2) {
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 400px;
  text-align: left;
}

.btn-success {
  width: 200px;
}
</style>
