<script setup>
import { useProductStore } from "@/stores/productStore.js";
import { useRouter } from "vue-router";
import { onMounted, computed, ref, watch } from "vue";

const productStore = useProductStore();
const router = useRouter();
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "name", order: "asc" });

const columns = [
  { path: "#", label: "S.No" },
  { path: "name", label: "Name", sortable: true },
  { path: "code", label: "Code" },
  { path: "category_id", label: "Category" },
  { path: "price", label: "Price", sortable: true },
  { path: "quantity", label: "Stock", sortable: true },
  { path: "status", label: "Status" },
  { path: "", label: "Action" },
];

const products = computed(() => productStore.products.data);
const isLoading = computed(() => productStore.products.isLoading);

watch(
  () => paginate.value,
  (newVal, prevVal) => {
    getProducts();
  }
);
watch(
  () => search.value,
  (newTerm, prevTerm) => {
    getProducts();
  }
);

const getProducts = async (page = 1) => {
  const { order, path } = sortColumn.value;
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await productStore.getProducts(params);
};

const handleEdit = async (id) => {
  router.push({ name: "stock.edit", params: { id: id } });
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getProducts();
};

onMounted(async () => {
  await getProducts();
});
</script>
<template>
  <AppPageHeader title="Product Stock"> </AppPageHeader>

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
          <tr v-for="(product, index) in products.data" :key="product.id">
            <td>{{ index + 1 }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.code }}</td>
            <td v-if="product.category">{{ product.category.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.quantity }}</td>
            <td>
              <span v-if="product.quantity > 0" class="badge badge-success"
                >Available</span
              >
              <span v-else class="badge badge-danger">Out of Stock</span>
            </td>
            <td class="text-center">
              <button
                @click="handleEdit(product.id)"
                type="button"
                class="btn btn-sm btn-info mr-2"
              >
                Update Stock
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center mt-4">
      <AppPagination :data="products" @pagination-change-page="getProducts" />
    </div>
  </AppPanel>
</template>
