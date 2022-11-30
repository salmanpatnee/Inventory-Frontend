<script setup>
import { ref } from "vue";

defineProps({
  pageSize: {
    type: Array,
    default: [10, 20, 50, 100],
  },
  label: {
    type: String,
    default: "Show",
  },
  modelValue: Number,
});

let emit = defineEmits(["update:modelValue"]);

const paginate = ref(10);
</script>

<template>
  <div class="align-items-center d-flex form-group row">
    <label for="paginateDropdown" class="col-sm-5 col-form-label">
      {{ label }}
    </label>
    <div class="col-sm-7">
      <select
        @change="emit('update:modelValue', $event.target.value)" 
        id="paginateDropdown"
        class="form-control form-control-sm"
      >
        <option
          v-for="size in pageSize"
          :key="size"
          :value="size"
          v-text="size"
        ></option>
      </select>
    </div>
  </div>
</template>
