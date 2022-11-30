<script setup>
import { useEmployeeStore } from "@/stores/employeeStore.js";
import { useRouter } from "vue-router";
import { ref, watch, computed, onMounted } from "vue";

const employeeStore = useEmployeeStore();
const paginate = ref(10);
const search = ref("");
const router = useRouter();

const employees = computed(() => employeeStore.employees.data);
const isLoading = computed(() => employeeStore.employees.isLoading);

watch(
  () => paginate.value,
  (newVal, oldVal) => {
    getEmployees();
  }
);
watch(
  () => search.value,
  (newTerm, oldTerm) => {
    getEmployees();
  }
);

const getEmployees = async (page = 1) => {
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}`;
  await employeeStore.getEmployees(params);
};

const handleDelete = async (id) => {
  //Removing from frontend
  const originalEmployees = employees.value.data;
  employees.value.data = originalEmployees.filter(
    (employee) => employee.id !== id
  );

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  })
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await employeeStore.deleteEmployee(id);
        if (response.status === "success")
          Swal.fire("Deleted!", response.message, "success");
      } else {
        employees.value.data = originalEmployees;
      }
    })
    .catch((error) => {
      Toast.fire({
        icon: "error",
        title: "An unexpected error occurred.",
      });
    });
};

const handleEdit = async (id) => {
  router.push({ name: "employees.edit", params: { id: id } });
};

onMounted(() => {
  getEmployees();
});
</script>
<template>
  <AppPageHeader title="All Employees">
    <router-link :to="{ name: 'employees.create' }" class="btn btn-primary">
      Add New Employee
    </router-link>
  </AppPageHeader>

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
    <div v-else>
      <div class="table-responsive">
        <table class="table align-items-center table-flush">
          <thead class="thead-light">
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Joining Date</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(employee, index) in employees.data" :key="employee.id">
              <td>{{ index + 1 }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.salary }}</td>
              <td><AppDate :timestamp="employee.joining_date" /></td>
              <td class="text-center">
                <button
                  @click="handleEdit(employee.id)"
                  type="button"
                  class="btn btn-sm btn-info mr-2"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(employee.id)"
                  type="button"
                  class="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <AppPagination
          :data="employees"
          @pagination-change-page="getEmployees"
        />
      </div>
    </div>
  </AppPanel>
</template>
