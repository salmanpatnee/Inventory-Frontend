<script setup>
const { title } = defineProps({
  title: {
    type: String,
  },
});
</script>
<template>
  <div class="card mb-4">
    <div
      v-if="title"
      class="card-header py-3 d-flex flex-row align-items-center justify-content-between"
    >
      <h6 class="m-0 font-weight-bold text-primary">{{ title }}</h6>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>
