import { useUserStore } from "@/stores/user";
import axios from "axios";
import i18n from "@/locales/i18n";
import type { AxiosResponse } from "axios";
import { baseURL } from "@/app.config";
const BASE_URL = baseURL + "/api/";
const { t } = i18n.global;
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
    if (error.code === "ERR_NETWORK") {
      if (!window.navigator.onLine) {
        console.log("Error. No internet connection.");
      } else {
        console.log("Error. No server connection.");
      }
    } else if (error.response?.status === 401) {
      console.log("Error 401", error.response.data.detail);
      if (
        error.response.data.detail === "Incorrect authentication credentials."
      ) {
        alert(t("Your connection has been lost. Please log in again."));
        const store = useUserStore();
        store.logout();
      }
    } else if (error.response?.status === 403) {
      console.log("Error 403", error.response?.data.detail);
    } else if (error.response?.status === 404) {
      console.log("Error 404", error.response?.data.detail);
    } else if (error.response?.status === 500) {
      console.log("Error 500", error.response?.data.detail);
    } else {
      console.log("Error", error.response?.data.detail);
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
  //members
  membersMembers: "/members/members/",
  membersCreate: "/members/create/",
  membersProfile: "/members/profile/",
  membersSummary: "/members/summary/",
  membersRegister: "/members/register/",
  membersTags: "/members/tags/",
  membersEmailsDesigns: "/members/emails/designs/",
  membersEmailsTemplates: "/members/emails/templates/",
  membersEmailsCampaigns: "/members/emails/campaigns/",
  membersSkills: "/members/skills/",
  membersGroups: "/members/groups/",
};

// Generic API functions
export const API = {
  get: async function (
    endpoint: keyof typeof endpoints,
    id?: Number,
    page?: Number,
    rowsPerPage?: Number,
    filter?: String
  ): Promise<AxiosResponse<any, any>> {
    console.log("API.get", endpoint, id, page, rowsPerPage, filter);
    if (id === undefined || id === null) {
      let api_endpoint = endpoints[endpoint];
      let offset = 0;
      let limit = 50;
      if (page !== undefined && rowsPerPage !== undefined) {
        // @ts-ignore - page and rowsPerPage are numbers
        offset = page * rowsPerPage;
        // @ts-ignore - page and rowsPerPage are numbers
        limit = rowsPerPage;
      }
      api_endpoint = `${api_endpoint}?offset=${offset}&limit=${limit}`;
      if (filter !== undefined) {
        api_endpoint = `${api_endpoint}&search=${filter}`;
      }
      return await api.get(api_endpoint);
    }
    return await api.get(`${endpoints[endpoint]}${id}/`);
  },
  getSchema: async function (endpoint: keyof typeof endpoints) {
    return await api.get(`${endpoints[endpoint]}schema/`);
  },
  post: async function (endpoint: keyof typeof endpoints, payload: Object) {
    return await api.post(endpoints[endpoint], payload);
  },
  patch: async function (
    endpoint: keyof typeof endpoints,
    payload: Object,
    id?: Number
  ) {
    if (id === undefined) {
      return await api.patch(endpoints[endpoint], payload);
    }
    return await api.patch(`${endpoints[endpoint]}${id}/`, payload);
  },
  delete: async function (endpoint: keyof typeof endpoints, id?: Number) {
    if (id === undefined) {
      return await api.delete(endpoints[endpoint]);
    }
    return await api.delete(`${endpoints[endpoint]}${id}/`);
  },
};
