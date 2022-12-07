<script setup>
import { useExpenseStore } from "@/stores/expenseStore.js";
import { useRouter } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref, watch } from "vue";

const expenseStore = useExpenseStore();
const { confirmAtts, flashSuccess, flashError } = useFlash();
const router = useRouter();
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "created_at", order: "asc" });

const columns = [
  { path: "#", label: "S.No" },
  { path: "created_at", label: "Date", sortable: true },
  { path: "expense", label: "Expense" },
  { path: "amount", label: "Amount", sortable: true },
  { path: "", label: "Action" },
];

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
  const { order, path } = sortColumn.value;
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await expenseStore.getExpenses(params);
};

const handleDelete = async (id) => {
  const originalExpenses = expenses.value.data;
  expenses.value.data = originalExpenses.filter((expense) => expense.id !== id);

  Swal.fire(confirmAtts())
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await expenseStore.deleteExpense(id);
        if (response.status === "success") flashSuccess(response.message);
      } else {
        expenses.value.data = originalExpenses;
      }
    })
    .catch((error) => flashError());
};

const handleEdit = async (id) => {
  router.push({ name: "expenses.edit", params: { id: id } });
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getExpenses();
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
  </AppPanel>
</template>
