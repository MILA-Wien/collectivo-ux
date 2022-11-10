import { useUserStore } from "@/stores/user";
import axios from "axios";
import type { Member } from "./types";
const BASE_URL = import.meta.env.VITE_APP_API + "/api/";

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

export const coreVersionFn = async () => {
  const response = await api.get("/collectivo/v1/version");
  return response.data;
};

export const coreMenuItemsFn = async () => {
  const response = await api.get("/ux/v1/menus/main_menu/items");
  return response.data;
};

export const coreMicroFrontendsFn = async (name: string) => {
  const response = await api.get("/ux/v1/microfrontends/" + { name });
  return response.data;
};

// get members
export const membersMembersFn = async () => {
  const response = api.get("/members/v1/members/");
  return response;
};

export const membersMembersNextFn = async (nextUrl: string) => {
  const response = await axios.get(nextUrl);
  return response.data;
};

export const membersMembersPreviousFn = async (previousUrl: string) => {
  const response = await axios.get(previousUrl);
  return response.data;
};

export const membersMembersPatch = async (member: Member) => {
  const response = await api.patch(
    `/members/v1/members/${member.id}/?limit=10`,
    member
  );
  return response.data;
};

// get membership
export const getMembershipFn = async () => {
  const response = await api.get("/members/v1/me");
  return response;
};