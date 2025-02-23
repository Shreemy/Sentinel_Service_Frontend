<template>
  <div class="container p-3 rounded bg-dark text-light">
    <div class="row mw-4 me-2">
      <div class="col-1" />
      <div class="col-4 align-items-center justify-content-center me-3">
        <div class="container align-items-center justify-content-center vw-80">
          <h5 class="d-flex">
            <button @click="prevMonth" class="btn btn-sm text-white">&lt;</button>
            <span>{{ currentMonthName }} {{ currentYear }}</span>
            <button @click="nextMonth" class="btn btn-sm text-white">&gt;</button>
          </h5>
          <table class="table table-dark text-center">
            <thead>
              <tr>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Sun</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, index) in calendar" :key="index">
                <td v-for="(day, dayIndex) in week" :key="dayIndex">
                  <button v-if="day" class="btn btn-sm w-100" :class="getDayLogStatus(day)" @click="scrollToLog(day)">
                    {{ day }}
                  </button>
                  <div v-else></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-1" />
      <div class="col border border-secondary p-3 rounded d-flex flex-column justify-content-between" style="height: 100%;">
        <form @submit.prevent="updateService">
          <div class="row">
            <div class="col-md-6">
              <label>Name:</label>
              <input v-model="form.name" type="text" class="form-control form-control-sm form-sm mb-2" placeholder="Enter name" required />
              <label>Address:</label>
              <input v-model="form.address" type="text" class="form-control form-control-sm mb-2" placeholder="Enter address" required />
            </div>
            <div class="col-md-3" />
            <div class="col-md-3">
              <label>Actual State:</label>
              <h4>
                <span class="badge mt-2" :class="{'bg-success': form.actual_state === 'available', 'bg-danger': form.actual_state !== 'available'}">
                  {{ form.actual_state }}
                </span>
              </h4>
            </div>
            <div class="col-md-6">
              <label>Frequency (sec):</label>
              <input v-model="form.frequency" type="number" class="form-control form-control-sm mb-2" placeholder="Enter frequency" required />
              <label>Number of Samples:</label>
              <input v-model="form.number_of_samples" type="number" class="form-control form-control-sm mb-2" placeholder="Enter number of samples" required />
            </div>
            <div class="col-md-6">
              <label>Response Time (sec):</label>
              <input v-model="form.response_time" type="number" class="form-control form-control-sm mb-2" placeholder="Enter response time" required />
              <label>Status:</label>
              <select v-model="form.status" class="form-select form-select-sm border-dark w-100" id="status" required>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="d-flex justify-content-end mt-2">
            <button type="submit" class="btn" :class="{'btn-success': isFormChanged, 'btn-secondary': !isFormChanged}" :disabled="!isFormChanged" style="width: 150px;">Update</button>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-12 bg-dark p-3 rounded">
        <table class="table table-dark table-striped log-table">
          <thead>
            <tr>
              <th @click="sortLogs">Date/Time 
                <span v-if="sortDirection === 'asc'">↑</span>
                <span v-else>↓</span>
              </th>
              <th>State</th>
              <th>Code</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, index) in paginatedLogs" :key="index" :id="`log-${log.time_stamp}`">
              <td>{{ log.time_stamp }}</td>
              <td>
                <span class="badge mb-1" :class="{'bg-success': log.state === 'available', 'bg-danger': log.state !== 'available'}">
                  {{ log.state }}
                </span>
              </td>
              <td>{{ log.code }}</td>
              <td>{{ log.message }}</td>
              <td>{{ log.status }}</td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-center">
          <button @click="prevPage" class="btn btn-sm btn-secondary" style="width: 80px;">Previous</button>
          <input v-model.number="currentPage" @change="fetchLogs" type="number" class="form-control mx-2 text-center" style="width: 80px;" min="1" />
          <button @click="nextPage" class="btn btn-sm btn-secondary" style="width: 80px;">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const apiBaseUrl = import.meta.env.VITE_API_URL;
const form = ref({
  name: '',
  actual_state: '',
  status: '',
  frequency: '',
  number_of_samples: '',
  response_time: ''
});
const logs = ref([]);
const currentPage = ref(1);
const itemsPerPage = 20;

const currentDate = ref(new Date());

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('en-US', { month: 'long' });
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const calendar = computed(() => {
  const days = Array.from({ length: daysInMonth.value }, (_, i) => i + 1);
  const calendar = [];
  let week = Array((firstDayOfMonth.value === 0 ? 6 : firstDayOfMonth.value - 1)).fill(null);
  
  days.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  });
  
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    calendar.push(week);
  }
  
  return calendar;
});

function scrollToLog(day) {
  const selectedDate = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  console.log(`Scrolling to logs for date: ${selectedDate}`);

  const logIndex = logs.value.findIndex(log => log.time_stamp.startsWith(selectedDate));
  
  if (logIndex !== -1) {
    const targetPage = Math.floor(logIndex / itemsPerPage) + 1;
    currentPage.value = targetPage;

    fetchLogs().then(() => {
      setTimeout(() => {
        const targetLog = logs.value.find(log => log.time_stamp.startsWith(selectedDate));
        if (targetLog) {
          const targetRow = document.getElementById(`log-${targetLog.time_stamp}`);
          if (targetRow) {
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => targetRow.classList.remove('highlight'), 2000);
          }
        }
      }, 300);
    });
  } else {
    alert(`No logs found for ${selectedDate}`);
  }
}

