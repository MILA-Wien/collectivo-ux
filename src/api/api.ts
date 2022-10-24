import { useUserStore } from "@/stores/user";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_APP_API+ "/api/";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  function (config) {
    const store = useUserStore();
    const token = store.user!.token;
    if (token && config.headers) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  }, 
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
api.defaults.headers.common["Content-Type"] = "application/json";

export const versionFn = async () => {
  const response = await api.get("/collectivo/v1/version/");
  return response.data;
};
