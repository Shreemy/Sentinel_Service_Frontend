import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';
import Profile from './views/Profile.vue';
import Users from './views/Users.vue';
import ModUser from './views/ModUser.vue';
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    // meta: { requiresAuth: true },  
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    // meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    // meta: { requiresAuth: true },
  },
  {
    path: '/profile/:guid',
    name: 'modUser',
    component: ModUser,
    // meta: { requiresAuth: true },
  },
];

// Utwórz router
const router = createRouter({
  history: createWebHistory(), // Używa historii przeglądarki (czyste URL)
  routes,
});


export default router;
