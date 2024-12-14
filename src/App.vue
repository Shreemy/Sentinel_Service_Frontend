<script setup>
  import Navbar from './components/Navbar.vue';
  import HelloWorld from './components/HelloWorld.vue'
  import TheWelcome from './components/TheWelcome.vue'
  import { ref } from 'vue';

  const isAuthenticated = ref(true);

  if (localStorage.getItem('token')) {
  isAuthenticated.value = true;
}
</script>

<template>
  <Navbar v-if="isAuthenticated" />
  <div class="bg-secondary vw-100 vh-100">
    <router-view></router-view>
  </div>
</template>

<style scoped>
</style>