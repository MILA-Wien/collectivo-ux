import axios from "axios";
const BASE_URL = "http://localhost:8000/api/";

const api = axios.create({
  baseURL: BASE_URL,
});

api.defaults.headers.common["Content-Type"] = "application/json";

export const coreVersionFn = async () => {
  const response = await api.get("/collectivo/v1/version");
  return response.data;
};

export const coreMenuFn = async () => {
  const response = await api.get("/collectivo.ux/v1/menus/main_menu");
  return response.data;
};