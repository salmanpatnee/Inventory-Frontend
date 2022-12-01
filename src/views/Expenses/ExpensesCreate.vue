<script setup>
import { useExpenseStore } from "@/stores/expenseStore.js";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";

const expenseStore = useExpenseStore();
const router = useRouter();
const route = useRoute();
const editMode = ref(false);

const expense = computed(() => expenseStore.currentExpense.data);
const isLoading = computed(() => expenseStore.currentExpense.isLoading);

const form = ref(
  new Form({
    id: null,
    expense: null,
    amount: null,
  })
);

const pageHeaderTitle = computed(() => {
  return !editMode.value ? "Add New Expense" : "Edit Expense";
});

const getExpense = async () => {
  editMode.value = true;
  await expenseStore.getExpense(route.params.id);
  form.value.fill(expense.value);
};

const store = async () => {
  try {
    const { data: response } = await expenseStore.addExpense(form.value);
    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "expenses.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
  }
};

const update = async () => {
  try {
    const { data: response } = await expenseStore.updateExpense(
      form.value,
      route.params.id
    );

    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "expenses.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
  }
};
onMounted(() => {
  if (route.params.id) {
    getExpense();
  }
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle">
    <router-link :to="{ name: 'expenses.index' }" class="btn btn-primary">
      All Expenses
    </router-link>
  </AppPageHeader>
  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <form v-else @submit.prevent="editMode ? update() : store()">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="expense">Expense</label>
            <input
              v-model="form.expense"
              type="text"
              class="form-control"
              id="expense"
            />
            <HasError :form="form" field="expense" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="amount">Amount</label>
            <input
              v-model="form.amount"
              type="number"
              class="form-control"
              id="amount"
            />
            <HasError :form="form" field="amount" />
          </div>
        </div>
      </div>
      <div class="text-right">
        <Button class="btn btn-primary" :form="form">
          {{ editMode ? "Update Expense" : "Add New Expense" }}
        </Button>
      </div>
    </form>
  </AppPanel>
</template>
