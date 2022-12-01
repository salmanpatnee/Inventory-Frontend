import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/salaries`;

export const useSalaryStore = defineStore({
  id: "salary",
  state: () => ({
    salaries: {
      isLoading: false,
      data: [],
    },
    currentSalary: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getSalaries(params = "") {
      try {
        this.salaries.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.salaries.data = response;
        this.salaries.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.salaries.isLoading = false;
      }
    },
    async getSalariesByMonth(params = "") {
      try {
        this.salaries.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}/month${params}`);
        this.salaries.data = response;
        this.salaries.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.salaries.isLoading = false;
      }
    },
    async getSalary(id) {
      try {
        this.currentSalary.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentSalary.data = data.data;
        this.currentSalary.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentSalary.isLoading = false;
      }
    },
    async addSalary(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateSalary(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteSalary(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSalaryStore, import.meta.hot));
}
