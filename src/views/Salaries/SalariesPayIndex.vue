<script setup>
import http from "@/services/httpService";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const employees = ref([]);
const isLoading = ref(true);
const router = useRouter();

const getEmployees = async (page = 1) => {
  const params = `?page=${page}`;
  const { data: response } = await http.get(`/api/employees${params}`);
  employees.value = response;
  isLoading.value = false;
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
