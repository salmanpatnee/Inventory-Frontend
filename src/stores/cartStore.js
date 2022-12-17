import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/carts`;

export const useCartStore = defineStore({
  id: "cart",
  state: () => ({
    items: {
      isLoading: false,
      data: [],
    },
    item: {
      isLoading: false,
      data: {},
    }, 
    vat: 5
  }),
  getters: {
    totalItemQuatities: (state) => {
      let totalItemQuatities = 0;
      state.items.data.map(
        (item) => (totalItemQuatities += parseInt(item.qty))
      );
      return totalItemQuatities;
    },
    subTotal: (state) => {
      let subTotal = 0;
      state.items.data.forEach(
        (item) => (subTotal += parseInt(item.qty) * parseFloat(item.price))
      );
      return parseFloat(subTotal);
    }, 
    grandTotal: (state) => {
      const subTotal = state.subTotal;
      return subTotal + (subTotal * state.vat) / 100;
    }, 
  },
  actions: {
    addItemToCart(product) {
      let productInCart = this.items.data.find((item) => {
        return item.id === product.id;
      });

      if (productInCart) {
        product.qty += 1;
        return;
      } else {
        product.qty = 1;
      }

      this.items.data.push(product);
    },
    async getItems(params = "") {
      try {
        this.items.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.items.data = response.data;
        this.items.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.items.isLoading = false;
      }
    },
    async addItem(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateItem(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteItem(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot));
}
