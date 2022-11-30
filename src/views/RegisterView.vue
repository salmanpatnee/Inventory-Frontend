<script setup>
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import { ref } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const handleRegister = async () => {
  try {
    const { data: response } = await authStore.register(form.value);
    Toast.fire({
      icon: "success",
      title: response.message,
    });
    router.push({ name: "dashboard" });
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
  }
};
</script>

<template>
  <div class="text-center">
    <h1 class="h4 text-gray-900 mb-4">Register</h1>
  </div>
  <form @submit.prevent="handleRegister">
    <div class="form-group">
      <label>Full Name</label>
      <input
        type="text"
        class="form-control"
        id="exampleInputFirstName"
        placeholder="Enter First Name"
        v-model="form.name"
      />
    </div>
    <div class="form-group">
      <label>Email</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail"
        aria-describedby="emailHelp"
        placeholder="Enter Email Address"
        v-model="form.email"
      />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input
        type="password"
        class="form-control"
        id="exampleInputPassword"
        placeholder="Password"
        v-model="form.password"
      />
    </div>
    <div class="form-group">
      <label>Repeat Password</label>
      <input
        type="password"
        class="form-control"
        id="exampleInputPasswordRepeat"
        placeholder="Repeat Password"
        v-model="form.password_confirmation"
      />
    </div>
    <div class="form-group">
      <button type="submit" class="btn btn-primary btn-block">Register</button>
    </div>
  </form>
  <hr />
  <div class="text-center">
    <router-link :to="{ name: 'login' }" class="font-weight-bold small"
      >Already have an account?</router-link
    >
  </div>
  <div class="text-center"></div>
</template>
