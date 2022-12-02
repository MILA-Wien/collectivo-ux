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

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      // store.logout();
      alert("Error 401:" + error.response.data.detail);
    } else if (error.response.status === 403) {
      alert("Error 403:" + error.response.data.detail);
    } else if (error.response.status === 404) {
      if (error.response.data.detail === "Incorrect authentication credentials.") {
        const store = useUserStore();
        store.logout();
      }
    } else if (error.response.status === 500) {
      alert("Error 500:" + error.response.data.detail);
    }
    return Promise.reject(error);
  }
);

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

// Dashboard
export const dashboardTiles = async () => {
  const response = api.get(`/dashboard/tiles/?limit=10`);
  return response;
};
// get membership
export const getMembershipFn = async () => {
  const response = await api.get("/members/profile");
  return response.data;
};

//update membership
export const updateMembershipFn = async (member: Member) => {
  const response = await api.put("/members/profile", member);
  return response;
};

export const getRegisterSchemaFn = async () => {
  const response = await api.get("/members/register/schema");
  return response.data;
};

export const registerMemberFn = async (member: any) => {
  const response = await api.post("/members/register", member);
  return response.data;
};
