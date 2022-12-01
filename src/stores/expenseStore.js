import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/expenses`;

export const useExpenseStore = defineStore({
  id: "expense",
  state: () => ({
    expenses: {
      isLoading: false,
      data: [],
    },
    currentExpense: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getExpenses(params = "") {
      try {
        this.expenses.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.expenses.data = response;
        this.expenses.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.expenses.isLoading = false;
      }
    },
    async getExpense(id) {
      try {
        this.currentExpense.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentExpense.data = data.data;
        this.currentExpense.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentExpense.isLoading = false;
      }
    },
    async addExpense(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateExpense(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteExpense(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExpenseStore, import.meta.hot));
}
