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
      config.headers["Accept"] = "application/json; version=0.1.0";
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
  const response = await api.get("/collectivo/about/");
  return response.data;
};

export const coreMenuItemsFn = async () => {
  const response = await api.get("/menus/menus/main_menu/items");
  return response.data;
};

export const coreMicroFrontendsFn = async (name: string) => {
  const response = await api.get("/ux/microfrontends/" + { name });
  return response.data;
};

// get members
export const membersMembersFn = async () => {
  const response = api.get("/members/members/");
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
    `/members/members/${member.id}/?limit=10`,
    member
  );
  return response.data;
};

// get membership
export const getMembershipFn = async () => {
  const response = await api.get("/members/profile");
  return response.data;
};

//update membership
export const updateMembershipFn = async (member: Member) => {
  const response = await api.patch("/members/profile", member);
  return response;
};

// get profile schema
export const getProfileSchemaFn = async () => {
  const response = await api.get("/members/profile/schema/");
  return response.data; //or response? When to choose?
};