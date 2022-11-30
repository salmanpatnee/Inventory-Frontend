<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import { ref } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const data = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  try {
    const { data: response } = await authStore.login(data.value);
    Toast.fire({
      icon: "success",
      title: response.message,
    });
    router.push({ name: "dashboard" });
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: error.response.data.message,
    });
  }
};
</script>

<template>
  <div class="text-center">
    <h1 class="h4 text-gray-900 mb-4">Login</h1>
  </div>

  <form @submit.prevent="handleLogin" class="user">
    <div class="form-group">
      <input
        type="email"
        class="form-control"
        placeholder="Enter Email Address"
        v-model="data.email"
      />
    </div>
    <div class="form-group">
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        v-model="data.password"
      />
    </div>
    <div class="form-group">
      <div
        class="custom-control custom-checkbox small"
        style="line-height: 1.5rem"
      >
        <input type="checkbox" class="custom-control-input" id="customCheck" />
        <label class="custom-control-label" for="customCheck"
          >Remember Me</label
        >
      </div>
    </div>
    <div class="form-group">
      <button type="submit" class="btn btn-primary btn-block">Login</button>
    </div>
  </form>

  <hr />
  <div class="text-center">
    <router-link :to="{ name: 'register' }" class="font-weight-bold small"
      >Create an Account?</router-link
    >
  </div>
  <div class="text-center"></div>
</template>
