import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/customers`;

export const useCustomerStore = defineStore({
  id: "customer",
  state: () => ({
    customers: {
      isLoading: false,
      data: [],
    },
    currentCustomer: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getCustomers(params = "") {
      try {
        this.customers.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.customers.data = response;
        this.customers.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.customers.isLoading = false;
      }
    },
    async getCustomer(id) {
      try {
        this.currentCustomer.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentCustomer.data = data.data;
        this.currentCustomer.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentCustomer.isLoading = false;
      }
    },
    async addCustomer(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateCustomer(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteCustomer(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCustomerStore, import.meta.hot));
}
