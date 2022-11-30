<script setup>
import { useCategoryStore } from "@/stores/categoryStore.js";
import { useRouter } from "vue-router";
import { ref, watch, computed, onMounted } from "vue";

const categoryStore = useCategoryStore();
const paginate = ref(10);
const search = ref("");
const router = useRouter();

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
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}`;
  await categoryStore.getCategories(params);
};
const handleDelete = async (id) => {
  const originalCategories = categories.value.data;
  categories.value.data = originalCategories.filter(
    (category) => category.id !== id
  );

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  })
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await categoryStore.deleteCategory(id);
        if (response.status === "success")
          Swal.fire("Deleted!", response.message, "success");
      } else {
        categories.value.data = originalCategories;
      }
    })
    .catch((error) => {
      Toast.fire({
        icon: "error",
        title: "An unexpected error occurred.",
      });
    });
};

const handleEdit = async (id) => {
  router.push({ name: "categories.edit", params: { id: id } });
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
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <div v-else>
      <div class="row">
        <div class="col-sm-2">
          <AppPaginateDropdown v-model="paginate" />
        </div>
        <div class="col-sm-6"></div>
        <div class="col-sm-4">
          <AppSearch v-model="search" />
        </div>
      </div>
      <div class="table-responsive">
        <table class="table align-items-center table-flush">
          <thead class="thead-light">
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
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
    </div>
  </AppPanel>
</template>
