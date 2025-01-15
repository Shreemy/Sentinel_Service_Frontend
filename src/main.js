import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token'); // Sprawdź token w localStorage

    if (to.meta.requiresAuth && !token) {
        // Jeśli wymaga logowania i brak tokenu
        next('/login'); // Przekieruj na ekran logowania
    } else {
        next(); // Kontynuuj nawigację
    }
});


createApp(App).use(bootstrap).use(router).mount('#app')