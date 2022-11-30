<script setup>
import { useSupplierStore } from "@/stores/supplierStore.js";
import { useRouter } from "vue-router";
import { ref, watch, computed, onMounted } from "vue";

const supplierStore = useSupplierStore();
const paginate = ref(10);
const search = ref("");
const router = useRouter();

const suppliers = computed(() => supplierStore.suppliers.data);
const isLoading = computed(() => supplierStore.suppliers.isLoading);

watch(
  () => paginate.value,
  (newVal, oldVal) => {
    getSuppliers();
  }
);
watch(
  () => search.value,
  (newTerm, oldTerm) => {
    getSuppliers();
  }
);

const getSuppliers = async (page = 1) => {
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}`;
  await supplierStore.getSuppliers(params);
};
const handleDelete = async (id) => {
  const originalSuppliers = suppliers.value.data;
  suppliers.value.data = originalSuppliers.filter(
    (supplier) => supplier.id !== id
  );

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
        const { data: response } = await supplierStore.deleteSupplier(id);
        if (response.status === "success")
          Swal.fire("Deleted!", response.message, "success");
      } else {
        suppliers.value.data = originalSuppliers;
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
  router.push({ name: "suppliers.edit", params: { id: id } });
};

onMounted(() => {
  getSuppliers();
});
</script>
<template>
  <AppPageHeader title="All Suppliers">
    <router-link :to="{ name: 'suppliers.create' }" class="btn btn-primary">
      Add New Supplier
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
              <th>Phone</th>
              <th>Company</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(supplier, index) in suppliers.data" :key="supplier.id">
              <td>{{ index + 1 }}</td>
              <td>{{ supplier.name }}</td>
              <td>{{ supplier.phone }}</td>
              <td>{{ supplier.company }}</td>
              <td class="text-center">
                <button
                  @click="handleEdit(supplier.id)"
                  type="button"
                  class="btn btn-sm btn-info mr-2"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(supplier.id)"
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
        <AppPagination
          :data="suppliers"
          @pagination-change-page="getSuppliers"
        />
      </div>
    </div>
  </AppPanel>
</template>
