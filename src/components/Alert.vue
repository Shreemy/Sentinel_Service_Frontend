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
  
  // Props dla komponentu
  defineProps({
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'info', // Domyślny typ alertu
    },
  });
  
  // Emit event do zamykania
  const emit = defineEmits(['close']);
  
  // Wyznacz klasę alertu w zależności od typu
  const alertClass = computed(() => `alert-${type}`);
  
  // Funkcja zamykania alertu
  function closeAlert() {
    emit('close');
  }
  </script>
  
  <style scoped>
  .alert {
    margin-top: 20px;
  }
  </style>
  