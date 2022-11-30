<script setup>
import { useEmployeeStore } from "@/stores/employeeStore.js";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";

const employeeStore = useEmployeeStore();
const router = useRouter();
const route = useRoute();
const editMode = ref(false);

const employee = computed(() => employeeStore.currentEmployee.data);
const isLoading = computed(() => employeeStore.currentEmployee.isLoading);

const form = ref(
  new Form({
    id: null,
    name: null,
    email: null,
    phone: null,
    address: null,
    salary: null,
    joining_date: null,
  })
);

const pageHeaderTitle = computed(() => {
  return !editMode.value ? "Add New Employee" : "Edit Employee";
});

const getEmployee = async () => {
  editMode.value = true;
  await employeeStore.getEmployee(route.params.id);
  form.value.fill(employee.value);
};

const store = async () => {
  try {
    const { data: response } = await employeeStore.addEmployee(form.value);
    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "employees.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
  }
};

const update = async () => {
  try {
    const { data: response } = await employeeStore.updateEmployee(
      form.value,
      route.params.id
    );

    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "employees.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
  }
};

onMounted(() => {
  if (route.params.id) {
    getEmployee();
  }
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle">
    <router-link :to="{ name: 'employees.index' }" class="btn btn-primary">
      All Employees
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
      <div class="text-right">
        <Button class="btn btn-primary" :form="form">
          {{ editMode ? "Update Employee" : "Add New Employee" }}
        </Button>
      </div>
    </form>
  </AppPanel>
</template>
