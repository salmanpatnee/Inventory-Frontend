<script setup>
import { useExpenseStore } from "@/stores/expenseStore.js";
import { useRouter } from "vue-router";
import { ref, watch, computed, onMounted } from "vue";

const expenseStore = useExpenseStore();
const paginate = ref(10);
const search = ref("");
const router = useRouter();

const expenses = computed(() => expenseStore.expenses.data);
const isLoading = computed(() => expenseStore.expenses.isLoading);

watch(
  () => paginate.value,
  (newVal, prevVal) => {
    getExpenses();
  }
);
watch(
  () => search.value,
  (newTerm, prevTerm) => {
    getExpenses();
  }
);

const getExpenses = async (page = 1) => {
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}`;
  await expenseStore.getExpenses(params);
};

const handleDelete = async (id) => {
  const originalExpenses = expenses.value.data;
  expenses.value.data = originalExpenses.filter((expense) => expense.id !== id);

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
        const { data: response } = await expenseStore.deleteExpense(id);
        if (response.status === "success")
          Swal.fire("Deleted!", response.message, "success");
      } else {
        expenses.value.data = originalExpenses;
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
  router.push({ name: "expenses.edit", params: { id: id } });
};

onMounted(() => {
  getExpenses();
});
</script>
<template>
  <AppPageHeader title="All Expenses">
    <router-link :to="{ name: 'expenses.create' }" class="btn btn-primary">
      Add New Expense
    </router-link>
  </AppPageHeader>

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
      <div class="table-responsive">
        <table class="table align-items-center table-flush">
          <thead class="thead-light">
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Expense</th>
              <th>Amount</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(expense, index) in expenses.data" :key="expense.id">
              <td>{{ index + 1 }}</td>
              <td><AppDate :timestamp="expense.date" /></td>
              <td>{{ expense.expense }}</td>
              <td>{{ expense.amount }}</td>
              <td class="text-center">
                <button
                  @click="handleEdit(expense.id)"
                  type="button"
                  class="btn btn-sm btn-info mr-2"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(expense.id)"
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
        <AppPagination :data="expenses" @pagination-change-page="getExpenses" />
      </div>
    </div>
  </AppPanel>
</template>
