<script setup>
import { useSaleStore } from "@/stores/saleStore.js";
import { useRouter } from "vue-router";
import { ref, watch, computed, onMounted } from "vue";

const saleStore = useSaleStore();
const paginate = ref(10);
const search = ref("");
const router = useRouter();

const sales = computed(() => saleStore.sales.data);
const isLoading = computed(() => saleStore.sales.isLoading);

watch(
  () => paginate.value,
  (newVal, oldVal) => {
    getSales();
  }
);
watch(
  () => search.value,
  (newTerm, oldTerm) => {
    getSales();
  }
);

const getSales = async (page = 1) => {
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}`;
  await saleStore.getSales(params);
};
const handleDelete = async (id) => {
  const originalSales = sales.value.data;
  sales.value.data = originalSales.filter((sale) => sale.id !== id);

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
        const { data: response } = await saleStore.deleteSale(id);
        if (response.status === "success")
          Swal.fire("Deleted!", response.message, "success");
      } else {
        sales.value.data = originalSales;
      }
    })
    .catch((error) => {
      Toast.fire({
        icon: "error",
        title: "An unexpected error occurred.",
      });
    });
};

const handleShow = async (id) => {
  router.push({ name: "sales.show", params: { id: id } });
};

onMounted(async () => {
  await getSales();
});
</script>
<template>
  <AppPageHeader title="All Sales">
    <router-link :to="{ name: 'pos.index' }" class="btn btn-primary">
      Add New Sale
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
              <th>Invoice No</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Total</th>
              <th>Status</th>
              <th>Due</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sales.data" :key="sale.id">
              <td>#{{ sale.id }}</td>
              <td><AppDate :timestamp="sale.date" /></td>
              <td>{{ sale.customer.name }}</td>
              <td>{{ sale.grand_total }}</td>
              <td>
                <span
                  :class="
                    sale.status === 'paid' ? 'badge-success' : 'badge-warning'
                  "
                  class="badge text-capitalize"
                  >{{ sale.status }}</span
                >
              </td>
              <td>
                {{ sale.due }}
              </td>
              <td class="text-center">
                <button
                  @click="handleShow(sale.id)"
                  type="button"
                  class="btn btn-sm btn-info mr-2"
                >
                  <i class="fas fa-fw fa-eye"></i>
                </button>
                <button
                  @click="handleDelete(sale.id)"
                  type="button"
                  class="btn btn-sm btn-danger"
                >
                  <i class="fas fa-fw fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <AppPagination :data="sales" @pagination-change-page="getSales" />
      </div>
    </div>
  </AppPanel>
</template>
