<script setup>
import http from "@/services/httpService";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";

const router = useRouter();
const route = useRoute();
const editMode = ref(false);
const isLoading = ref(true);

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
  const { data: response } = await http.get(
    `/api/expenses/${route.params.id}`
  );
  form.value.fill(response.data);
  isLoading.value = false;
};

const store = async () => {
  try {
    const { data: response } = await form.value.post(`/api/expenses`);
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
    const { data: response } = await form.value.put(
      `/api/expenses/${route.params.id}`
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
  } else {
    isLoading.value = false;
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
