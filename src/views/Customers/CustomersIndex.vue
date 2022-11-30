<script setup>
import { useCustomerStore } from "@/stores/customerStore.js";
import { useRouter } from "vue-router";
import { ref, watch, computed, onMounted } from "vue";

const customerStore = useCustomerStore();
const paginate = ref(10);
const search = ref("");
const router = useRouter();

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
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}`;
  await customerStore.getCustomers(params);
};

const handleDelete = async (id) => {
  const originalCustomers = customers.value.data;
  customers.value.data = originalCustomers.filter(
    (customer) => customer.id !== id
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
        const { data: response } = await customerStore.deleteCustomer(id);
        if (response.status === "success")
          Swal.fire("Deleted!", response.message, "success");
      } else {
        customers.value.data = originalCustomers;
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
  router.push({ name: "customers.edit", params: { id: id } });
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
              <th>S. No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Total Spent</th>
              <th>Last Purchase</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
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
        <AppPagination
          :data="customers"
          @pagination-change-page="getCustomers"
        />
      </div>
    </div>
  </AppPanel>
</template>
