import { useUserStore } from "@/stores/user";
import axios from "axios";
import type { AxiosResponse } from "axios";
import { baseURL } from "@/app.config";
const BASE_URL = baseURL + "/api/";

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
      console.log("Error 401", error.response.data.detail);
      if (
        error.response.data.detail === "Incorrect authentication credentials."
      ) {
        const store = useUserStore();
        store.logout();
      }
    } else if (error.response.status === 403) {
      console.log("Error 403", error.response.data.detail);
    } else if (error.response.status === 404) {
      if (
        error.response.data.detail === "Incorrect authentication credentials."
      ) {
        const store = useUserStore();
        store.logout();
      }
    } else if (error.response.status === 500) {
      console.log("Error 500", error.response.data.detail);
    }
    return Promise.reject(error);
  }
);

// Core API
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

export const dashboardTiles = async () => {
  const response = api.get(`/dashboard/tiles/?limit=10`);
  return response;
};

// Endpoint dictionary (at the moment only for members)
export const endpoints = {
  membersMembers: "/members/members/",
  membersProfile: "/members/profile/",
  membersSummary: "/members/summary/",
  membersRegister: "/members/register/",
  membersEmailsDesigns: "/members/emails/designs/",
  membersEmailsTemplates: "/members/emails/templates/",
  membersEmailsCampaigns: "/members/emails/campaigns/",
};

// Generic API functions
export const API = {
  get: async function (
    endpoint: keyof typeof endpoints,
    pk?: Number
  ): Promise<AxiosResponse<any, any>> {
    if (pk === undefined) {
      return await api.get(endpoints[endpoint]);
    }
    return await api.get(`${endpoints[endpoint]}${pk}/`);
  },

  getSchema: async function (endpoint: keyof typeof endpoints) {
    return await api.get(`${endpoints[endpoint]}schema/`);
  },

  post: async function (endpoint: keyof typeof endpoints, payload: Object) {
    return await api.post(endpoints[endpoint], payload);
  },

  patch: async function (
    endpoint: keyof typeof endpoints,
    pk: Number,
    payload: Object
  ) {
    return await api.patch(`${endpoints[endpoint]}${pk}/`, payload);
  },

  delete: async function (endpoint: keyof typeof endpoints, pk: Number) {
    return await api.delete(`${endpoints[endpoint]}${pk}/`);
  },
};
