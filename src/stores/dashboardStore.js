import http from "@/services/httpService";
import { defineStore, acceptHMRUpdate } from "pinia";

const apiEndpoint = `/api/dashboard`;

export const useDashboardStore = defineStore({
  id: "category",
  state: () => ({
    stats: {
      isLoading: false,
      data: [],
    },
  }),
  actions: {
    async getTodayStats(params = "") {
      try {
        this.stats.isLoading = true;
        const { data: response } = await http.get(`${apiEndpoint}${params}`);
        this.stats.data = response;
        this.stats.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.stats.isLoading = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot));
}
