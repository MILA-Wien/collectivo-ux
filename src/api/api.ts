import type { LoginData } from "@/api/types";
import axios from "axios";
const BASE_URL = "http://localhost:8000/api/";

const api = axios.create({
  baseURL: BASE_URL,
});

api.defaults.headers.common["Content-Type"] = "application/json";

export const versionFn = async () => {
  const response = await api.get("/version");
  return response.data;
};

export const loginFn = async (data: LoginData) => {
  const response = await api.post("/auth/login", {
    username: data.username,
    password: data.password,
  });
  return response.data;
};
