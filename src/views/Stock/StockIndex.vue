<script setup>
import http from "@/services/httpService";
import { useRouter } from "vue-router";
import { ref, watch, onMounted } from "vue";

const products = ref([]);
const paginate = ref(10);
const search = ref("");
const isLoading = ref(true);
const router = useRouter();

watch(
  () => paginate.value,
  (paginate, prevCount) => {
    getProducts();
  }
);

watch(
  () => search.value,
  (paginate, prevCount) => {
    getProducts();
  }
);

const getProducts = async (page = 1) => {
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}`;
  const { data: response } = await http.get(`/api/products${params}`);
  products.value = response;
  isLoading.value = false;
};

const handleEdit = async (id) => {
  router.push({ name: "stock.edit", params: { id: id } });
};

onMounted(async () => {
  await getProducts();
});
</script>
<template>
  <AppPageHeader title="Product Stock"> </AppPageHeader>

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
              <th>Name</th>
              <th>Code</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
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
    </div>
  </AppPanel>
</template>
