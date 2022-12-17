<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["addToCart", "itemOutOfStock"]);
</script>

<template>
  <div
    class="card border product"
    @click="
      product.quantity
        ? $emit('addToCart', product)
        : $emit('itemOutOfStock')
    "
  >
    <img
      class="card-img-top"
      src="/src/assets/img/product.png"
      :alt="product.name"
    />
    <div class="card-body p-2">
      <h6 class="card-title text-center mb-1">{{ product.name }}</h6>
      <div class="text-center">
        <span v-if="product.quantity > 0" class="badge badge-success"
          >Available {{ product.quantity }}</span
        >
        <span v-else class="badge badge-danger">Out of Stock</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product {
  cursor: pointer;
}
</style>
