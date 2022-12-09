<script setup>
import NavItem from "@/components/NavItem.vue";
</script>
<template>
  <ul class="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
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
    <nav-item id="user" iconClass="fa-user-friends" label="Users">
      <router-link :to="{ name: 'users.create' }" class="collapse-item"
        >Add User</router-link
      >
      <router-link :to="{ name: 'users.index' }" class="collapse-item"
        >All Users</router-link
      >
    </nav-item>
    <nav-item id="employee" iconClass="fa-users" label="Employees">
      <router-link :to="{ name: 'employees.create' }" class="collapse-item"
        >Add Employee</router-link
      >
      <router-link :to="{ name: 'employees.index' }" class="collapse-item"
        >All Employees</router-link
      >
    </nav-item>

    <nav-item id="supplier" iconClass="fa-user-circle" label="Suppliers">
      <router-link :to="{ name: 'suppliers.create' }" class="collapse-item"
        >Add Supplier</router-link
      >
      <router-link :to="{ name: 'suppliers.index' }" class="collapse-item"
        >All Suppliers</router-link
      >
    </nav-item>

    <nav-item id="customer" iconClass="fa-user" label="Customers">
      <router-link :to="{ name: 'customers.create' }" class="collapse-item"
        >Add Customer</router-link
      >
      <router-link :to="{ name: 'customers.index' }" class="collapse-item"
        >All Customers</router-link
      >
    </nav-item>

    <nav-item id="category" iconClass="fa-th-large" label="Categories">
      <router-link :to="{ name: 'categories.create' }" class="collapse-item"
        >Add Category</router-link
      >
      <router-link :to="{ name: 'categories.index' }" class="collapse-item"
        >All Categories</router-link
      >
    </nav-item>

    <nav-item id="product" iconClass="fa-archive" label="Products">
      <router-link :to="{ name: 'products.create' }" class="collapse-item"
        >Add Product</router-link
      >
      <router-link :to="{ name: 'products.index' }" class="collapse-item"
        >All Products</router-link
      >
    </nav-item>

    <nav-item id="sale" iconClass="fa-arrow-circle-up" label="Sales">
      <router-link :to="{ name: 'sales.index' }" class="collapse-item"
        >All Sales</router-link
      >
    </nav-item>

    <nav-item id="stock" iconClass="fa-truck" label="Stock">
      <router-link :to="{ name: 'stock.index' }" class="collapse-item"
        >Stock</router-link
      >
    </nav-item>

    <nav-item id="expense" iconClass="fa-minus-circle" label="Expenses">
      <router-link :to="{ name: 'expenses.create' }" class="collapse-item"
        >Add Expense</router-link
      >
      <router-link :to="{ name: 'expenses.index' }" class="collapse-item"
        >All Expenses</router-link
      >
    </nav-item>

    <nav-item id="salary" iconClass="fa-credit-card" label="Salaries">
      <router-link :to="{ name: 'salaries.pay.index' }" class="collapse-item"
        >Add Salary</router-link
      >
      <router-link :to="{ name: 'salaries.index' }" class="collapse-item"
        >All Salaries</router-link
      >
    </nav-item>
  </ul>
</template>
