<template>
  <div class="d-flex justify-content-center align-items-center">
    <form @submit.prevent="save" class="p-4 border rounded text-light bg-dark d-flex flex-column justify-content-between">
      <div class="mb-3">
        <label for="name" class="form-label small d-block mb-0">Name</label>
        <input v-model="form.name" type="text" class="form-control-sm border-dark w-100" id="name" required placeholder="Enter name">
      </div>
      <div class="p-2 border rounded text-light bg-dark d-flex flex-column justify-content-between">
        <div class="mb-2">
          <label for="address" class="form-label small d-block mb-0">URL/IP</label>
          <input v-model="form.address" type="text" class="form-control-sm border-dark w-100" id="address" placeholder="Enter address" required>
        </div>
        <div class="mb-2">
          <label for="frequency" class="form-label small d-block mb-0">Frequency of tests (sec)</label>
          <input v-model="form.frequency" type="number" class="form-control-sm border-dark w-100" id="frequency" placeholder="Enter frequency" required>
        </div>
        <div class="mb-2">
          <label for="number_of_samples" class="form-label small d-block mb-0">Number of Samples</label>
          <input v-model="form.number_of_samples" type="number" class="form-control-sm border-dark w-100" id="number_of_samples" placeholder="Enter number of samples" required>
        </div>
        <div class="mb-2">
          <label for="response_time" class="form-label small d-block mb-0">Response Time (sec)</label>
          <input v-model="form.response_time" type="number" class="form-control-sm border-dark w-100" id="response_time" placeholder="Enter response time" required>
        </div>
        <div class="mb-3">
          <label for="status" class="form-label small d-block mb-0">Status</label>
          <select v-model="form.status" class="form-select form-select-sm border-dark w-100" id="status" required>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3">
        <button type="submit" class="btn text-bg-success flex-fill me-2">Save</button>
        <button type="button" class="btn text-bg-danger flex-fill" @click="cancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const apiBaseUrl = import.meta.env.VITE_API_URL;

const form = ref({
  name: '',
  address: '',
  frequency: '60',
  number_of_samples: '1',
  response_time: '1',
  status: 'active',
});

function cancel() {
  router.push('/services');
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

async function save() {
  try {
    if (!validateForm()) {
      return;
    }

    const payload = {
      name: form.value.name,
      setting: {
        status: form.value.status,
        address: form.value.address,
        frequency: form.value.frequency,
        response_time: form.value.response_time,
        number_of_samples: form.value.number_of_samples,
      }
    };

    console.log('Payload to send:', JSON.stringify(payload));

    const response = await fetch(`${apiBaseUrl}/service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(payload),
    });

    console.log('API Response:', response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save service data');
    }

    alert('Service updated successfully!');
    router.push('/services');
  } catch (error) {
    console.error('Error:', error.message);
    alert(`Error: ${error.message}`);
  }
}
</script>

<style scoped>
form {
  height: 504px;
  width: 40%;
  min-width: 280px;
  max-width: 350px;
}
</style>
