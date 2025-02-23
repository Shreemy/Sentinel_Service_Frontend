<template>
    <div class="d-flex justify-content-center align-items-center vw-100 text-light">
        <form @submit.prevent="handleLogin" class="p-4 border rounded shadow-sm bg-dark d-flex flex-column justify-content-between">
            <Logo/>
            <div class="mb-3">
                <label for="login" class="form-label">Login</label>
                <input v-model="login" type="text" class="form-control border-dark" id="login" required placeholder="Enter login">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control border-dark" id="password" required placeholder="Enter password">
                    <button type="button" class="btn btn-outline-secondary text-bg-secondary" @click="togglePasswordVisibility">
                        <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                </div>
            </div>
            <button type="submit" class="btn text-bg-success mt-3">Login</button>
            <div v-if="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
        </form>
    </div>
</template>

<script setup>
import Logo from '@/components/Logo.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();
const apiBaseUrl = import.meta.env.VITE_API_URL;

const login = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');

function togglePasswordVisibility() {
    showPassword.value = !showPassword.value;
}

async function handleLogin() {
    errorMessage.value = '';

    try {
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                login: login.value,
                password: password.value
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Invalid credentials');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);

        router.push('/');
    } catch (error) {
        errorMessage.value = error.message;
        console.error('Login error:', error.message);
    }
}

onMounted(() => {
    if (localStorage.getItem('access_token')) {
        router.push('/');
    }
});
</script>

<style scoped>
form {
    height: 40%;
    min-height: 320px;
    max-height: 340px;
    width: 30%;
    min-width: 280px;
    max-width: 350px;
}

.input-group button {
    border-left: none;
}

.alert {
    font-size: 0.9rem;
    padding: 5px 10px;
    text-align: center;
}
</style>
