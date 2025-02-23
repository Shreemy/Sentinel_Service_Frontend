<template>
  <div
    v-if="message"
    :class="['alert', alertClass, 'd-flex', 'justify-content-between', 'align-items-center']"
    role="alert"
  >
    <span>{{ message }}</span>
    <button type="button" class="btn-close" @click="closeAlert" aria-label="Close"></button>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
  },
});

const emit = defineEmits(['close']);

const alertClass = computed(() => `alert-${type}`);

function closeAlert() {
  emit('close');
}
</script>

<style scoped>
.alert {
  margin-top: 20px;
}
</style>
