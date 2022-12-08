<script setup>
import { useStockStore } from "@/stores/stockStore.js";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref } from "vue";

const stockStore = useStockStore();
const router = useRouter();
const route = useRoute();
const { flashSuccess, flashError } = useFlash();

const stock = computed(() => stockStore.currentStock.data);
const isLoading = computed(() => stockStore.currentStock.isLoading);

const form = ref(
  new Form({
    quantity: 0,
  })
);

const getStock = async () => {
  await stockStore.getStock(route.params.id);
  form.value.quantity = stock.value.stock;
};

const store = async () => {
  try {
    const { data: response } = await stockStore.updateStock(
      form.value,
      route.params.id
    );

    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "stock.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};

onMounted(() => {
  getStock();
});
</script>
<template>
  <AppPageHeader title="Update Stock">
    <router-link :to="{ name: 'stock.index' }" class="btn btn-primary">
      Back
    </router-link>
  </AppPageHeader>
  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <form v-else @submit.prevent="store">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="name">Quantity</label>
            <input
              v-model="form.quantity"
              type="number"
              class="form-control"
              id="quantity"
            />
            <HasError :form="form" field="quantity" />
          </div>
        </div>
      </div>
      <div class="text-right">
        <Button class="btn btn-primary" :form="form">
          Update Stock
        </Button>
      </div>
    </form>
  </AppPanel>
</template>
