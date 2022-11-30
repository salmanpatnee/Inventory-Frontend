<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { RouterView, RouterLink } from "vue-router";
import { computed } from "vue";

const authStore = useAuthStore();

const user = computed(() => {
  return authStore.user.data;
});

const handleLogout = async () => {
  try {
    const { data: response } = await authStore.logout();
    Toast.fire({
      icon: "success",
      title: response.message,
    });
    window.location = "/";
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <div id="wrapper">
    <!-- Sidebar -->
    <ul
      class="navbar-nav sidebar sidebar-light accordion"
      id="accordionSidebar"
    >
      <a
        class="sidebar-brand d-flex align-items-center justify-content-center"
        href="index.html"
      >
        <div class="sidebar-brand-icon">
          <img src="/src/assets/img/logo/logo2.png" />
        </div>
        <div class="sidebar-brand-text mx-3">RuangAdmin</div>
      </a>
      <hr class="sidebar-divider my-0" />
      <li class="nav-item active">
        <router-link :to="{ name: 'dashboard' }" class="nav-link">
          <i class="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </router-link>
      </li>
      <li class="nav-item active">
        <router-link :to="{ name: 'pos.index' }" class="nav-link">
          <i class="fa fa-cart-arrow-down" aria-hidden="true"></i>
          <span>POS</span>
        </router-link>
      </li>
      <hr class="sidebar-divider" />
      <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#employee"
          aria-expanded="true"
          aria-controls="employee"
        >
          <i class="fa fa-users" aria-hidden="true"></i>
          <span>Employees</span>
        </a>
        <div
          id="employee"
          class="collapse"
          aria-labelledby="headingBootstrap"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <router-link
              :to="{ name: 'employees.create' }"
              class="collapse-item"
              >Add Employee</router-link
            >
            <router-link :to="{ name: 'employees.index' }" class="collapse-item"
              >All Employees</router-link
            >
          </div>
        </div>
      </li>
      <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#suppliers"
          aria-expanded="true"
          aria-controls="suppliers"
        >
          <i class="fa fa-user-circle" aria-hidden="true"></i>
          <span>Suppliers</span>
        </a>
        <div
          id="suppliers"
          class="collapse"
          aria-labelledby="headingForm"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <router-link
              :to="{ name: 'suppliers.create' }"
              class="collapse-item"
              >Add Supplier</router-link
            >
            <router-link :to="{ name: 'suppliers.index' }" class="collapse-item"
              >All Suppliers</router-link
            >
          </div>
        </div>
      </li>
      <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#customers"
          aria-expanded="true"
          aria-controls="customers"
        >
          <i class="fa fa-user" aria-hidden="true"></i>
          <span>Customers</span>
        </a>
        <div
          id="customers"
          class="collapse"
          aria-labelledby="headingBootstrap"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <router-link
              :to="{ name: 'customers.create' }"
              class="collapse-item"
              >Add Customer</router-link
            >
            <router-link :to="{ name: 'customers.index' }" class="collapse-item"
              >All Customers</router-link
            >
          </div>
        </div>
      </li>
      <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#categories"
          aria-expanded="true"
          aria-controls="categories"
        >
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <span>Categories</span>
        </a>
        <div
          id="categories"
          class="collapse"
          aria-labelledby="headingTable"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <router-link
              :to="{ name: 'categories.create' }"
              class="collapse-item"
              >Add Category</router-link
            >
            <router-link
              :to="{ name: 'categories.index' }"
              class="collapse-item"
              >All Categories</router-link
            >
          </div>
        </div>
      </li>

      <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#products"
          aria-expanded="true"
          aria-controls="products"
        >
          <i class="fa fa-archive" aria-hidden="true"></i>
          <span>Products</span>
        </a>
        <div
          id="products"
          class="collapse"
          aria-labelledby="headingTable"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <router-link :to="{ name: 'products.create' }" class="collapse-item"
              >Add Product</router-link
            >
            <router-link :to="{ name: 'products.index' }" class="collapse-item"
              >All Products</router-link
            >
          </div>
        </div>
      </li>

      <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#sales"
          aria-expanded="true"
          aria-controls="sales"
        >
          <i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
          <span>Sales</span>
        </a>
        <div
          id="sales"
          class="collapse"
          aria-labelledby="headingTable"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <router-link :to="{ name: 'sales.index' }" class="collapse-item"
              >All Sales</router-link
            >
          </div>
        </div>
      </li>

      <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#stock"
          aria-expanded="true"
          aria-controls="stock"
        >
          <i class="fa fa-truck" aria-hidden="true"></i>
          <span>Stock</span>
        </a>
        <div
          id="stock"
          class="collapse"
          aria-labelledby="headingTable"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <router-link :to="{ name: 'stock.index' }" class="collapse-item"
              >Stock</router-link
            >
          </div>
        </div>
      </li>

      <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#expenses"
          aria-expanded="true"
          aria-controls="expenses"
        >
          <i class="fa fa-minus-circle" aria-hidden="true"></i>
          <span>Expenses</span>
        </a>
        <div
          id="expenses"
          class="collapse"
          aria-labelledby="headingTable"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <router-link :to="{ name: 'expenses.create' }" class="collapse-item"
              >Add Expense</router-link
            >
            <router-link :to="{ name: 'expenses.index' }" class="collapse-item"
              >All Expenses</router-link
            >
          </div>
        </div>
      </li>

      <li class="nav-item">
        <a
          class="nav-link collapsed"
          href="#"
          data-toggle="collapse"
          data-target="#salaries"
          aria-expanded="true"
          aria-controls="salaries"
        >
        <i class="fa fa-credit-card" aria-hidden="true"></i>
          <span>Salaries</span>
        </a>
        <div
          id="salaries"
          class="collapse"
          aria-labelledby="headingTable"
          data-parent="#accordionSidebar"
        >
          <div class="bg-white py-2 collapse-inner rounded">
            <router-link
              :to="{ name: 'salaries.pay.index' }"
              class="collapse-item"
              >Add Salary</router-link
            >
            <router-link :to="{ name: 'salaries.index' }" class="collapse-item"
              >All Salaries</router-link
            >
          </div>
        </div>
      </li>

      <div class="version" id="version-ruangadmin"></div>
    </ul>
    <!-- Sidebar -->
    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content">
        <!-- TopBar -->
        <nav
          class="navbar navbar-expand navbar-light bg-navbar topbar mb-4 static-top"
        >
          <button
            id="sidebarToggleTop"
            class="btn btn-link rounded-circle mr-3"
          >
            <i class="fa fa-bars"></i>
          </button>
          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown no-arrow">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="searchDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-search fa-fw"></i>
              </a>
              <div
                class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                aria-labelledby="searchDropdown"
              >
                <form class="navbar-search">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control bg-light border-1 small"
                      placeholder="What do you want to look for?"
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                      style="border-color: #3f51b5;"
                    />
                    <div class="input-group-append">
                      <button class="btn btn-primary" type="button">
                        <i class="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>
            <li class="nav-item dropdown no-arrow mx-1">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="alertsDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-bell fa-fw"></i>
                <span class="badge badge-danger badge-counter">3+</span>
              </a>
              <div
                class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="alertsDropdown"
              >
                <h6 class="dropdown-header">Alerts Center</h6>
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="mr-3">
                    <div class="icon-circle bg-primary">
                      <i class="fas fa-file-alt text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="small text-gray-500">December 12, 2019</div>
                    <span class="font-weight-bold"
                      >A new monthly report is ready to download!</span
                    >
                  </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="mr-3">
                    <div class="icon-circle bg-success">
                      <i class="fas fa-donate text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="small text-gray-500">December 7, 2019</div>
                    $290.29 has been deposited into your account!
                  </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="mr-3">
                    <div class="icon-circle bg-warning">
                      <i class="fas fa-exclamation-triangle text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="small text-gray-500">December 2, 2019</div>
                    Spending Alert: We've noticed unusually high spending for
                    your account.
                  </div>
                </a>
                <a
                  class="dropdown-item text-center small text-gray-500"
                  href="#"
                  >Show All Alerts</a
                >
              </div>
            </li>
            <li class="nav-item dropdown no-arrow mx-1">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="messagesDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-envelope fa-fw"></i>
                <span class="badge badge-warning badge-counter">2</span>
              </a>
              <div
                class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="messagesDropdown"
              >
                <h6 class="dropdown-header">Message Center</h6>
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="dropdown-list-image mr-3">
                    <img
                      class="rounded-circle"
                      src="/src/assets/img/man.png"
                      style="max-width: 60px;"
                      alt=""
                    />
                    <div class="status-indicator bg-success"></div>
                  </div>
                  <div class="font-weight-bold">
                    <div class="text-truncate">
                      Hi there! I am wondering if you can help me with a problem
                      I've been having.
                    </div>
                    <div class="small text-gray-500">Udin Cilok · 58m</div>
                  </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="dropdown-list-image mr-3">
                    <img
                      class="rounded-circle"
                      src="/src/assets/img/girl.png"
                      style="max-width: 60px;"
                      alt=""
                    />
                    <div class="status-indicator bg-default"></div>
                  </div>
                  <div>
                    <div class="text-truncate">
                      Am I a good boy? The reason I ask is because someone told
                      me that people say this to all dogs, even if they aren't
                      good...
                    </div>
                    <div class="small text-gray-500">Jaenab · 2w</div>
                  </div>
                </a>
                <a
                  class="dropdown-item text-center small text-gray-500"
                  href="#"
                  >Read More Messages</a
                >
              </div>
            </li>
            <li class="nav-item dropdown no-arrow mx-1">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="messagesDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fas fa-tasks fa-fw"></i>
                <span class="badge badge-success badge-counter">3</span>
              </a>
              <div
                class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="messagesDropdown"
              >
                <h6 class="dropdown-header">Task</h6>
                <a class="dropdown-item align-items-center" href="#">
                  <div class="mb-3">
                    <div class="small text-gray-500">
                      Design Button
                      <div class="small float-right"><b>50%</b></div>
                    </div>
                    <div class="progress" style="height: 12px;">
                      <div
                        class="progress-bar bg-success"
                        role="progressbar"
                        style="width: 50%;"
                        aria-valuenow="50"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </a>
                <a class="dropdown-item align-items-center" href="#">
                  <div class="mb-3">
                    <div class="small text-gray-500">
                      Make Beautiful Transitions
                      <div class="small float-right"><b>30%</b></div>
                    </div>
                    <div class="progress" style="height: 12px;">
                      <div
                        class="progress-bar bg-warning"
                        role="progressbar"
                        style="width: 30%;"
                        aria-valuenow="30"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </a>
                <a class="dropdown-item align-items-center" href="#">
                  <div class="mb-3">
                    <div class="small text-gray-500">
                      Create Pie Chart
                      <div class="small float-right"><b>75%</b></div>
                    </div>
                    <div class="progress" style="height: 12px;">
                      <div
                        class="progress-bar bg-danger"
                        role="progressbar"
                        style="width: 75%;"
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </a>
                <a
                  class="dropdown-item text-center small text-gray-500"
                  href="#"
                  >View All Taks</a
                >
              </div>
            </li>
            <div class="topbar-divider d-none d-sm-block"></div>
            <li class="nav-item dropdown no-arrow">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  class="img-profile rounded-circle"
                  src="/src/assets/img/boy.png"
                  style="max-width: 60px;"
                />
                <span class="ml-2 d-none d-lg-inline text-white small">{{
                  user.name
                }}</span>
              </a>
              <div
                class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                aria-labelledby="userDropdown"
              >
                <a class="dropdown-item" href="#">
                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                  Settings
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                  Activity Log
                </a>
                <div class="dropdown-divider"></div>
                <a
                  class="dropdown-item"
                  href="javascript:void(0);"
                  @click.prevent="handleLogout"
                >
                  <i
                    class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"
                  ></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>
        <!-- Topbar -->

        <!-- Container Fluid-->
        <div class="container-fluid" id="container-wrapper">
          <RouterView />
        </div>
        <!---Container Fluid-->
      </div>
    </div>
  </div>

  <!-- Scroll to top -->
  <a class="scroll-to-top rounded" href="#page-top">
    <i class="fas fa-angle-up"></i>
  </a>
</template>
