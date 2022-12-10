<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { useProductStore } from "@/stores/productStore.js";
import { useCustomerStore } from "@/stores/customerStore.js";
import { useCartStore } from "@/stores/cartStore.js";
import { useSaleStore } from "@/stores/saleStore.js";
import { useRouter } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import Form from "vform";
import { computed, onMounted, ref, watch } from "vue";

const authStore = useAuthStore();
const productStore = useProductStore();
const customerStore = useCustomerStore();
const cartStore = useCartStore();
const saleStore = useSaleStore();
const router = useRouter();
const { confirmAtts, flashSuccess, flashError } = useFlash();
let modal = null;
const paginate = ref(10);
const search = ref("");
const sortColumn = ref({ path: "name", order: "asc" });

const user = computed(() => {
  return authStore.user.data;
});
const products = computed(() => productStore.products.data);
const isproductsLoading = computed(() => productStore.products.isLoading);
const customers = computed(() => customerStore.customers.data);
const items = computed(() => cartStore.items.data);
const isItemsLoading = computed(() => cartStore.items.isLoading);
const sale = computed(() => saleStore.currentSale.data);
const invoiceNo = computed(() => {
  return sale ? parseInt(sale.value.invoice_no) + 1 : "1001";
});

const columns = [
  { path: "product", label: "Product" },
  { path: "quantity", label: "Qty" },
  //   { path: "unit", label: "Unit" },
  { path: "total", label: "Total" },
  { path: "", label: "" },
];

const productColumns = [
  { path: "#", label: "#" },
  { path: "name", label: "Name", sortable: true },
  { path: "price", label: "Price", sortable: true },
  { path: "quantity", label: "Stock", sortable: true },
  { path: "", label: "Action" },
];

const form = ref(
  new Form({
    seller: user.value.name, 
    invoice_no: invoiceNo.value,
    product_id: null,
    customer_id: "",
    pay: null,
    due: null,
    payment_method_id: "",
    total_quantities: null,
    sub_total: null,
    tax: 5,
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
  () => paginate.value,
  (newVal, prevVal) => {
    getProducts();
  }
);
watch(
  () => search.value,
  (newTerm, prevTerm) => {
    getProducts();
  }
);
const displayTotalQuantities = computed(() => {
  let totalQuantites = 0;
  items.value.forEach((item) => (totalQuantites += parseInt(item.quantity)));
  return totalQuantites;
});

const displaySubTotal = computed(() => {
  let subTotal = 0;
  items.value.forEach((item) => (subTotal += parseFloat(item.sub_total)));
  return subTotal.toFixed(2);
});

const displayGrandTotal = computed(() => {
  const subTotal = parseFloat(displaySubTotal.value);
  let grandTotal = subTotal + (subTotal * form.value.tax) / 100;
  return grandTotal.toFixed(2);
});

watch(displayTotalQuantities, (newQty, prevQty) => {
  form.value.total_quantities = newQty;
});

watch(displaySubTotal, (newSubTotal, prevSubTotal) => {
  form.value.sub_total = newSubTotal;
});

watch(displayGrandTotal, (newTotal, prevTotal) => {
  form.value.grand_total = newTotal;
});

const getProducts = async (page = 1) => {
  const { order, path } = sortColumn.value;
  const params = `?page=${page}&paginate=${paginate.value}&search=${search.value}&sortOrder=${order}&orderBy=${path}`;
  await productStore.getProducts(params);
};

const getTheLastSale = async () => {
  await saleStore.getLastSale();
};

const handleSort = async (sort) => {
  sortColumn.value.path = sort.path;
  sortColumn.value.order = sort.order;
  await getProducts();
};

const getCustomers = async () => {
  await customerStore.getCustomers();
};

const getCartItems = async (page = 1) => {
  await cartStore.getItems();
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

const handleAddToCart = async (productId) => {
  try {
    form.value.product_id = productId;
    const { data: response } = await cartStore.addItem(form.value);
    getCartItems();
    flashSuccess(response.message);
  } catch (error) {
    flashError("Something went wrong.");
  }
};

const handleRemoveCartItem = async (id) => {
  const originalCartItems = items.value;

  items.value = originalCartItems.filter((cart) => cart.id !== id);

  Swal.fire(confirmAtts())
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await cartStore.deleteItem(id);
        if (response.status === "success") flashSuccess(response.message);
      } else {
        items.value = originalCartItems;
      }
    })
    .catch((error) => flashError());
};

const handleChangeQuantity = async (id, quantity) => {
  if (quantity < 1) {
    flashError("Item quantity can not negative.");
    return;
  }

  form.value.id = id;
  form.value.quantity = quantity;
  const { data: response } = await cartStore.updateItem(form.value, id);
  if (response.status === "success") {
    flashSuccess(response.message);
    getCartItems();
  }
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

onMounted(async () => {
  await getTheLastSale();
  await getProducts();
  await getCustomers();
  await getCartItems();
});
</script>

<template>
  <AppPageHeader title="POS"> </AppPageHeader>
  <div class="row">
    <div class="col-xl-6 col-lg-5">
      <AppPanel>
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
            v-model="form.seller"
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
        <div class="mt-5 table-responsive mb-3">
          <table class="table align-items-center table-flush">
            <AppTableHeader :columns="columns" />
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.product.name }}</td>
                <td>
                  <div class="d-flex">
                    <input
                      type="number"
                      min="1"
                      @change="
                        handleChangeQuantity(item.id, $event.target.value)
                      "
                      class="form-control quantity"
                      v-model="item.quantity"
                    />
                  </div>
                </td>
                <!-- <td>{{ item.unit_price }}</td> -->
                <td>{{ item.sub_total }}</td>
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
            <label for="tax">Tax</label>
            <div class="input-group mb-3">
              <input
                v-model="form.tax"
                type="number"
                for="tax"
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
          <div class="col">
            <select class="form-control mb-3">
              <option>Select Payment Method</option>
            </select>
          </div>
          <div class="col">
            <div class="input-group mb-3">
              <input
                type="text"
                placeholder="Transaction Code"
                for="tax"
                class="form-control"
              />
              <div class="input-group-append">
                <span class="input-group-text"><i class="fa fa-lock"></i></span>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col text-end">
            <button class="btn btn-lg btn-primary">Save Sale</button>
          </div>
        </div>
      </AppPanel>
    </div>
    <div class="col-xl-6 col-lg-7">
      <AppPanel>
        <div class="row">
          <div class="col-sm-4">
            <AppPaginateDropdown v-model="paginate" />
          </div>

          <div class="col-sm-8">
            <AppSearch v-model="search" />
          </div>
        </div>
        <div class="text-center alert alert-info" v-if="isproductsLoading">
          Loading...
        </div>
        <div v-else class="table-responsive">
          <table class="table align-items-center table-flush">
            <AppTableHeader
              @onSort="handleSort"
              :columns="productColumns"
              :sortColumn="sortColumn"
            />
            <tbody>
              <tr v-for="(product, index) in products.data" :key="product.id">
                <td>{{ index + 1 }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.quantity }}</td>
                <td class="text-center">
                  <button
                    @click="handleEdit(product.id)"
                    type="button"
                    class="btn btn-sm btn-primary"
                  >
                    <div class="fa fa-plus"></div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
