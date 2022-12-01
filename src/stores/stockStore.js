import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/stock`;

export const useStockStore = defineStore({
  id: "stock",
  state: () => ({
    stock: {
      isLoading: false,
      data: [],
    },
    currentStock: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getStocks(params = "") {
      try {
        this.stock.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.stock.data = response;
        this.stock.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.stock.isLoading = false;
      }
    },
    async getStock(id) {
      try {
        this.currentStock.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentStock.data = data;
        this.currentStock.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentStock.isLoading = false;
      }
    },
    async updateStock(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStockStore, import.meta.hot));
}
