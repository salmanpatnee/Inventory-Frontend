<script setup>
import { useSupplierStore } from "@/stores/supplierStore.js";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref } from "vue";

const supplierStore = useSupplierStore();
const router = useRouter();
const route = useRoute();
const { flashSuccess, flashError } = useFlash();
const editMode = ref(false);

const supplier = computed(() => supplierStore.currentSupplier.data);
const isLoading = computed(() => supplierStore.currentSupplier.isLoading);

const form = ref(
  new Form({
    id: null,
    name: null,
    email: null,
    phone: null,
    address: null,
    company: null,
  })
);

const pageHeaderTitle = computed(() => {
  return !editMode.value ? "Add New Supplier" : "Edit Supplier";
});

const getSupplier = async () => {
  editMode.value = true;
  await supplierStore.getSupplier(route.params.id);
  form.value.fill(supplier.value);
};

const store = async () => {
  try {
    const { data: response } = await supplierStore.addSupplier(form.value);
    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "suppliers.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};

const update = async () => {
  try {
    const { data: response } = await supplierStore.updateSupplier(
      form.value,
      route.params.id
    );

    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "suppliers.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};
onMounted(() => {
  if (route.params.id) {
    getSupplier();
  }
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle">
    <router-link :to="{ name: 'suppliers.index' }" class="btn btn-primary">
      All Suppliers
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
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="company">Company</label>
            <input
              v-model="form.company"
              type="text"
              class="form-control"
              id="company"
            />
            <HasError :form="form" field="company" />
          </div>
        </div>
        <div class="col"></div>
      </div>
      <div class="text-right">
        <Button class="btn btn-primary" :form="form">
          {{ editMode ? "Update Supplier" : "Add New Supplier" }}
        </Button>
      </div>
    </form>
  </AppPanel>
</template>
