import { useUserStore } from "@/stores/user";
import axios from "axios";
import type { Member } from "./types";
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
  return response;
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
  const response = await api.patch("/members/profile", member);
  return response;
};

// get schemas
export const getProfileSchemaFn = async () => {
  const response = await api.get("/members/profile/schema/");
  return response.data; //or response? When to choose?
};

export const getMembersSummarySchemaFn = async () => {
  const response = await api.get("/members/summary/schema/");
  return response.data; //or response? When to choose?
};

export const getMembersSchemaFn = async () => {
  const response = await api.get("/members/members/schema/");
  return response.data; //or response? When to choose?
};

export const getMembersEmailCampaignsFn = async () => {
  return await api.get("/members/emails/campaigns/");
};

export const getMembersEmailTemplatesFn = async () => {
  return await api.get("/members/emails/templates/");
};

export const getMembersEmailDesignsFn = async () => {
  return await api.get("/members/emails/designs/");
};

export const getRegisterSchemaFn = async () => {
  const response = await api.get("/members/register/schema");
  return response.data;
};

export const registerMemberFn = async (member: any) => {
  const response = await api.post("/members/register", member);
  return response.data;
};

export const endpoints = {
  // Members
  membersEmailsDesigns: "/members/emails/designs/",
  membersEmailsTemplates: "/members/emails/templates/",
  membersEmailsCampaigns: "/members/emails/campaigns/",
  membersSkills: "/members/skills/",
  membersGroups: "/members/groups/",
};

export const API = {
  get: async function (endpoint: keyof typeof endpoints, pk?: Number) {
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
