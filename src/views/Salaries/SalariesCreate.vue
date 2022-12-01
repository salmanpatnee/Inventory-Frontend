<script setup>
import { useEmployeeStore } from "@/stores/employeeStore.js";
import { useSalaryStore } from "@/stores/salaryStore.js";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import dayjs from "dayjs";

const employeeStore = useEmployeeStore();
const salaryStore = useSalaryStore();
const router = useRouter();
const route = useRoute();
const editMode = ref(false);

const employee = computed(() => employeeStore.currentEmployee.data);
const isLoading = computed(() => employeeStore.currentEmployee.isLoading);
const salary = computed(() => salaryStore.currentSalary.data);

const form = ref(
  new Form({
    id: null,
    name: null,
    salary: null,
    year: null,
  })
);

const pageHeaderTitle = computed(() => {
  return editMode.value ? "Update Salary" : "Pay Salary";
});

const getEmployee = async () => {
  await employeeStore.getEmployee(route.params.employee_id);
  form.value.fill(employee.value);
  form.value.employee_id = form.value.id;
  form.value.amount = form.value.salary;
  form.value.paid_date = dayjs().format("YYYY-MM-DD");
  form.value.month = "";
  form.value.year = dayjs().format("YYYY");
  isLoading.value = false;
};

const getSalary = async () => {
  await salaryStore.getSalary(route.params.id);
  form.value.fill(salary.value);

  form.value.employee_id = salary.value.employee.id;
  form.value.name = salary.value.employee.name;
  form.value.salary = salary.value.amount;
  form.value.amount = salary.value.amount;
  form.value.month = salary.value.month;
  form.value.year = salary.value.year;
  form.value.paid_date = dayjs(salary.value.paid_date).format("YYYY-MM-DD");

  isLoading.value = false;
};

const store = async () => {
  try {
    const { data: response } = await salaryStore.addSalary(form.value);
    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "salaries.pay.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: error.response.data.message,
    });
  }
};

const update = async () => {
  try {
    const { data: response } = await salaryStore.updateSalary(
      form.value,
      route.params.id
    );
    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "salaries.pay.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: error.response.data.message,
    });
  }
};

onMounted(() => {
  // Update Salary
  if (route.params.id) {
    getSalary();
    editMode.value = true;
  }
  // Add Salary
  else if (route.params.employee_id) {
    getEmployee();
  }
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle">
    <router-link :to="{ name: 'salaries.pay.index' }" class="btn btn-primary">
      Back
    </router-link>
  </AppPageHeader>
  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <form v-else @submit.prevent="editMode ? update() : store()">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              id="name"
              readonly
            />
            <HasError :form="form" field="name" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="salary">Salary</label>
            <input
              v-model="form.salary"
              type="number"
              class="form-control"
              id="salary"
              readonly
              :max="form.salary"
            />
            <HasError :form="form" field="salary" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="salary_month">Salary Month</label>
            <select v-model="form.month" class="form-control" id="salary_month">
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            <HasError :form="form" field="month" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="paid_date">Paid On:</label>
            <input
              v-model="form.paid_date"
              type="date"
              class="form-control"
              id="paid_date"
            />
            <HasError :form="form" field="paid_date" />
          </div>
        </div>
      </div>
      <div class="text-right">
        <Button class="btn btn-primary" :form="form">
          {{ editMode ? "Update" : "Pay" }}
        </Button>
      </div>
    </form>
  </AppPanel>
</template>
