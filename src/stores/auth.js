import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

export const tokenKey = "TOKEN";
export const userKey = "USER";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: {
      data: JSON.parse(sessionStorage.getItem(userKey)),
      token: sessionStorage.getItem(tokenKey),
    },
  }),
  actions: {
    async register(data) {
      const response = await http.post(`/api/register`, data);
      // this.setUser(response.data);
      return response;
    },
    async login(user) {
      const response = await http.post(`/api/login`, user);
      this.setUser(response.data);
      return response;
    },
    setUser(data) {
      this.user.data = data.user;
      this.user.token = data.access_token;
      sessionStorage.setItem(tokenKey, data.access_token);
      sessionStorage.setItem(userKey, JSON.stringify(data.user));
    },
    async logout() {
      const response = await http.post(`/api/logout`);

      if (response.status === 200) {
        this.user.data = {};
        this.user.token = null;
        sessionStorage.removeItem(tokenKey);
        sessionStorage.removeItem(userKey);
        return response;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
