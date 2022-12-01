<script setup>
import { useProductStore } from "@/stores/productStore.js";
import { useRouter } from "vue-router";
import { ref, watch, onMounted, computed } from "vue";

const productStore = useProductStore();
const paginate = ref(10);
const search = ref("");
const router = useRouter();

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
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}`;
  await productStore.getProducts(params);
};
const handleDelete = async (id) => {
  const originalProducts = products.value.data;
  products.value.data = originalProducts.filter((product) => product.id !== id);

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
        const { data: response } = await productStore.deleteProduct(id);
        if (response.status === "success")
          Swal.fire("Deleted!", response.message, "success");
      } else {
        products.value.data = originalProducts;
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
  router.push({ name: "products.edit", params: { id: id } });
};

onMounted(async () => {
  await getProducts();
});
</script>
<template>
  <AppPageHeader title="All Products">
    <router-link :to="{ name: 'products.create' }" class="btn btn-primary">
      Add New Product
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
              <th>Name</th>
              <th>Code</th>
              <th>Category</th>
              <th>Price</th>
              <th>Qty</th>
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
              <td class="text-center">
                <button
                  @click="handleEdit(product.id)"
                  type="button"
                  class="btn btn-sm btn-info mr-2"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(product.id)"
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
        <AppPagination :data="products" @pagination-change-page="getProducts" />
      </div>
    </div>
  </AppPanel>
</template>
