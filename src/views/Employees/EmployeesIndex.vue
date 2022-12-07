<script setup>
import { useEmployeeStore } from "@/stores/employeeStore.js";
import { useRouter } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref, watch } from "vue";

const employeeStore = useEmployeeStore();
const router = useRouter();
const { confirmAtts, flashSuccess, flashError } = useFlash();
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "name", order: "asc" });

const columns = [
  { path: "#", label: "S.No" },
  { path: "name", label: "Name", sortable: true },
  { path: "email", label: "Email", sortable: true },
  { path: "salary", label: "Salary", sortable: true },
  { path: "joining_date", label: "Joining Date", sortable: true },
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

const handleDelete = async (id) => {
  //Removing from frontend
  const originalEmployees = employees.value.data;
  employees.value.data = originalEmployees.filter(
    (employee) => employee.id !== id
  );

  Swal.fire(confirmAtts())
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await employeeStore.deleteEmployee(id);
        if (response.status === "success")
        flashSuccess(response.message)
      } else {
        employees.value.data = originalEmployees;
      }
    })
    .catch((error) => flashError());
};

const handleEdit = async (id) => {
  router.push({ name: "employees.edit", params: { id: id } });
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
  <AppPageHeader title="All Employees">
    <router-link :to="{ name: 'employees.create' }" class="btn btn-primary">
      Add New Employee
    </router-link>
  </AppPageHeader>

  <AppPanel>
    <div class="align-items-baseline d-flex row">
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
          <AppTableHeader
            @onSort="handleSort"
            :columns="columns"
            :sortColumn="sortColumn"
          />
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
