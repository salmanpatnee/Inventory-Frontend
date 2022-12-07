<script setup>
import { useSalaryStore } from "@/stores/salaryStore.js";
import dayjs from "dayjs";
import { useRouter, useRoute } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";

const salaryStore = useSalaryStore();
const paginate = ref(10);
const router = useRouter();
const route = useRoute();
const search = ref("");
const year = ref(dayjs().format("YYYY"));
const sortColumn = ref({ path: "paid_date", order: "asc" });

const columns = [
  { path: "#", label: "S.No" },
  { path: "employee_id", label: "Name", sortable: true },
  { path: "paid_date", label: "Paid Date", sortable: true },
  { path: "amount", label: "Amount", sortable: true },
  { path: "month", label: "Month" },
  { path: "year", label: "Year" },
  { path: "", label: "Action" },
];

const salaries = computed(() => salaryStore.salaries.data);
const isLoading = computed(() => salaryStore.salaries.isLoading);

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
  const { order, path } = sortColumn.value;
  const { month, year } = route.params;
  const params = `?month=${month}&year=${year}&page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await salaryStore.getSalariesByMonth(params);
};

const handleEdit = async (id) => {
  router.push({ name: "salaries.edit", params: { id } });
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getSalaries();
};

onMounted(() => {
  getSalaries();
  year.value = route.params.year;
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle"></AppPageHeader>

  <AppPanel>
    <div class="row">
      <div class="col-sm-2">
        <AppPaginateDropdown v-model="paginate" />
      </div>
      <div class="col-sm-6"></div>
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
