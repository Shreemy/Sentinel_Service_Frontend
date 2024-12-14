<template>
    <div class="d-flex justify-content-center align-items-center vh-100 vw-100">
        <form  class="p-4 border rounded shadow-sm bg-body-secondary d-flex flex-column justify-content-between">
            <Logo/>
            <div class="mb-1">
                <label for="login" class="form-label mb-0">Login</label>
                <input type="login" class="form-control border-dark" id="login">
            </div>
            <div class="mb-1">
                <label for="email" class="form-label mb-0">Email</label>
                <input type="email" class="form-control border-dark" id="password">
            </div>
            <div data-mdb-input-init class="form-outline mb-1" >
              <label for="phone" class="form-label mb-0">Phone number</label>
              <input type="text" id="phone" class="form-control border-dark" pattern="^[+]?[0-9]{10,15}$"/>
            </div>
            <div class="mb-1">
                <label for="email" class="form-label mb-0">Account Type</label>
                <input type="email" class="form-control border-dark" id="password" disabled readonly>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label mb-0">Status</label>
                <input type="email" class="form-control border-dark" id="password" disabled readonly>
            </div>
            <div>
              <button type="submit" class="btn text-bg-success">Save</button>
              <button type="button" class="btn text-bg-danger" @click="cancel">Cancel</button>
            </div>
        </form>
    </div>
</template>
<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter();

    function cancel() {
        router.push('/');
    }
</script>