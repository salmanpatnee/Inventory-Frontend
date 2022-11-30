import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/employees`;

export const useEmployeeStore = defineStore({
  id: "employee",
  state: () => ({
    employees: {
      isLoading: false,
      data: [],
    },
    currentEmployee: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getEmployees(params = "") {
      try {
        this.employees.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.employees.data = response;
        this.employees.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.employees.isLoading = false;
      }
    },
    async getEmployee(id) {
      try {
        this.currentEmployee.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentEmployee.data = data.data;
        this.currentEmployee.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentEmployee.isLoading = false;
      }
    },
    async addEmployee(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateEmployee(form, id) {
      try {
        return await form.post(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteEmployee(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmployeeStore, import.meta.hot));
}
