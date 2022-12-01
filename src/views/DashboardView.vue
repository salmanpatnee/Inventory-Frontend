<script setup>
import { useDashboardStore } from "@/stores/dashboardStore.js";
import { onMounted, computed } from "vue";

const dashboardStore = useDashboardStore();
const stats = computed(() => dashboardStore.stats.data);
const isLoading = computed(() => dashboardStore.stats.isLoading);

const getTodayStats = async () => {
  await dashboardStore.getTodayStats();
};

onMounted(async () => {
  await getTodayStats();
});
</script>
<template>
  <div class="d-sm-flex align-items-center justify-content-between mb-4">
    <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="./">Home</a></li>
      <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
    </ol>
  </div>

  <div class="row mb-3">
    <!-- Earnings (Monthly) Card Example -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card h-100">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col mr-2">
              <div class="text-xs font-weight-bold text-uppercase mb-1">
                Todays Sale
              </div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">
                ${{ stats.totalSales }}
              </div>
              <!-- <div class="mt-2 mb-0 text-muted text-xs">
                <span class="text-success mr-2"
                  ><i class="fa fa-arrow-up"></i> 3.48%</span
                >
                <span>Since last month</span>
              </div> -->
            </div>
            <div class="col-auto">
              <i class="fas fa-cart-plus fa-2x text-primary"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Earnings (Annual) Card Example -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card h-100">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs font-weight-bold text-uppercase mb-1">
                Todays Income
              </div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">
                ${{ stats.totalIncome }}
              </div>
              <!-- <div class="mt-2 mb-0 text-muted text-xs">
                <span class="text-success mr-2"
                  ><i class="fas fa-arrow-up"></i> 12%</span
                >
                <span>Since last years</span>
              </div> -->
            </div>
            <div class="col-auto">
              <i class="fas fa-shopping-cart fa-2x text-success"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- New User Card Example -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card h-100">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs font-weight-bold text-uppercase mb-1">
                Todays Due
              </div>
              <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                ${{ stats.totalDue }}
              </div>
              <!-- <div class="mt-2 mb-0 text-muted text-xs">
                <span class="text-success mr-2"
                  ><i class="fas fa-arrow-up"></i> 20.4%</span
                >
                <span>Since last month</span>
              </div> -->
            </div>
            <div class="col-auto">
              <i class="fas fa-money-bill fa-2x text-warning"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Pending Requests Card Example -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card h-100">
        <div class="card-body">
          <div class="row no-gutters align-items-center">
            <div class="col mr-2">
              <div class="text-xs font-weight-bold text-uppercase mb-1">
                Todays Expense
              </div>
              <div class="h5 mb-0 font-weight-bold text-gray-800">
                {{ stats.totalExpense }}
              </div>
              <!-- <div class="mt-2 mb-0 text-muted text-xs">
                <span class="text-danger mr-2"
                  ><i class="fas fa-arrow-down"></i> 1.10%</span
                >
                <span>Since yesterday</span>
              </div> -->
            </div>
            <div class="col-auto">
              <i class="fas fa-folder-minus fa-2x text-default"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Row-->

  <AppPanel title="Out of Stock Products">
    <div class="text-center alert alert-info" v-if="isLoading">Loading...</div>
    <div v-else class="table-responsive">
      <table class="table align-items-center table-flush">
        <thead class="thead-light">
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Code</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in stats.outOfStockProducts"
            :key="product.id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.code }}</td>
            <td v-if="product.category">{{ product.category.name }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppPanel>
</template>
