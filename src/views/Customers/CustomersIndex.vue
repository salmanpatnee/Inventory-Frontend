<script setup>
import { useCustomerStore } from "@/stores/customerStore.js";
import { useRouter } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref, watch } from "vue";

const customerStore = useCustomerStore();
const router = useRouter();
const { confirmAtts, flashSuccess, flashError } = useFlash();
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "name", order: "asc" });

const columns = [
  { path: "#", label: "S.No" },
  { path: "name", label: "Name", sortable: true },
  { path: "email", label: "Email", sortable: true },
  { path: "total_spendings", label: "Total Spent", sortable: true },
  { path: "last_purchase_at", label: "Last Purchase", sortable: true },
  { path: "", label: "Action" },
];

const customers = computed(() => customerStore.customers.data);
const isLoading = computed(() => customerStore.customers.isLoading);

watch(
  () => paginate.value,
  (newVal, oldVal) => {
    getCustomers();
  }
);
watch(
  () => search.value,
  (newTerm, oldTerm) => {
    getCustomers();
  }
);

const getCustomers = async (page = 1) => {
  const { order, path } = sortColumn.value;
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await customerStore.getCustomers(params);
};

const handleDelete = async (id) => {
  const originalCustomers = customers.value.data;
  customers.value.data = originalCustomers.filter(
    (customer) => customer.id !== id
  );

  Swal.fire(confirmAtts())
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await customerStore.deleteCustomer(id);
        if (response.status === "success") flashSuccess(response.message);
      } else {
        customers.value.data = originalCustomers;
      }
    })
    .catch((error) => flashError());
};

const handleEdit = async (id) => {
  router.push({ name: "customers.edit", params: { id: id } });
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getCustomers();
};

onMounted(() => {
  getCustomers();
});
</script>
<template>
  <AppPageHeader title="All Customers">
    <router-link :to="{ name: 'customers.create' }" class="btn btn-primary">
      Add New Customer
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
    <div class="table-responsive" v-else>
      <table class="table align-items-center table-flush">
        <AppTableHeader
          @onSort="handleSort"
          :columns="columns"
          :sortColumn="sortColumn"
        />
        <tbody>
          <tr v-for="(customer, index) in customers.data" :key="customer.id">
            <td>{{ index + 1 }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.total_spendings }}</td>
            <td><AppDate :timestamp="customer.last_purchase_at" /></td>
            <td class="text-center">
              <button
                @click="handleEdit(customer.id)"
                type="button"
                class="btn btn-sm btn-info mr-2"
              >
                Edit
              </button>
              <button
                @click="handleDelete(customer.id)"
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
      <AppPagination :data="customers" @pagination-change-page="getCustomers" />
    </div>
  </AppPanel>
</template>
