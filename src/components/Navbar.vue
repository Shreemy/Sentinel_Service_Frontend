<script setup>
import Logo from './Logo.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function logout() {
    localStorage.removeItem('access_token');
    router.push('/login');
}
</script>

<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark fixed-top" data-bs-theme="dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">
                <Logo/>
            </router-link>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/monitor">Monitor</router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Services</a>
                        <ul class="dropdown-menu">
                            <li>
                                <router-link class="dropdown-item" to="/services">
                                    <i class="bi bi-database me-1"></i>Services
                                </router-link>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <router-link class="dropdown-item" to="/newService">
                                    <i class="bi bi-database-add me-1"></i>Add Service
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Administration
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <router-link class="dropdown-item" to="/users">
                                    <i class="bi bi-people me-1"></i>Users
                                </router-link>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <router-link class="dropdown-item" to="/newUser">
                                    <i class="bi bi-person-add me-1"></i>Add User
                                </router-link>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <router-link class="dropdown-item" to="/logs">Logs</router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="d-flex">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <button class="btn btn-dark" role="button" data-bs-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                            </svg>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <router-link class="dropdown-item" to="/profile">
                                    <i class="bi bi-person-gear me-1"></i>Account
                                </router-link>
                            </li>
                            <li>
                                <a class="dropdown-item" href="pass">
                                    <i class="bi bi-key me-1"></i>Reset password
                                </a>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <button class="dropdown-item" @click="logout">
                                    <i class="bi bi-power me-1"></i>Logout
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
nav {
    max-height: 55px;
}
</style>