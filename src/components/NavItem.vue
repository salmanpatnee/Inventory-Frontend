<script setup>
const {id, iconClass, label} = defineProps({
    id: {
        type: String, 
        required: true
    }, 
    iconClass: {
        type: String, 
        default: "fa-user-friends"
    }, 
    label: {
        type: String, 
        required: true
    }
});

</script>
<template>
  <li class="nav-item">
    <a
      class="nav-link collapsed"
      href="#"
      data-toggle="collapse"
      :data-target="`#${id}`"
      aria-expanded="true"
      :aria-controls="id"
    >
      <i :class="`fa ${iconClass}`" aria-hidden="true"></i>
      <span>{{label}}</span>
    </a>
    <div
      :id="id"
      class="collapse"
      aria-labelledby="headingBootstrap"
      data-parent="#accordionSidebar"
    >
      <div class="bg-white py-2 collapse-inner rounded">
        <slot></slot>
      </div>
    </div>
  </li>
</template>
