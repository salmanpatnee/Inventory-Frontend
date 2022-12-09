import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/users`;

export const useUserStore = defineStore({
  id: "suer",
  state: () => ({
    users: {
      isLoading: false,
      data: [],
    },
    currentUser: {
      isLoading: false,
      data: {},
    },
  }),
  actions: {
    async getUsers(params = "") {
      try {
        this.users.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.users.data = response;
        this.users.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.users.isLoading = false;
      }
    },
    async getUser(id) {
      try {
        this.currentUser.isLoading = true;
        const { data } = await http.get(`${apiEndpoint}/${id}`);
        this.currentUser.data = data.data;
        this.currentUser.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.currentUser.isLoading = false;
      }
    },
    async addUser(form) {
      try {
        return await form.post(apiEndpoint);
      } catch (error) {
        return error;
      }
    },
    async updateUser(form, id) {
      try {
        return await form.put(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
    async deleteUser(id) {
      try {
        return await http.delete(`${apiEndpoint}/${id}`);
      } catch (error) {
        return error;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
