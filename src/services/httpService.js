import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";

axios.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  config.headers.Authorization = `Bearer ${authStore.user.token}`;
  return config;
});

// axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.baseURL = "http://api.inventory.test";
// axios.defaults.baseURL = "http://api.inventory.test:8012";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

const methods = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

export default methods;
