<script setup>
import { useProductStore } from "@/stores/productStore.js";
import { useCustomerStore } from "@/stores/customerStore.js";
import { useCartStore } from "@/stores/cartStore.js";
import { useSaleStore } from "@/stores/saleStore.js";
import { useRouter } from "vue-router";
import { useFlash } from "@/composables/useFlash";
import Form from "vform";
import { computed, onMounted, ref, watch } from "vue";
import ProductCard from "@/components/ProductCard.vue";

const productStore = useProductStore();
const customerStore = useCustomerStore();
const cartStore = useCartStore();
const saleStore = useSaleStore();
const router = useRouter();
const { confirmAtts, flashSuccess, flashError } = useFlash();
let modal = null;

const products = computed(() => productStore.products.data);
const isproductsLoading = computed(() => productStore.products.isLoading);
const customers = computed(() => customerStore.customers.data);
const items = computed(() => cartStore.items.data);
const isItemsLoading = computed(() => cartStore.items.isLoading);

const columns = [
  { path: "product", label: "Product" },
  { path: "quantity", label: "Qty" },
  { path: "unit", label: "Unit" },
  { path: "total", label: "Total" },
  { path: "", label: "" },
];

const form = ref(
  new Form({
    product_id: null,
    customer_id: "",
    pay: null,
    due: null,
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
  let grandTotal = subTotal + (subTotal * form.value.vat) / 100;
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



const getProducts = async () => {
  await productStore.getProducts();
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
}

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
  await getProducts();
  await getCustomers();
  await getCartItems();

  modal = new Modal(document.getElementById("customerModal"), {
    keyboard: false,
  });
});
</script>

<template>
  <AppPageHeader title="POS"> </AppPageHeader>
  <div class="row">
    <div class="col-xl-6 col-lg-5">
      <AppPanel>
        <!-- <div class="text-right mb-3">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="createCustomerModal"
          >
            Add Customer
          </button>
        </div> -->
        <div class="text-center alert alert-info" v-if="isItemsLoading">
          Loading...
        </div>
        <div
          class="text-center alert alert-danger"
          v-if="!isItemsLoading && !items.length"
        >
          Cart is empty!
        </div>

        <div class="table-responsive mb-3" v-else>
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
                <td>{{ item.unit_price }}</td>
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
        <ul class="list-group mb-4">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            Total Qty:
            <span class=""
              ><b>{{ displayTotalQuantities }}</b></span
            >
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            Sub Total:
            <span class=""
              ><b>{{ displaySubTotal }}</b></span
            >
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            VAT:
            <span class=""
              ><b>{{ form.vat }} %</b></span
            >
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            Total:
            <span class=""
              ><b>{{ displayGrandTotal }}</b></span
            >
          </li>
        </ul>
        <div>
          <form @submit.prevent="handleCheckout">
            <label for="customer_id">Customer</label>
            <div class="input-group mb-3">
              <select
                v-model="form.customer_id"
                id="customer_id"
                class="form-control"
              >
                <option value="">Select Customer Name</option>
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
                  class="btn btn-sm btn-primary"
                  type="button"
                >
                  Add Customer
                </button>
              </div>
            </div>

            <label for="pay">Pay</label>
            <div class="input-group mb-3">
              <input
                type="number"
                v-model="form.pay"
                for="pay"
                class="form-control"
              />
              <div class="input-group-prepend">
                <button
                  :disabled="(displayGrandTotal <= 0.00)"
                  @click="handleFullPaid"
                  class="btn btn-sm btn-success"
                  type="button"
                >
                  Full Paid
                </button>
              </div>
            </div>

            <!-- <div class="form-group">
              <label for="pay">Pay</label>
              <input
                type="number"
                v-model="form.pay"
                for="pay"
                class="form-control"
              />
            </div> -->
            <div class="form-group">
              <label for="due">Due</label>
              <input
                type="number"
                v-model="form.due"
                for="due"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="payment_method_id">Pay By</label>
              <select
                id="payment_method_id"
                v-model="form.payment_method_id"
                class="form-control"
              >
                <option value="">Select Payment Method</option>
                <option value="1">Cash</option>
                <option value="2">Bank</option>
              </select>
            </div>
            <div class="text-right">
              <Button :form="form" class="btn btn-primary btn-block"
                >Submit</Button
              >
            </div>
          </form>
        </div>
      </AppPanel>
    </div>
    <div class="col-xl-6 col-lg-7">
      <AppPanel>
        <div class="text-center alert alert-info" v-if="isproductsLoading">
          Loading...
        </div>
        <div v-else>
          <div class="row">
            <div
              v-for="product in products.data"
              :key="product.id"
              class="col-sm-4 mb-3"
            >
              <product-card :product="product" @add-to-cart="handleAddToCart" />
            </div>
          </div>
        </div>
      </AppPanel>
    </div>
  </div>
  <!-- Modal Center -->
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
</style>
