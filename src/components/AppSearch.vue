<script setup>
defineProps({
  label: {
    type: String,
    default: "Search",
  },
  modelValue: String,
});

let emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="align-items-center d-flex form-group row">
    <label for="search" class="col-form-label col-sm-4 text-right">
      {{ label }}
    </label>
    <div class="col-sm-8">
        <input
      id="search"
      type="text"
      @keyup="emit('update:modelValue', $event.target.value)"
      :value="modelValue"
      class="form-control form-control-sm"
    />
    </div>
   
  </div>
</template>
