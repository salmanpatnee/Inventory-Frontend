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
  <tr>
    <td>{{ product.name }}</td>
    <td>{{ product.price }}</td>
    <td>{{ product.quantity }}</td>
    <td class="text-center">
      <button
        @click="
          product.quantity
            ? $emit('addToCart', product)
            : $emit('itemOutOfStock')
        "
        type="button"
        class="btn btn-sm btn-primary"
      >
        <div class="fa fa-plus"></div>
      </button>
    </td>
  </tr>
</template>
