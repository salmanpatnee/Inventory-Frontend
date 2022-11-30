import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/products`;

export const useProductStore = defineStore({
  id: "product",
  state: () => ({
    products: {
      isLoading: false,
      data: [],
    },
    currentProduct: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getProducts(params = "") {
      try {
        this.products.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.products.data = response;
        this.products.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.products.isLoading = false;
      }
    },
    async getProduct(id) {
      try {
        this.currentProduct.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentProduct.data = data.data;
        this.currentProduct.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentProduct.isLoading = false;
      }
    },
    async addProduct(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateProduct(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteProduct(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
