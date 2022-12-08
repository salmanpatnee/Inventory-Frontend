<script setup>
import { useCustomerStore } from "@/stores/customerStore.js";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref } from "vue";

const customerStore = useCustomerStore();
const router = useRouter();
const route = useRoute();
const { flashSuccess, flashError } = useFlash();
const editMode = ref(false);

const customer = computed(() => customerStore.currentCustomer.data);
const isLoading = computed(() => customerStore.currentCustomer.isLoading);

const form = ref(
  new Form({
    id: null,
    name: null,
    email: null,
    phone: null,
    address: null,
  })
);

const pageHeaderTitle = computed(() => {
  return !editMode.value ? "Add New Customer" : "Edit Customer";
});

const getCustomer = async () => {
  editMode.value = true;
  await customerStore.getCustomer(route.params.id);
  form.value.fill(customer.value);
};

const store = async () => {
  try {
    const { data: response } = await customerStore.addCustomer(form.value);
    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "customers.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};

const update = async () => {
  try {
    const { data: response } = await customerStore.updateCustomer(
      form.value,
      route.params.id
    );

    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "customers.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};
onMounted(() => {
  if (route.params.id) {
    getCustomer();
  } else {
    isLoading.value = false;
  }
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle">
    <router-link :to="{ name: 'customers.index' }" class="btn btn-primary">
      All Customers
    </router-link>
  </AppPageHeader>
  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <form v-else @submit.prevent="editMode ? update() : store()">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              id="name"
            />
            <HasError :form="form" field="name" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              class="form-control"
              id="email"
            />
            <HasError :form="form" field="email" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-control"
              id="phone"
            />
            <HasError :form="form" field="phone" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="address">Address</label>
            <input
              v-model="form.address"
              type="text"
              class="form-control"
              id="address"
            />
            <HasError :form="form" field="address" />
          </div>
        </div>
      </div>
      <div class="text-right">
        <Button class="btn btn-primary" :form="form">
          {{ editMode ? "Update Customer" : "Add New Customer" }}
        </Button>
      </div>
    </form>
  </AppPanel>
</template>
