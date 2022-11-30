import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/categories`;

export const useCategoryStore = defineStore({
  id: "category",
  state: () => ({
    categories: {
      isLoading: false,
      data: [],
    },
    currentCategory: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getCategories(params = "") {
      try {
        this.categories.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.categories.data = response;
        this.categories.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.categories.isLoading = false;
      }
    },
    async getCategory(id) {
      try {
        this.currentCategory.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentCategory.data = data.data;
        this.currentCategory.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentCategory.isLoading = false;
      }
    },
    async addCategory(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateCategory(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteCategory(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot));
}
