import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/sales`;

export const useSaleStore = defineStore({
  id: "sales",
  state: () => ({
    sales: {
      isLoading: false,
      data: [],
    },
    currentSale: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getSales(params = "") {
      try {
        this.sales.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.sales.data = response;
        this.sales.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.sales.isLoading = false;
      }
    },
    async getSale(id) {
      try {
        this.currentSale.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentSale.data = data.data;
        this.currentSale.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentSale.isLoading = false;
      }
    },
    async getLastSale() {
      try {
        this.currentSale.isLoading = true;
        const { data } = await http.get(`/api/sales/last_sale`);
        this.currentSale.data = data.data;
        this.currentSale.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentSale.isLoading = false;
      }
    },
    async addSale(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateSale(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteSale(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSaleStore, import.meta.hot));
}
