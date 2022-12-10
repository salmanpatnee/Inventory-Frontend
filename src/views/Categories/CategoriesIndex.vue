<script setup>
import { useCategoryStore } from "@/stores/categoryStore.js";
import Form from "vform";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref, watch } from "vue";

const categoryStore = useCategoryStore();
const { confirmAtts, flashSuccess, flashError } = useFlash();
const editMode = ref(false);
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "name", order: "asc" });

const form = ref(
  new Form({
    id: null,
    name: null,
  })
);

const columns = [
  { path: "#", label: "S.No" },
  { path: "name", label: "Name", sortable: true },
  { path: "", label: "Products Count" },
  { path: "", label: "Action" },
];

const categories = computed(() => categoryStore.categories.data);
const isLoading = computed(() => categoryStore.categories.isLoading);
const category = computed(() => categoryStore.currentCategory.data);

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
const getCategory = async (id) => {
  editMode.value = true;
  await categoryStore.getCategory(id);
  form.value.fill(category.value);
  jQuery("#categoryModal").modal("show");
};

const store = async () => {
  try {
    const { data: response } = await categoryStore.addCategory(form.value);
    if (response.status === "success") {
      jQuery("#categoryModal").modal("hide");
      flashSuccess(response.message);
      await getCategories();
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};

const update = async () => {
  try {
    const { data: response } = await categoryStore.updateCategory(
      form.value,
      form.value.id
    );

    if (response.status === "success") {
      jQuery("#categoryModal").modal("hide");
      flashSuccess(response.message);
      await getCategories();
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
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
        if (response.status === "success") flashSuccess(response.message);
      } else {
        categories.value.data = originalCategories;
      }
    })
    .catch((error) => flashError());
};

const handleEdit = async (id) => {
  await getCategory(id);
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getCategories();
};

onMounted(async () => {
  await getCategories();
});
</script>
<template>
  <AppPageHeader title="All Categories">
    <button
      type="button"
      class="btn btn-primary btn-icon-split"
      data-toggle="modal"
      data-target="#categoryModal"
      id="#modalCenter"
    >
      <span class="icon text-white-50">
        <i class="fas fa-plus-circle"></i>
      </span>
      <span class="text">Add New Category</span>
    </button>
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
            <td>{{ category.products_count }}</td>
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

  <!-- Modal Center -->
  <div
    class="modal fade"
    id="categoryModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="categoryModalTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <form @submit.prevent="editMode ? update() : store()">
          <div class="modal-header bg-primary text-light">
            <h5 class="modal-title" id="categoryModalTitle">
              Add Category
            </h5>
            <button
              type="button"
              class="close text-light"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
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
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-primary"
              data-dismiss="modal"
            >
              Close
            </button>
            <Button class="btn btn-primary" :form="form">
              {{ editMode ? "Update" : "Add" }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
