<script setup>
import { useSaleStore } from "@/stores/saleStore.js";
import { useRoute } from "vue-router";
import { computed, onMounted, ref } from "vue";

const saleStore = useSaleStore();
const route = useRoute();

const sale = computed(() => saleStore.currentSale.data);
const isLoading = computed(() => saleStore.currentSale.isLoading);

const getSale = async () => {
  await saleStore.getSale(route.params.id);
};

onMounted(async () => {
  await getSale();
});
</script>
<template>
  <AppPageHeader title="Sale Details">
    <router-link :to="{ name: 'sales.index' }" class="btn btn-primary">
      All Sales
    </router-link>
  </AppPageHeader>

  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <div v-else>
      <div class="row">
        <div class="col">
          <AppPanel title="Customer Details">
            <ul class="list-group mb-4" v-if="sale.customer">
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                Name:
                <span class=""
                  ><b>{{ sale.customer.name }}</b></span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                Email:
                <span class=""
                  ><b>{{ sale.customer.email }}</b></span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                Phone:
                <span class=""
                  ><b>{{ sale.customer.phone }}</b></span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                Address:
                <span class=""
                  ><b>{{ sale.customer.address }}</b></span
                >
              </li>
            </ul>
          </AppPanel>
        </div>
        <div class="col">
          <AppPanel title="Order Details">
            <ul class="list-group mb-4">
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                Total Items:
                <span class=""
                  ><b>{{ sale.total_quantities }}</b></span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                Sub Total:
                <span class=""
                  ><b>{{ sale.sub_total }}</b></span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                VAT Rate:
                <span class=""
                  ><b>{{ sale.vat }}</b></span
                >
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                Total:
                <span class=""
                  ><b>{{ sale.grand_total }}</b></span
                >
              </li>
            </ul>
          </AppPanel>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <AppPanel title="Order Items Detail">
            <div class="table-responsive">
              <table class="table">
                <thead class="bg-primary text-light">
                  <tr>
                    <th>Product</th>
                    <th>Code</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detail in sale.details" :key="detail.id">
                    <td>{{ detail.product.name }}</td>
                    <td>{{ detail.product.code }}</td>
                    <td>{{ detail.quantity }}</td>
                    <td>{{ detail.unit_price }}</td>
                    <td>{{ detail.sub_total }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AppPanel>
        </div>
      </div>
    </div>
  </AppPanel>
</template>
