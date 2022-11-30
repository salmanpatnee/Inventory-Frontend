<script setup>
import http from "@/services/httpService";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);

const form = ref(
  new Form({
    quantity: 0,
  })
);

const getStock = async () => {
  const { data: response } = await http.get(
    `/api/stock/${route.params.id}`
  );

  form.value.quantity = response.stock
  isLoading.value = false;
};

const store = async () => {
  try {
    const { data: response } = await form.value.put(`/api/stock/${route.params.id}`);
    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "stock.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
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
