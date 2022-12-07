<script setup>
import { useCategoryStore } from "@/stores/categoryStore.js";
import { useRouter } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref, watch } from "vue";

const categoryStore = useCategoryStore();
const router = useRouter();
const { confirmAtts, flashSuccess, flashError } = useFlash();
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "name", order: "asc" });

const columns = [
  { path: "#", label: "S.No" },
  { path: "name", label: "Name", sortable: true },
  { path: "", label: "Action" },
];

const categories = computed(() => categoryStore.categories.data);
const isLoading = computed(() => categoryStore.categories.isLoading);

watch(
  () => paginate.value,
  (newVal, prevVal) => {
    getCategories();
  }
);
watch(
  () => search.value,
  (newTerm, prevterm) => {
    getCategories();
  }
);

const getCategories = async (page = 1) => {
  const { order, path } = sortColumn.value;
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await categoryStore.getCategories(params);
};
const handleDelete = async (id) => {
  const originalCategories = categories.value.data;
  categories.value.data = originalCategories.filter(
    (category) => category.id !== id
  );

  Swal.fire(confirmAtts())
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await categoryStore.deleteCategory(id);
        if (response.status === "success")
        flashSuccess(response.message)
      } else {
        categories.value.data = originalCategories;
      }
    })
    .catch((error) => flashError());
};

const handleEdit = async (id) => {
  router.push({ name: "categories.edit", params: { id: id } });
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getCategories();
};

onMounted(() => {
  getCategories();
});
</script>
<template>
  <AppPageHeader title="All Categories">
    <router-link :to="{ name: 'categories.create' }" class="btn btn-primary">
      Add New Category
    </router-link>
  </AppPageHeader>

  <AppPanel>
    <div class="row">
      <div class="col-sm-2">
        <AppPaginateDropdown v-model="paginate" />
      </div>
      <div class="col-sm-6"></div>
      <div class="col-sm-4">
        <AppSearch v-model="search" />
      </div>
    </div>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <div v-else class="table-responsive">
      <table class="table align-items-center table-flush">
        <AppTableHeader
          @onSort="handleSort"
          :columns="columns"
          :sortColumn="sortColumn"
        />
        <tbody>
          <tr v-for="(category, index) in categories.data" :key="category.id">
            <td>{{ index + 1 }}</td>
            <td>{{ category.name }}</td>
            <td class="text-center">
              <button
                @click="handleEdit(category.id)"
                type="button"
                class="btn btn-sm btn-info mr-2"
              >
                Edit
              </button>
              <button
                @click="handleDelete(category.id)"
                type="button"
                class="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center mt-4">
      <AppPagination
        :data="categories"
        @pagination-change-page="getCategories"
      />
    </div>
  </AppPanel>
</template>
