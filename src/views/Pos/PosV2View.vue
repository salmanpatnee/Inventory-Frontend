<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { useCategoryStore } from "@/stores/categoryStore.js";
import { useProductStore } from "@/stores/productStore.js";
import { useCustomerStore } from "@/stores/customerStore.js";
import { useCartStore } from "@/stores/cartStore.js";
import { useSaleStore } from "@/stores/saleStore.js";
import { useRouter, useRoute } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import Form from "vform";
import { computed, onMounted, ref, watch } from "vue";
import ProductCard from "@/components/ProductCard.vue";

const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const customerStore = useCustomerStore();
const cartStore = useCartStore();
const saleStore = useSaleStore();
const router = useRouter();
const route = useRoute();
const { flashSuccess, flashError } = useFlash();
const search = ref("");
const category_id = ref("");

const user = computed(() => {
  return authStore.user.data;
});

const products = computed(() => productStore.products.data);
const isproductsLoading = computed(() => productStore.products.isLoading);

const categories = computed(() => categoryStore.categories.data);
const customers = computed(() => customerStore.customers.data);

const items = computed(() => cartStore.items.data);
const isItemsLoading = computed(() => cartStore.items.isLoading);

const totalItemQuantities = computed(() => cartStore.totalItemQuatities);
const subTotal = computed(() => cartStore.subTotal);
const grandTotal = computed(() => cartStore.grandTotal);
const sale = computed(() => saleStore.currentSale.data);

const columns = [
  { path: "product", label: "Product" },
  { path: "quantity", label: "Qty" },
  { path: "total", label: "Total" },
  { path: "", label: "" },
];

const form = ref(
  new Form({
    user_id: user.value.id,
    invoice_no: null,
    product_id: null,
    customer_id: "",
    pay: null,
    due: null,
    transaction_id: null,
    payment_method_id: "",
    total_quantities: null,
    sub_total: null,
    vat: 5,
    grand_total: null,
  })
);

const customerForm = ref(
  new Form({
    id: null,
    name: null,
    email: null,
    phone: null,
    address: null,
  })
);

watch(
  () => search.value,
  (newTerm, prevTerm) => {
    category_id.value = "";
    getProducts();
  }
);

watch(
  () => category_id.value,
  (newTerm, prevTerm) => {
    getProducts();
  }
);

watch(totalItemQuantities, (newQty, prevQty) => {
  form.value.total_quantities = newQty;
});

watch(subTotal, (newSubTotal, prevSubTotal) => {
  form.value.sub_total = newSubTotal;
});
watch(grandTotal, (newGrandTotal, prevGrandTotal) => {
  form.value.grand_total = newGrandTotal;
});

const getCategories = async () => {
  await categoryStore.getCategories();
};
const getProducts = async (page = 1) => {
  const params = `?page=${page}&search=${search.value}&category=${category_id.value}`;
  await productStore.getProducts(params);
};

const getInvoiceNo = async () => {
  await saleStore.getInvoiceNo();
  form.value.invoice_no = saleStore.invoiceNo.data;
};

const getSale = async () => {
  await saleStore.getSale(route.params.id);
  form.value.fill(sale.value);
  form.value.customer_id = sale.value.customer.id;
  form.value.vat = sale.value.vat;
  form.value.grand_total = sale.value.grand_total;
};

const getCustomers = async () => {
  await customerStore.getCustomers();
};

const createCustomerModal = () => {
  customerForm.value.reset();
  jQuery("#customerModal").modal("show");
};

const handleAddCustomer = async () => {
  try {
    const { data: response } = await customerStore.addCustomer(
      customerForm.value
    );
    if (response.status === "success") {
      flashSuccess(response.message);
      await getCustomers();
      jQuery("#customerModal").modal("hide");
      jQuery(".modal-backdrop").remove();
      jQuery(document.body).removeClass("modal-open");
      console.log(response.data.id);
      form.value.customer_id = response.data.id;
    }
  } catch (error) {
    modal.hide();
    flashError("Something went wrong.");
  }
};

