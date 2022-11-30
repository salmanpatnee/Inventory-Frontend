<script setup>
import http from "@/services/httpService";
import Form from "vform";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import ProductCard from "@/components/ProductCard.vue";

const products = ref([]);
const customers = ref([]);
const cartItems = ref([]);
const isLoading = ref(true);
const isCartLoading = ref(true);
const router = useRouter();

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

const displayTotalQuantities = computed(() => {
  let totalQuantites = 0;
  cartItems.value.forEach(
    (cartItem) => (totalQuantites += parseInt(cartItem.quantity))
  );
  return totalQuantites;
});

const displaySubTotal = computed(() => {
  let subTotal = 0;
  cartItems.value.forEach(
    (cartItem) => (subTotal += parseFloat(cartItem.sub_total))
  );
  return subTotal.toFixed(2);
});

const displayGrandTotal = computed(() => {
  const subTotal = parseFloat(displaySubTotal.value);
  let grandTotal = subTotal + (subTotal * form.value.vat) / 100;
  return grandTotal.toFixed(2);
});

watch(displayTotalQuantities, (newQty, oldQty) => {
  form.value.total_quantities = newQty;
});

watch(displaySubTotal, (newSubTotal, oldSubTotal) => {
  form.value.sub_total = newSubTotal;
});

watch(displayGrandTotal, (newTotal, oldTotal) => {
  form.value.grand_total = newTotal;
});

const getProducts = async (page = 1) => {
  const { data: response } = await http.get(`/api/products`);
  products.value = response.data;
  isLoading.value = false;
};

const getCustomers = async (page = 1) => {
  const { data: response } = await http.get(`/api/customers`);
  customers.value = response.data;
  isLoading.value = false;
};

const getCartItems = async (page = 1) => {
  const { data: response } = await http.get(`/api/carts`);
  cartItems.value = response.data;
  isCartLoading.value = false;
};

const handleAddToCart = async (productId) => {
  try {
    form.value.product_id = productId;
    const { data: response } = await form.value.post(`/api/carts`);
    getCartItems();
    Toast.fire({
      icon: "success",
      title: response.message,
    });
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
  }
};

const handleRemoveCartItem = async (id) => {
  const originalCartItems = cartItems.value;
  cartItems.value = originalCartItems.filter((cart) => cart.id !== id);

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  })
    .then(async (result) => {
      if (result.isConfirmed) {
        const { data: response } = await http.delete(`/api/carts/${id}`);
        if (response.status === "success")
          Swal.fire("Deleted!", response.message, "success");
      } else {
        cartItems.value = originalCartItems;
      }
    })
    .catch((error) => {
      Toast.fire({
        icon: "error",
        title: "An unexpected error occurred.",
      });
    });
};

const handleChangeQuantity = async (id, quantity) => {
  if (quantity < 1) {
    Toast.fire({
      icon: "error",
      title: "Item quantity can not negative.",
    });
    return;
  }
  form.value.id = id;
  form.value.quantity = quantity;
  const { data: response } = await form.value.put(`/api/carts/${id}`);
  if (response.status === "success") {
    Toast.fire({
      icon: "success",
      title: response.message,
    });
    getCartItems();
  }
};

const handleCheckout = async () => {
  try {
    const { data: response } = await form.value.post(`/api/sales`);


    if (response.status === "success") {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      router.push({ name: "sales.index" });
    }
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "Something went wrong.",
    });
  }
};

onMounted(async () => {
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
        <div class="text-right mb-3">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            data-toggle="modal"
            data-target="#exampleModalCenter"
            id="#modalCenter"
          >
            Add Customer
          </button>
        </div>
        <div class="text-center alert alert-info" v-if="isCartLoading">
          Loading...
        </div>
        <div
          class="text-center alert alert-danger"
          v-if="!isCartLoading && !cartItems.length"
        >
          Cart is empty!
        </div>

        <div class="table-responsive mb-3" v-else>
          <table class="table align-items-center table-flush">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cartItem, index) in cartItems" :key="cartItem.id">
                <td>{{ cartItem.product.name }}</td>
                <td>
                  <div class="d-flex">
                    <input
                      type="number"
                      min="1"
                      @change="
                        handleChangeQuantity(cartItem.id, $event.target.value)
                      "
                      class="form-control quantity"
                      v-model="cartItem.quantity"
                    />
                  </div>
                </td>
                <td>{{ cartItem.unit_price }}</td>
                <td>{{ cartItem.sub_total }}</td>
                <td>
                  <button
                    @click="handleRemoveCartItem(cartItem.id)"
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
            <div class="form-group">
              <label for="customer_id">Customer</label>
              <select
                v-model="form.customer_id"
                id="customer_id"
                class="form-control"
              >
                <option value="">Select Customer Name</option>
                <option
                  v-for="customer in customers"
                  :key="customer.id"
                  :value="customer.id"
                >
                  {{ `${customer.name} (#${customer.id})` }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="pay">Pay</label>
              <input
                type="number"
                v-model="form.pay"
                for="pay"
                class="form-control"
              />
            </div>
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
        <div class="text-center alert alert-info" v-if="isLoading">
          Loading...
        </div>
        <div v-else>
          <div class="row">
            <div
              v-for="product in products"
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
    id="exampleModalCenter"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">
            Modal Vertically Centered
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
        <div class="modal-body">Your Content</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-primary"
            data-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input.quantity {
  width: 70px;
}
</style>
