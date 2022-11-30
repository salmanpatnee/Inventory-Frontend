import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/suppliers`;

export const useSupplierStore = defineStore({
  id: "supplier",
  state: () => ({
    suppliers: {
      isLoading: false,
      data: [],
    },
    currentSupplier: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getSuppliers(params = "") {
      try {
        this.suppliers.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.suppliers.data = response;
        this.suppliers.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.suppliers.isLoading = false;
      }
    },
    async getSupplier(id) {
      try {
        this.currentSupplier.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentSupplier.data = data.data;
        this.currentSupplier.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentSupplier.isLoading = false;
      }
    },
    async addSupplier(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateSupplier(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteSupplier(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSupplierStore, import.meta.hot));
}
