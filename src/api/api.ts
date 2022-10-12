import axios from "axios";
const BASE_URL = import.meta.env.VITE_APP_API+ "/api/";

const api = axios.create({
  baseURL: BASE_URL,
});

api.defaults.headers.common["Content-Type"] = "application/json";

export const coreVersionFn = async () => {
  const response = await api.get("/core/version");
  return response.data;
};
