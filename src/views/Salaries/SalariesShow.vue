<script setup>
import http from "@/services/httpService";
import dayjs from "dayjs";
import { useRouter, useRoute } from "vue-router";
import { ref, computed, watch, onMounted } from "vue";

const salaries = ref([]);
const paginate = ref(10);
const search = ref("");
const year = ref(dayjs().format("YYYY"));
const isLoading = ref(true);
const router = useRouter();
const route = useRoute();

const pageHeaderTitle = computed(() => {
  return `Salaries: ${route.params.month} ${year.value}`;
});

watch(
  () => paginate.value,
  (paginate, prevCount) => {
    getSalaries();
  }
);

watch(
  () => search.value,
  (newTerm, oldTerm) => {
    getSalaries();
  }
);

const getSalaries = async (page = 1) => {
  const { month, year } = route.params;
  const params = `?month=${month}&year=${year}&page=${page}&paginate=${paginate.value}&search=${search.value}`;
  const { data: response } = await http.get(`/api/salaries/month${params}`);
  salaries.value = response;
  isLoading.value = false;
};

const handleEdit = async (id) => {
  router.push({ name: "salaries.edit", params: { id } });
};

onMounted(() => {
  getSalaries();
  year.value = route.params.year;
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle"></AppPageHeader>

  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <div v-else>
      <div class="row">
        <div class="col-sm-2">
          <AppPaginateDropdown v-model="paginate" />
        </div>
        <div class="col-sm-6"></div>
        <div class="col-sm-4">
          <AppSearch v-model="search" />
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Paid Date</th>
            <th>Amount</th>
            <th>Month</th>
            <th>Year</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(salary, index) in salaries.data" :key="salary.id">
            <td>{{ index + 1 }}</td>
            <td>{{ salary.employee.name }}</td>
            <td><AppDate :timestamp="salary.paid_date" /></td>
            <td>{{ salary.amount }}</td>
            <td>{{ salary.month }}</td>
            <td>{{ salary.year }}</td>
            <td class="text-center">
              <button
                @click="handleEdit(salary.id)"
                type="button"
                class="btn btn-sm btn-info mr-2"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center mt-4">
      <AppPagination :data="salaries" @pagination-change-page="getSalaries" />
    </div>
  </AppPanel>
</template>
