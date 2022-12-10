<script setup>
import { useUserStore } from "@/stores/userStore.js";
import { useRouter } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import { computed, onMounted, ref, watch } from "vue";

const userStore = useUserStore();
const router = useRouter();
const { confirmAtts, flashSuccess, flashError } = useFlash();
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "name", order: "asc" });

const columns = [
  { path: "", label: "#" },
  { path: "name", label: "Name", sortable: true },
  { path: "email", label: "Email", sortable: true },
  { path: "joining_date", label: "Joining Date", sortable: true },
  { path: "active", label: "Status" },
  { path: "last_login_at", label: "Last Login" },
  { path: "", label: "Action" },
];

const users = computed(() => userStore.users.data);
const isLoading = computed(() => userStore.users.isLoading);

watch(
  () => paginate.value,
  (newVal, prevVal) => {
    getUsers();
  }
);
watch(
  () => search.value,
  (newTerm, prevTerm) => {
    getUsers();
  }
);

const getUsers = async (page = 1) => {
  const { order, path } = sortColumn.value;
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await userStore.getUsers(params);
};

const handleDelete = async (id) => {
  //Removing from frontend
  const originalUsers = users.value.data;
  users.value.data = originalUsers.filter((user) => user.id !== id);

  Swal.fire(confirmAtts())
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await userStore.deleteUser(id);
        if (response.status === "success") flashSuccess(response.message);
      } else {
        users.value.data = originalUsers;
      }
    })
    .catch((error) => flashError());
};

const handleEdit = async (id) => {
  router.push({ name: "users.edit", params: { id: id } });
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getUsers();
};

onMounted(() => {
  getUsers();
});
</script>
<template>
  <AppPageHeader title="All Users">
    <router-link
      :to="{ name: 'users.create' }"
      class="btn btn-primary btn-icon-split"
    >
      <span class="icon text-white-50">
        <i class="fas fa-plus-circle"></i>
      </span>
      <span class="text">Add New User</span>
    </router-link>
  </AppPageHeader>

  <AppPanel>
    <div class="align-items-baseline d-flex row">
      <div class="col-sm-2">
        <AppPaginateDropdown v-model="paginate" />
      </div>
      <div class="col-sm-6 text-center">
        <!-- <button class="btn btn-outline-primary" @click="handleExportToExcel">
          <i class="fa fa-download" aria-hidden="true"></i> Export to Excel
        </button> -->
      </div>
      <div class="col-sm-4">
        <AppSearch v-model="search" />
      </div>
    </div>
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <div v-else>
      <div class="table-responsive">
        <table class="table align-items-center table-flush">
          <AppTableHeader
            @onSort="handleSort"
            :columns="columns"
            :sortColumn="sortColumn"
          />
          <tbody>
            <tr v-for="(user, index) in users.data" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td><AppDate :timestamp="user.joining_date" /></td>
              <td>
                <span
                  :class="user.active ? 'badge-success' : 'badge-warning'"
                  class="badge text-capitalize"
                  >{{ user.active ? "Active" : "Inactive" }}</span
                >
              </td>
              <td>
                {{ user.last_login }}
              </td>
              <td class="text-center">
                <button
                  @click="handleEdit(user.id)"
                  type="button"
                  class="btn btn-primary btn-sm mr-2"
                >
                  <i class="fas fa-edit"></i>
                </button>
        
                <button
                  @click="handleDelete(user.id)"
                  type="button"
                  class="btn btn-danger btn-sm"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <AppPagination :data="users" @pagination-change-page="getUsers" />
      </div>
    </div>
  </AppPanel>
</template>
