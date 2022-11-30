<script setup>
import http from "@/services/httpService";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const salaries = ref([]);
const year = ref(dayjs().format("YYYY"));
const isLoading = ref(true);
const router = useRouter();

const getSalaries = async (page = 1) => {
  const { data: response } = await http.get(`/api/salaries`);
  salaries.value = response;
  isLoading.value = false;
};

const handleShow = async (month) => {
  router.push({ name: "salaries.show", params: { month, year: year.value } });
};

onMounted(() => {
  getSalaries();
});
</script>
<template>
  <AppPageHeader title="All Salaries">
    <router-link :to="{ name: 'salaries.pay.index' }" class="btn btn-primary">
      Add Salary
    </router-link>
  </AppPageHeader>

  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <div v-else class="table-responsive">
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th>Month</th>
            <th>Year</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(salary, index) in salaries" :key="salary.id">
            <td>{{ salary.month }}</td>
            <td>{{ year }}</td>
            <td class="text-center">
              <button
                @click="handleShow(salary.month)"
                type="button"
                class="btn btn-sm btn-info mr-2"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppPanel>
</template>
