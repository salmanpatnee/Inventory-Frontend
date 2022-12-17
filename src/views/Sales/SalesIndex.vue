<script setup>
import { useSaleStore } from "@/stores/saleStore.js";
import { useRouter } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref, watch } from "vue";

const saleStore = useSaleStore();
const router = useRouter();
const { confirmAtts, flashSuccess, flashError } = useFlash();
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "created_at", order: "asc" });

const columns = [
  { path: "id", label: "Invoice No", sortable: true },
  { path: "created_at", label: "Date", sortable: true },
  { path: "customer_id", label: "Customer Name" },
  { path: "grand_total", label: "Total", sortable: true },
  { path: "status", label: "Status" },
  { path: "due", label: "Due", sortable: true },
  { path: "", label: "Action" },
];

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
  const { order, path } = sortColumn.value;
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await saleStore.getSales(params);
};
const handleDelete = async (id) => {
  const originalSales = sales.value.data;
  sales.value.data = originalSales.filter((sale) => sale.id !== id);

  Swal.fire(confirmAtts())
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await saleStore.deleteSale(id);
        if (response.status === "success") flashSuccess(response.message);
      } else {
        sales.value.data = originalSales;
      }
    })
    .catch((error) => flashError());
};

const handleShow = (id) => {
  router.push({ name: "sales.show", params: { id: id } });
};
const handleEdit = (id) => {
  router.push({ name: "sales.edit", params: { id: id } });
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getSales();
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
          <tr v-for="sale in sales.data" :key="sale.id">
            <td>#{{ sale.invoice_no }}</td>
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
                class="btn btn-sm btn-primary mr-2"
              >
                <i class="fas fa-fw fa-eye"></i>
              </button>
              <button
                @click="handleEdit(sale.id)"
                type="button"
                class="btn btn-sm btn-info mr-2"
              >
                <i class="fas fa-fw fa-edit"></i>
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
  </AppPanel>
</template>
