<script setup>
import { useSupplierStore } from "@/stores/supplierStore.js";
import { useRouter } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref, watch } from "vue";

const supplierStore = useSupplierStore();
const router = useRouter();
const { confirmAtts, flashSuccess, flashError } = useFlash();
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "name", order: "asc" });

const columns = [
  { path: "#", label: "S.No" },
  { path: "name", label: "Name", sortable: true },
  { path: "phone", label: "Phone" },
  { path: "company", label: "Company" },
  { path: "", label: "Action" },
];

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
  const { order, path } = sortColumn.value;
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await supplierStore.getSuppliers(params);
};
const handleDelete = async (id) => {
  const originalSuppliers = suppliers.value.data;
  suppliers.value.data = originalSuppliers.filter(
    (supplier) => supplier.id !== id
  );

  Swal.fire(confirmAtts())
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await supplierStore.deleteSupplier(id);
        if (response.status === "success")
        flashSuccess(response.message)
      } else {
        suppliers.value.data = originalSuppliers;
      }
    })
    .catch((error) => flashError());
};

const handleEdit = async (id) => {
  router.push({ name: "suppliers.edit", params: { id: id } });
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getSuppliers();
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
      <AppPagination :data="suppliers" @pagination-change-page="getSuppliers" />
    </div>
  </AppPanel>
</template>
