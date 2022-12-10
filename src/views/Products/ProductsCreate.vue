<script setup>
import { useProductStore } from "@/stores/productStore.js";
import { useCategoryStore } from "@/stores/categoryStore.js";
import { useSupplierStore } from "@/stores/supplierStore.js";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref } from "vue";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const supplierStore = useSupplierStore();
const router = useRouter();
const route = useRoute();
const { flashSuccess, flashError } = useFlash();
const editMode = ref(false);

const categories = computed(() => categoryStore.categories.data.data);
const suppliers = computed(() => supplierStore.suppliers.data.data);
const product = computed(() => productStore.currentProduct.data);
const isLoading = computed(() => productStore.currentProduct.isLoading);

const form = ref(
  new Form({
    id: null,
    name: null,
    code: null,
    category_id: "",
    supplier_id: "",
    root: null,
    cost: null,
    price: null,
    quantity: null,
    alert_quantity: null,
    purchase_date: null,
  })
);

const pageHeaderTitle = computed(() => {
  return !editMode.value ? "Add New Product" : "Edit Product";
});

const getCategories = async () => {
  await categoryStore.getCategories();
};
const getSuppliers = async () => {
  await supplierStore.getSuppliers();
};

const getProduct = async () => {
  editMode.value = true;
  await productStore.getProduct(route.params.id);
  form.value.fill(product.value);
};

const store = async () => {
  try {
    const { data: response } = await productStore.addProduct(form.value);
    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "products.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};

const update = async () => {
  try {
    const { data: response } = await productStore.updateProduct(
      form.value,
      route.params.id
    );

    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "products.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};
onMounted(async () => {
  if (route.params.id) {
    await getProduct();
  }
  await getCategories();
  await getSuppliers();
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle">
    <router-link :to="{ name: 'products.index' }" class="btn btn-primary">
      All Products
    </router-link>
  </AppPageHeader>
  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <form v-else @submit.prevent="editMode ? update() : store()">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="name">Name</label>
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
            <label for="code">Code</label>
            <input
              v-model="form.code"
              type="text"
              class="form-control"
              id="code"
            />
            <HasError :form="form" field="code" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="category">Category</label>
            <!-- <v-select v-model="form.category_id" label="name" :options="categories" :reduce="category => category.id"></v-select> -->
            <select
              v-model="form.category_id"
              class="form-control"
              id="category"
            >
              <option value="">Select Category</option>
              <option
                :value="category.id"
                v-for="category in categories"
                :key="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <HasError :form="form" field="category_id" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="supplier">Supplier</label>
            <select
              v-model="form.supplier_id"
              class="form-control"
              id="supplier"
            >
              <option value="">Select Supplier</option>
              <option
                :value="supplier.id"
                v-for="supplier in suppliers"
                :key="supplier.id"
              >
                {{ `${supplier.name} - (${supplier.company})` }}
              </option>
            </select>
            <HasError :form="form" field="supplier_id" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="cost">Cost</label>
            <input
              v-model="form.cost"
              type="number"
              class="form-control"
              id="cost"
            />
            <HasError :form="form" field="cost" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="price">Price</label>
            <input
              v-model="form.price"
              type="number"
              class="form-control"
              id="price"
            />
            <HasError :form="form" field="price" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="root">Root</label>
            <input
              v-model="form.root"
              type="text"
              class="form-control"
              id="root"
            />
            <HasError :form="form" field="root" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="quantity">Quantity</label>
            <input
              v-model="form.quantity"
              type="number"
              class="form-control"
              id="quantity"
            />
            <HasError :form="form" field="quantity" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="alert_quantity">Alert Quantity</label>
            <input
              v-model="form.alert_quantity"
              type="number"
              class="form-control"
              id="alert_quantity"
            />
            <HasError :form="form" field="alert_quantity" />
          </div>
        </div>
        <div class="col">
          <div class="form-group">
            <label for="purchase_date">Purchase Date</label>
            <input
              v-model="form.purchase_date"
              type="date"
              class="form-control"
              id="purchase_date"
            />
            <HasError :form="form" field="purchase_date" />
          </div>
        </div>
        
      </div>
      <div class="text-right">
        <Button class="btn btn-primary" :form="form">
          {{ editMode ? "Update Product" : "Add New Product" }}
        </Button>
      </div>
    </form>
  </AppPanel>
</template>
<style scoped>
.vs__dropdown-toggle {
  height: 43px;
}
</style>
