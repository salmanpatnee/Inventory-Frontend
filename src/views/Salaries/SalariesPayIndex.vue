<script setup>
import { useEmployeeStore } from "@/stores/employeeStore.js";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";

const employeeStore = useEmployeeStore();
const router = useRouter();
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "name", order: "asc" });

const columns = [
  { path: "#", label: "S.No" },
  { path: "name", label: "Name", sortable: true },
  { path: "salary", label: "Salary", sortable: true },
  { path: "", label: "Action" },
];


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
  const { order, path } = sortColumn.value;
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await employeeStore.getEmployees(params);
};

const handlePay = async (id) => {
  router.push({ name: "salaries.create", params: { employee_id: id } });
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getEmployees();
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
        <AppTableHeader
          @onSort="handleSort"
          :columns="columns"
          :sortColumn="sortColumn"
        />
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
