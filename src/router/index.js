import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import DefaultView from "@/views/DefaultView.vue";
import AuthView from "@/views/AuthView.vue";
import DashboardView from "@/views/DashboardView.vue";
import UsersIndex from "@/views/Users/UsersIndex.vue";
import UsersCreate from "@/views/Users/UsersCreate.vue";
import EmployeesIndex from "@/views/Employees/EmployeesIndex.vue";
import EmployeesCreate from "@/views/Employees/EmployeesCreate.vue";
import SuppliersIndex from "@/views/Suppliers/SuppliersIndex.vue";
import SuppliersCreate from "@/views/Suppliers/SuppliersCreate.vue";
import CategoriesIndex from "@/views/Categories/CategoriesIndex.vue";
// import CategoriesCreate from "@/views/Categories/CategoriesCreate.vue";
import ProductsIndex from "@/views/Products/ProductsIndex.vue";
import ProductsCreate from "@/views/Products/ProductsCreate.vue";
import ExpensesIndex from "@/views/Expenses/ExpensesIndex.vue";
import ExpensesCreate from "@/views/Expenses/ExpensesCreate.vue";
import SalariesIndex from "@/views/Salaries/SalariesIndex.vue";
import SalariesShow from "@/views/Salaries/SalariesShow.vue";
import SalariesPayIndex from "@/views/Salaries/SalariesPayIndex.vue";
import SalariesCreate from "@/views/Salaries/SalariesCreate.vue";
import StockIndex from "@/views/Stock/StockIndex.vue";
import StockCreate from "@/views/Stock/StockCreate.vue";
import CustomersIndex from "@/views/Customers/CustomersIndex.vue";
import CustomersCreate from "@/views/Customers/CustomersCreate.vue";
import SalesIndex from "@/views/Sales/SalesIndex.vue";
import SalesShow from "@/views/Sales/SalesShow.vue";

import PosView from "@/views/Pos/PosView.vue";
import PosV2View from "@/views/Pos/PosV2View.vue";
// import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "dashboard",
      component: DefaultView,
      meta: { requiresAuth: true },
      children: [
        { path: "/dashboard", name: "dashboard", component: DashboardView },
        {
          path: "/users",
          name: "users.index",
          component: UsersIndex,
        },
        {
          path: "/users/create",
          name: "users.create",
          component: UsersCreate,
        },
        {
          path: "/users/edit/:id",
          name: "users.edit",
          component: UsersCreate,
        },
        {
          path: "/employees",
          name: "employees.index",
          component: EmployeesIndex,
        },
        {
          path: "/employees/create",
          name: "employees.create",
          component: EmployeesCreate,
        },
        {
          path: "/employees/edit/:id",
          name: "employees.edit",
          component: EmployeesCreate,
        },

        {
          path: "/suppliers",
          name: "suppliers.index",
          component: SuppliersIndex,
        },
        {
          path: "/suppliers/create",
          name: "suppliers.create",
          component: SuppliersCreate,
        },
        {
          path: "/suppliers/edit/:id",
          name: "suppliers.edit",
          component: SuppliersCreate,
        },

        {
          path: "/categories",
          name: "categories.index",
          component: CategoriesIndex,
        },
        // {
        //   path: "/categories/create",
        //   name: "categories.create",
        //   component: CategoriesCreate,
        // },
        // {
        //   path: "/categories/edit/:id",
        //   name: "categories.edit",
        //   component: CategoriesCreate,
        // },

        { path: "/products", name: "products.index", component: ProductsIndex },
        {
          path: "/products/create",
          name: "products.create",
          component: ProductsCreate,
        },
        {
          path: "/products/edit/:id",
          name: "products.edit",
          component: ProductsCreate,
        },

        { path: "/pos", name: "pos.index", component: PosView },
        { path: "/pos/v2", name: "pos.v2.index", component: PosV2View },

        { path: "/expenses", name: "expenses.index", component: ExpensesIndex },
        {
          path: "/expenses/create",
          name: "expenses.create",
          component: ExpensesCreate,
        },
        {
          path: "/expenses/edit/:id",
          name: "expenses.edit",
          component: ExpensesCreate,
        },

        {
          path: "/salaries/:year?",
          name: "salaries.index",
          component: SalariesIndex,
        },
        {
          path: "/salaries?month=:month&year=:year",
          name: "salaries.show",
          component: SalariesShow,
        },
        {
          path: "/salaries/pay",
          name: "salaries.pay.index",
          component: SalariesPayIndex,
        },
        {
          path: "/salaries/create/:employee_id",
          name: "salaries.create",
          component: SalariesCreate,
        },
        {
          path: "/salaries/edit/:id",
          name: "salaries.edit",
          component: SalariesCreate,
        },

        { path: "/stock", name: "stock.index", component: StockIndex },
        { path: "/stock/edit/:id", name: "stock.edit", component: StockCreate },

        {
          path: "/customers",
          name: "customers.index",
          component: CustomersIndex,
        },
        {
          path: "/customers/create",
          name: "customers.create",
          component: CustomersCreate,
        },
        {
          path: "/customers/edit/:id",
          name: "customers.edit",
          component: CustomersCreate,
        },

        { path: "/sales", name: "sales.index", component: SalesIndex },
        { path: "/sales/:id", name: "sales.show", component: SalesShow },
      ],
    },
    {
      path: "/auth",
      redirect: "login",
      component: AuthView,
      meta: { isGuest: true },
      children: [
        // { path: "/register", name: "register", component: RegisterView },
        { path: "/login", name: "login", component: LoginView },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.user.token) {
    next({ name: "login" });
  } else if (authStore.user.token && to.meta.isGuest) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
