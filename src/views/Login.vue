
<template>
    <div class="d-flex justify-content-center align-items-center vh-100 vw-100">
        <form @submit.prevent="handleLogin" class="p-4 border rounded shadow-sm bg-body-secondary d-flex flex-column justify-content-between">
            <Logo/>
            <div class="mb-3">
                <label for="email" class="form-label">E-mail address</label>
                <input v-model="email" type="email" class="form-control border-dark" id="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input v-model="password" type="password" class="form-control border-dark" id="password" required>
            </div>
            
            <button type="submit" class="btn text-bg-success">Login</button>
        </form>
    </div>
</template>

<script setup>
        import Logo from '../components/Logo.vue'
        import { useRouter } from 'vue-router';

        const router = useRouter();
        // const email = ref('')
        // const password = ref('')
        // async function handleLogin() {
        //     try {
        //         const response = await fetch('https://your-backend.com/api/login', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ email: email.value, password: password.value }),
        //         });
        
        //         if (!response.ok) {
        //         throw new Error('Invalid credentials');
        //         }
        
        //         const data = await response.json();
        //         localStorage.setItem('token', data.token); // Zapisz token w localStorage
        //         router.push('/dashboard'); // Przekieruj na stronę główną
        //     } catch (error) {
        //         alert(error.message);
        //     }
        // }
</script>

<style scoped>
form {
    height: 40%;
    min-height: 306px;
    max-height: 320px;
    width: 30%;
    min-width: 240px;
    max-width: 300px;
}
</style>
