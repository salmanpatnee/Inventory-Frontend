<script setup>
import { useEmployeeStore } from "@/stores/employeeStore.js";
import { useRouter } from "vue-router";
import { ref, computed, onMounted, watch } from "vue";

const employeeStore = useEmployeeStore();
const router = useRouter();
const paginate = ref(10);
const search = ref("");

const employees = computed(() => employeeStore.employees.data);
const isLoading = computed(() => employeeStore.employees.isLoading);

watch(
  () => paginate.value,
  (newVal, prevVal) => {
    getEmployees();
  }
);
watch(
  () => search.value,
  (newTerm, prevTerm) => {
    getEmployees();
  }
);

const getEmployees = async (page = 1) => {
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}`;
  await employeeStore.getEmployees(params);
};

const handlePay = async (id) => {
  router.push({ name: "salaries.create", params: { employee_id: id } });
};

onMounted(() => {
  getEmployees();
});
</script>
<template>
  <AppPageHeader title="Add Salary"></AppPageHeader>

  <AppPanel>
    <div class="align-items-baseline d-flex row mb-3">
      <div class="col-sm-2">
        <AppPaginateDropdown v-model="paginate" />
      </div>
      <div class="col-sm-6 text-center">
        <!-- <button class="btn btn-outline-primary" @click="handleExportToExcel">
          <i class="fa fa-download" aria-hidden="true"></i> Export to Excel
        </button> -->
      </div>
      <div class="col-sm-4">
        <AppSearch v-model="search" />
      </div>
    </div>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <div v-else class="table-responsive">
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Salary</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in employees.data" :key="employee.id">
            <td>{{ index + 1 }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.salary }}</td>
            <td class="text-center">
              <button
                @click="handlePay(employee.id)"
                type="button"
                class="btn btn-sm btn-info mr-2"
              >
                Pay
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center mt-4">
      <AppPagination :data="employees" @pagination-change-page="getEmployees" />
    </div>
  </AppPanel>
</template>
