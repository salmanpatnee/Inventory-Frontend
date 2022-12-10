<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { useUserStore } from "@/stores/userStore.js";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref } from "vue";

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const { flashSuccess, flashError } = useFlash();
const editMode = ref(false);

const user = computed(() => userStore.currentUser.data);
const isLoading = computed(() => userStore.currentUser.isLoading);

const form = ref(
  new Form({
    id: null,
    name: null,
    email: null,
    password: "",
    password_confirmation: "",
    phone: null,
    address: null,
    salary: null,
    joining_date: null,
    active: null,
  })
);

const pageHeaderTitle = computed(() => {
  return !editMode.value ? "Add New User" : "Edit User";
});

const getUser = async () => {
  editMode.value = true;
  await userStore.getUser(route.params.id);
  form.value.fill(user.value);
};

const store = async () => {
  try {
    const { data: response } = await authStore.register(form.value);
    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "users.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};

const update = async () => {
  try {
    const { data: response } = await userStore.updateUser(
      form.value,
      route.params.id
    );

    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "users.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};

onMounted(() => {
  if (route.params.id) {
    getUser();
  }
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle">
    <router-link
      :to="{ name: 'users.index' }"
      class="btn btn-primary btn-icon-split"
    >
      <span class="icon text-white-50">
        <i class="fas fa-arrow-left"></i>
      </span>
      <span class="text">All Users</span>
    </router-link>
  </AppPageHeader>
  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <form v-else @submit.prevent="editMode ? update() : store()">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              id="name"
            />
            <HasError :form="form" field="name" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="email"
            />
            <HasError :form="form" field="email" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="form.password"
            />
            <HasError :form="form" field="password" />
            <small v-show="editMode"
              >Leave password field blank if you don't want to update
              password</small
            >
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="password_confirmation">Repeat Password</label>
            <input
              type="password"
              class="form-control"
              id="password_confirmation"
              v-model="form.password_confirmation"
            />
            <HasError :form="form" field="password_confirmation" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-control"
              id="phone"
            />
            <HasError :form="form" field="phone" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="address">Address</label>
            <input
              v-model="form.address"
              type="text"
              class="form-control"
              id="address"
            />
            <HasError :form="form" field="address" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="salary">Salary</label>
            <input
              v-model="form.salary"
              type="number"
              class="form-control"
              id="salary"
            />
            <HasError :form="form" field="salary" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="joining_date">Joining Date</label>
            <input
              v-model="form.joining_date"
              type="date"
              class="form-control"
              id="joining_date"
            />
            <HasError :form="form" field="joining_date" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-check form-switch">
            <input
              v-model="form.active"
              class="form-check-input"
              type="checkbox"
              id="active"
            />
            <label class="form-check-label" for="active">Active</label>
          </div>
        </div>
      </div>
      <div class="text-right">
        <Button class="btn btn-primary" :form="form">
          {{ editMode ? "Update User" : "Add New User" }}
        </Button>
      </div>
    </form>
  </AppPanel>
</template>
<style scoped>
.form-check {
  line-height: 1.9em;
}
.form-check-input {
  width: 20px;
  height: 20px;
}
label.form-check-label {
  margin-left: 0.5em;
}
</style>