const handleFullPaid = () => {
  form.value.pay = form.value.grand_total;
  form.value.due = form.value.grand_total - form.value.pay;
};

const handleAddToCart = async (product) => {
  cartStore.addItemToCart(product);
};

const handleOutOfStockItem = () => {
  flashError("Item is out of stock");
};
const handleRemoveCartItem = async (id) => {
  const originalCartItems = items.value;

  items.value = originalCartItems.filter((item) => item.id !== id);
};

const handleCheckout = async () => {
  try {
    const { data: response } = await saleStore.addSale(form.value);

    if (response.status === "success") {
      flashSuccess(response.message);
      router.push({ name: "sales.index" });
    }
  } catch (error) {
    flashError("Something went wrong.");
  }
};

const handleCalculateDue = () => {
  // form.value.due = 100
  form.value.due =
    parseFloat(form.value.grand_total) - parseFloat(form.value.pay);
};

onMounted(async () => {
  await getCategories();
  await getProducts();
  await getCustomers();

  if (route.params.id) {
    await getSale();
  } else {
    await getInvoiceNo();
    // await getCartItems();
  }
});
</script>

<template>
  <AppPageHeader title="POS"> </AppPageHeader>

  <div class="row">
    <div class="col-xl-6 col-lg-5">
      <AppPanel>
        <form @submit.prevent="handleCheckout">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="seller">
                <i class="fa fa-user"></i>
              </span>
            </div>
            <input
              type="text"
              readonly
              class="form-control"
              :value="user.name"
            />
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="invoice-no">
                <i class="fa fa-atlas"></i>
              </span>
            </div>
            <input
              type="text"
              readonly
              class="form-control"
              v-model="form.invoice_no"
            />
          </div>
          <label for="customer_id">Customer</label>
          <div class="input-group mb-3">
            <select
              v-model="form.customer_id"
              id="customer_id"
              class="form-control"
            >
              <option value="">Select Customer</option>
              <option
                v-for="customer in customers.data"
                :key="customer.id"
                :value="customer.id"
              >
                {{ `${customer.name} (#${customer.id})` }}
              </option>
            </select>
            <div class="input-group-prepend">
              <button
                @click="createCustomerModal"
                class="btn btn-sm btn-add-customer"
                type="button"
              >
                <span class="input-group-text">
                  <i class="fa fa-user-plus"></i>
                </span>
              </button>
            </div>
          </div>

          <div class="text-center alert alert-info" v-if="isItemsLoading">
            Loading...
          </div>

          <div class="mt-5 table-responsive mb-3" v-else>
            <table class="table align-items-center table-flush">
              <AppTableHeader :columns="columns" />
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>
                    <div class="d-flex">
                      <input
                        type="number"
                        min="1"
                        :max="item.quantity"
                        class="form-control quantity"
                        v-model="item.qty"
                      />
                    </div>
                  </td>
                  <!-- <td>{{ item.unit_price }}</td> -->
                  <!-- <td>{{ item.sub_total }}</td> -->
                  <td>{{ item.qty * item.price }}</td>
                  <td>
                    <button
                      @click="handleRemoveCartItem(item.id)"
                      type="button"
                      class="btn btn-sm btn-danger"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr />
          <div class="py-3 row">
            <div class="col">
              <label for="vat">Tax</label>
              <div class="input-group mb-3">
                <input
                  v-model="form.vat"
                  type="number"
                  for="vat"
                  class="form-control"
                />
                <div class="input-group-append">
                  <span class="input-group-text"
                    ><i class="fa fa-percent"></i
                  ></span>
                </div>
              </div>
            </div>
            <div class="col">
              <label for="total">Total</label>
              <div class="input-group mb-3">
                <div class="input-group-append">
                  <span class="input-group-text"
                    ><i class="fa fa-dollar-sign"></i
                  ></span>
                </div>
                <input
                  v-model="form.grand_total"
                  type="number"
                  readonly
                  for="total"
                  class="form-control"
                />
              </div>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-5">
              <select
                v-model="form.payment_method_id"
                class="form-control form-control-sm mb-3"
              >
                <option value="">Select Payment Method</option>
                <option value="1">Cash</option>
                <option value="2">Bank</option>
              </select>
            </div>
            <div class="col">
              <div class="row" v-if="form.payment_method_id == 1">
                <div class="col">
                  <div class="input-group mb-3">
                    <div class="input-group-append">
                      <span class="input-group-text"
                        ><i class="fa fa-money-bill-alt"></i
                      ></span>
                    </div>
                    <input
                      type="number"
                      @keyup="handleCalculateDue"
                      placeholder="Pay"
                      v-model="form.pay"
                      class="form-control form-control-sm"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="input-group mb-3">
                    <div class="input-group-append">
                      <span class="input-group-text"
                        ><i class="fa fa-exchange-alt"></i
                      ></span>
                    </div>
                    <input
                      type="text"
                      readonly
                      v-model="form.due"
                      placeholder="Change"
                      class="form-control form-control-sm"
                    />
                  </div>
                </div>
              </div>
              <div v-if="form.payment_method_id == 2" class="input-group mb-3">
                <input
                  type="text"
                  v-model="form.transaction_id"
                  placeholder="Transaction Code"
                  class="form-control form-control-sm"
                />
                <div class="input-group-append">
                  <span class="input-group-text"
                    ><i class="fa fa-lock"></i
                  ></span>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col text-end">
              <button class="btn btn-lg btn-primary">Save Sale</button>
            </div>
          </div>
        </form>
      </AppPanel>
    </div>
    <div class="col-xl-6 col-lg-7">
      <AppPanel>
        <div class="row mb-3">
          <div class="col-sm-6">
            <select
              v-model="category_id"
              class="form-control form-control-sm"
              id="category"
            >
              <option value="">Select Category</option>
              <option
                :value="category.id"
                v-for="category in categories"
                :key="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="col-sm-6">
            <AppSearch v-model="search" />
          </div>
        </div>
        <div class="text-center alert alert-info" v-if="isproductsLoading">
          Loading...
        </div>
        <div v-else>
          <div class="row">
            <div
              v-for="product in products.data"
              :key="product.id"
              class="col-sm-3 mb-3"
            >
              <product-card
                :product="product"
                @add-to-cart="handleAddToCart"
                @item-out-of-stock="handleOutOfStockItem"
              />
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-center mt-4">
          <AppPagination
            :data="products"
            @pagination-change-page="getProducts"
          />
        </div>
      </AppPanel>
    </div>
  </div>
  <!-- Customer Modal -->
  <div
    class="modal fade"
    id="customerModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="customerModalTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <form @submit.prevent="handleAddCustomer">
          <div class="modal-header">
            <h5 class="modal-title" id="customerModalTitle">
              Add New Customer
            </h5>
            <button
              type="button"
              class="close"
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
                  <label for="name">Full Name</label>
                  <input
                    v-model="customerForm.name"
                    type="text"
                    class="form-control"
                    id="name"
                  />
                  <HasError :form="customerForm" field="name" />
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input
                    v-model="customerForm.email"
                    type="email"
                    class="form-control"
                    id="email"
                  />
                  <HasError :form="customerForm" field="email" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="phone">Phone</label>
                  <input
                    v-model="customerForm.phone"
                    type="tel"
                    class="form-control"
                    id="phone"
                  />
                  <HasError :form="customerForm" field="phone" />
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label for="address">Address</label>
                  <input
                    v-model="customerForm.address"
                    type="text"
                    class="form-control"
                    id="address"
                  />
                  <HasError :form="customerForm" field="address" />
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
            <Button class="btn btn-primary" :form="customerForm">
              Add New Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
input.quantity {
  width: 70px;
}
.btn-add-customer {
  background-color: #3f51b5;
  border-color: #3f51b5;
  border-radius: 0 0.35rem 0.35rem 0;
}
</style>
