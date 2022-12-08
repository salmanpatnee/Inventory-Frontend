import { createApp } from "vue";
import { createPinia } from "pinia";
import AppPageHeader from "@/components/AppPageHeader.vue"
import AppPanel from "@/components/AppPanel.vue"
import AppDate from "@/components/AppDate.vue"
import AppPaginateDropdown from "@/components/AppPaginateDropdown.vue"
import AppSearch from "@/components/AppSearch.vue"
import AppTableHeader from "@/components/AppTableHeader.vue"
import { Bootstrap4Pagination } from 'laravel-vue-pagination';
import vSelect from "vue-select";

import App from "./App.vue";
import router from "./router";

import "./assets/vendor/fontawesome-free/css/all.min.css";
import "./assets/vendor/bootstrap/css/bootstrap.min.css";
import "./assets/css/ruang-admin.min.css";
import "./assets/vendor/jquery/jquery.min.js";
import "./assets/vendor/bootstrap/js/bootstrap.bundle.min.js";
import "./assets/vendor/jquery-easing/jquery.easing.min.js";
import "./assets/js/ruang-admin.js";
import "vue-select/dist/vue-select.css";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import {
  Button,
  HasError,
  AlertError,
  AlertErrors,
  AlertSuccess
} from 'vform/src/components/bootstrap5'

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('AppPageHeader', AppPageHeader)
app.component('AppPagination', Bootstrap4Pagination)
app.component('AppDate', AppDate)
app.component('AppPaginateDropdown', AppPaginateDropdown)
app.component('AppSearch', AppSearch)
app.component('AppPanel', AppPanel)
app.component('AppTableHeader', AppTableHeader)
app.component(Button.name, Button)
app.component(HasError.name, HasError)
app.component(AlertError.name, AlertError)
app.component(AlertErrors.name, AlertErrors)
app.component(AlertSuccess.name, AlertSuccess)
app.component("v-select", vSelect);

app.use(VueSweetalert2);
window.Swal = app.config.globalProperties.$swal;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

window.Toast = Toast;
app.mount("#app");
