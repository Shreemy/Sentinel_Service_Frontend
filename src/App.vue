<script setup>
  import Navbar from './components/Navbar.vue';
  import { ref } from 'vue';

  const isAuthenticated = ref(false);

  if (localStorage.getItem('access_token')) {
  isAuthenticated.value = true;
}
</script>

<template>
  <Navbar v-if="isAuthenticated" />
  <div class="main-content bg-secondary vw-100 vh-100">
    <router-view></router-view>
  </div>
</template>

<style scoped>
.main-content {
  padding-top: 10%;
}
</style>