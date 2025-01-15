import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';
import Profile from './views/Profile.vue';
import Users from './views/users/Users.vue';
import ModUser from './views/users/ModUser.vue';
import NewUser from './views/users/NewUser.vue';
import Logs from './views/Logs.vue';
import Services from './views/services/Services.vue';
import ModService from './views/services/ModService.vue';
import NewService from './views/services/NewService.vue';
import ServiceDetails from './views/services/ServiceDetails.vue';

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
    meta: { requiresAuth: true },  
  },
  {
    path: '/monitor',
    name: 'Monitor',
    component: Dashboard,
    meta: { requiresAuth: true },  
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/:guid',
    name: 'modUser',
    component: ModUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/newUser',
    name: 'newUser',
    component: NewUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/logs',
    name: 'Logs',
    component: Logs,
  },
  {
    path: '/services',
    name: 'Services',
    component: Services,
  },
  {
    path: '/service/:guid',
    name: 'modService',
    component: ModService,
    meta: { requiresAuth: true },
  },
  { 
    path: '/newService',
    name: 'newService',
    component: NewService,
    meta: { requiresAuth: true },
  },
  {
    path: '/serviceDetails/:guid',
    name: 'serviceDetails',
    component: ServiceDetails,
  }
];

// Utwórz router
const router = createRouter({
  history: createWebHistory(), // Używa historii przeglądarki (czyste URL)
  routes,
});

export default router;
