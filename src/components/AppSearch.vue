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
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text" id="seller"
        ><i class="fa fa-search"></i
      ></span>
    </div>
    <input
      type="text"
      @keyup="emit('update:modelValue', $event.target.value)"
      :value="modelValue"
      :placeholder="label"
      class="form-control form-control-sm"
    />
  </div>
</template>
