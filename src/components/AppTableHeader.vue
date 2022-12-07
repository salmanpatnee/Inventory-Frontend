<script setup>
const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  sortColumn: {
    type: Object,
  },
});

const emit = defineEmits(["onSort"]);

const raiseSort = (path) => {
  const sortColumn = props.sortColumn;

  sortColumn.path = path;
  sortColumn.order = sortColumn.order == "desc" ? "asc" : "desc";

  emit("onSort", sortColumn);

  //===========Alternate approach===========
  /*
    if (sortColumn.value.path === path) {
        sortColumn.value.order = sortColumn.value.order === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn.value.path = path;
        sortColumn.value.order = 'asc';
    }
    */
};
</script>

<template>
  <thead class="bg-primary text-light">
    <tr>
      <th
        v-for="column in columns"
        :key="column.path"
        :class="{
          sortable: column.sortable,
          'text-center': column.label === 'Action',
        }"
        @click="column.sortable && raiseSort(column.path)"
      >
        {{ column.label }}

        <i
          v-show="sortColumn && sortColumn.order == 'asc' && sortColumn.path == column.path"
          class="fa fa-sort-down"
        ></i>
        <i
          v-show="sortColumn && sortColumn.order == 'desc' && sortColumn.path == column.path"
          class="fa fa-sort-up"
        ></i>
      </th>
    </tr>
  </thead>
</template>
<style scoped>
.sortable {
  cursor: pointer;
}
</style>
