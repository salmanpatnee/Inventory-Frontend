<script setup>
import { useCategoryStore } from "@/stores/categoryStore.js";
import Form from "vform";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";

const categoryStore = useCategoryStore();
const router = useRouter();
const route = useRoute();
const editMode = ref(false);

const category = computed(() => categoryStore.currentCategory.data);
const isLoading = computed(() => categoryStore.currentCategory.isLoading);

const form = ref(
  new Form({
    id: null,
    name: null,
  })
);

const pageHeaderTitle = computed(() => {
  return !editMode.value ? "Add New Category" : "Edit Category";
});

const getCategory = async () => {
  editMode.value = true;
  await categoryStore.getCategory(route.params.id);
  form.value.fill(category.value);
};

const store = async () => {
  try {
    const { data: response } = await categoryStore.addCategory(form.value);
    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "categories.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
  }
};

const update = async () => {
  try {
    const { data: response } = await categoryStore.updateCategory(
      form.value,
      route.params.id
    );

    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "categories.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
  }
};
onMounted(() => {
  if (route.params.id) {
    getCategory();
  }
});
</script>
<template>
  <AppPageHeader :title="pageHeaderTitle">
    <router-link :to="{ name: 'categories.index' }" class="btn btn-primary">
      All Categories
    </router-link>
  </AppPageHeader>
  <AppPanel>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <form v-else @submit.prevent="editMode ? update() : store()">
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              id="name"
            />
            <HasError :form="form" field="name" />
          </div>
        </div>
      </div>
      <div class="text-right">
        <Button class="btn btn-primary" :form="form">
          {{ editMode ? "Update Category" : "Add New Category" }}
        </Button>
      </div>
    </form>
  </AppPanel>
</template>