function getDayLogStatus(day) {
  const selectedDate = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const logsForDay = logs.value.filter(log => log.time_stamp.startsWith(selectedDate));
  
  if (logsForDay.length === 0) return 'btn-dark';
  if (logsForDay.every(log => log.state === 'available')) return 'btn-success';
  return 'btn-warning';
}

function prevMonth() {
  currentDate.value.setMonth(currentDate.value.getMonth() - 1);
  currentDate.value = new Date(currentDate.value);
}

function nextMonth() {
  currentDate.value.setMonth(currentDate.value.getMonth() + 1);
  currentDate.value = new Date(currentDate.value);
}

const initialForm = ref({});

async function fetchServiceDetails() {
  try {
    const serviceId = route.params.guid;
    if (!serviceId) {
      console.error('Service GUID is missing in the route!');
      return;
    }

    const response = await fetch(`${apiBaseUrl}/service?id=${serviceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch service details');
    }

    const data = await response.json();
    console.log('Service details:', data);

    if (Array.isArray(data) && data.length > 0) {
      fillForm(data[0]);
    } else {
      console.error('API returned an empty array or invalid data format:', data);
    }
  } catch (error) {
    console.error('Error fetching service details:', error.message);
  }
}

function fillForm(service) {
  form.value.name = service.name || '';
  form.value.address = service.setting.address || '';
  form.value.frequency = service.setting?.frequency || '';
  form.value.number_of_samples = service.setting?.number_of_samples || '';
  form.value.response_time = service.setting?.response_time || '';
  form.value.status = service.setting?.status || '';
  form.value.actual_state = service.actual_state || '';
  initialForm.value = JSON.parse(JSON.stringify(form.value));
}

const isFormChanged = computed(() => {
  return JSON.stringify(form.value) !== JSON.stringify(initialForm.value);
});

async function updateService() {
  try {
    if (!validateForm()) {
      return;
    }

    const serviceId = route.params.guid;
    if (!serviceId) {
      console.error('Service GUID is missing in the route!');
      return;
    }

    const payload = {
      name: form.value.name,
      setting: {
        address: form.value.address,
        frequency: form.value.frequency,
        number_of_samples: form.value.number_of_samples,
        response_time: form.value.response_time,
        status: form.value.status
      },
      actual_state: form.value.actual_state
    };

    console.log('Sending update payload:', payload);

    const response = await fetch(`${apiBaseUrl}/service?id=${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update service');
    }

    const responseData = await response.json();
    console.log('Update successful:', responseData);

    alert('Service updated successfully!');
  } catch (error) {
    console.error('Error updating service:', error.message);
    alert(`Error: ${error.message}`);
  }
}

function validateForm() {
  const frequency = Number(form.value.frequency);
  const responseTime = Number(form.value.response_time);
  const numberOfSamples = Number(form.value.number_of_samples);

  if (isNaN(frequency) || isNaN(responseTime) || isNaN(numberOfSamples)) {
    alert('Frequency, Response Time, and Number of Samples must be valid numbers.');
    return false;
  }

  if (frequency < 60) {
    alert('Frequency must be at least 60.');
    return false;
  }

  if (responseTime * numberOfSamples >= frequency) {
    alert('Response Time multiplied by Number of Samples must be less than Frequency.');
    return false;
  }

  return true;
}

const sortDirection = ref('desc');

async function fetchLogs() {
  try {
    const serviceId = route.params.guid;
    if (!serviceId) {
      console.error('Service GUID is missing in the route!');
      return;
    }

    const response = await fetch(`${apiBaseUrl}/serviceLogs?id=${serviceId}&sort=${sortDirection.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch logs');
    }

    const data = await response.json();
    console.log('Logs:', data);

    logs.value = data;
  } catch (error) {
    console.error('Error fetching logs:', error.message);
  }
}

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return logs.value.slice(start, start + itemsPerPage);
});

function sortLogs() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  fetchLogs();
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if ((currentPage.value * itemsPerPage) < logs.value.length) currentPage.value++;
}

onMounted(() => {
  if (route.params.guid) {
    fetchServiceDetails();
    fetchLogs();
  }
});
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}
.calendar-day {
  border: 1px solid #ccc;
  text-align: center;
  padding: 5px;
  cursor: pointer;
}
.calendar-day span {
  display: block;
}
h5 {
  font-size: 1rem;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
}
.btn {
  font-size: 0.8rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
table {
  width: 100%;
}
.table td {
  padding: 0;
  width: 14.28%;
}
.table .btn {
  width: 100%;
  height: 30px;
}
.log-table th, .log-table td {
  text-align: center;
  vertical-align: middle;
}
</style>
