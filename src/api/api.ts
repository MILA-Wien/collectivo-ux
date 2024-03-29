import { baseURL } from "@/app.config";
import { extensions } from "@/helpers/settings";
import i18n from "@/locales/i18n";
import { useUserStore } from "@/stores/user";
import type { AxiosResponse } from "axios";
import axios from "axios";
const BASE_URL = baseURL.trim() + "/api/";
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
  const response = await api.get("/core/about/");
  return response.data;
};

export const coreMenuItemsFn = async () => {
  const response = await api.get("/menus/menus/?extension=core&menu=main");
  return response.data[0];
};

export const dashboardTiles = async () => {
  const response = api.get(`/dashboard/tiles/self/?limit=10`);
  return response;
};

// Import external endpoints from extensions
const external_endpoints: { [index: string]: string } = {};
for (const extension of extensions) {
  if (extension.endpoints !== undefined) {
    for (const key of Object.keys(extension.endpoints)) {
      external_endpoints[key] = extension.endpoints[key] as string;
    }
  }
}

// Endpoint dictionary
export const endpoints = {
  coreAbout: "/core/about/",
  coreUsers: "/core/users/",
  coreProfile: "/core/profile/",
  coreSettings: "/core/settings/",
  coreUsersExtended: "/core/users-extended/",
  coreGroups: "/core/groups/",
  coreGroupsHistory: "/core/groups-history/",
  corePermissions: "/core/permissions/",
  componentsComponents: "/components/components/",
  extensionsExtensions: "/extensions/extensions/",

  dashboardTiles: "/dashboard/tiles/",
  dashboardTilesSelf: "/dashboard/tiles/self/",
  dashboardTileButtons: "/dashboard/buttons/",

  menusMenus: "/menus/menus/",
  menusMenusMain: "/menus/menus/core/main/",
  menusMenusAdmin: "/menus/menus/core/admin/",
  menusMenuItems: "/menus/menuitems/",

  profilesProfiles: "/profiles/profiles/",
  profilesProfilesSelf: "/profiles/profiles/self/",
  profilesSettings: "/profiles/settings/",

  membershipsMemberships: "/memberships/memberships/",
  membershipsMembershipsHistory: "/memberships/memberships-history/",
  membershipsRegister: "/memberships/register/",
  membershipsMembershipsSelf: "/memberships/memberships/self/",
  membershipsMembershipsShares: "/memberships/memberships/self/sign-shares/",
  membershipsTypes: "/memberships/types/",
  membershipsTypesHistory: "/memberships/types-history/",
  membershipsStatuses: "/memberships/statuses/",
  membershipsProfiles: "/memberships/profiles/",
  membershipsCreateInvoices: "/memberships/memberships/create_invoices/",

  tagsTags: "/tags/tags/",
  tagsTagsHistory: "/tags/tags-history/",
  tagsProfiles: "/tags/profiles/",

  emailProfiles: "/emails/profiles/",
  emailsDesigns: "/emails/designs/",
  emailsTemplates: "/emails/templates/",
  emailsCampaigns: "/emails/campaigns/",
  emailsAutomations: "/emails/automations/",
  emailsSenderConfigs: "/emails/senderconfigs/",
  emailsDesignsHistory: "/emails/designs-history/",
  emailsTemplatesHistory: "/emails/templates-history/",
  emailsCampaignsHistory: "/emails/campaigns-history/",
  emailsAutomationsHistory: "/emails/automations-history/",
  emailsSenderConfigsHistory: "/emails/senderconfigs-history/",

  paymentsProfiles: "/payments/profiles/",
  paymentsProfilesSelf: "/payments/profiles/self/",
  paymentsInvoices: "/payments/invoices/",
  paymentsSubscriptions: "/payments/subscriptions/",

  shiftsShifts: "/shifts/shifts/",
  shiftsAssignments: "shifts/assignments/",
  shiftsShiftsUser: "/shifts/user/",
  shiftsShiftsUserSelf: "/shifts/user/self/",
  shiftsShiftsSelf: "/shifts/shifts/self/",
  shiftsOpenShifts: "/shifts/shifts/open/",

  // unpack external endpoints
  ...external_endpoints,
};

// Generic API functions
export const API = {
  get: async function (
    endpoint: keyof typeof endpoints,
    id?: Number,
    page?: Number,
    rowsPerPage?: Number,
    order?: String,
    filter?: String
  ): Promise<AxiosResponse<any, any>> {
    if (id !== undefined && id !== null) {
      // return a detail single object
      return await api.get(`${endpoints[endpoint]}${id}/`);
    }
    // return a paginated endpoint
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
      api_endpoint = `${api_endpoint}${filter}`;
    }
    if (order !== undefined && order !== null && order !== "null") {
      api_endpoint = `${api_endpoint}&ordering=${order}`;
    }
    return await api.get(api_endpoint);
  },
  getSchema: async function (endpoint: keyof typeof endpoints, id?: Number) {
    if (id === undefined) {
      return await api.get(`${endpoints[endpoint]}schema/`);
    }
    return await api.get(`${endpoints[endpoint]}${id}/schema/`);
  },
  post: async function (endpoint: keyof typeof endpoints, payload?: Object) {
    return await api.post(endpoints[endpoint], payload);
  },
  revert: async function (endpoint: keyof typeof endpoints, id: Number) {
    return await api.post(`${endpoints[endpoint]}${id}/revert/`);
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
  patchBulk: async function (
    endpoint: keyof typeof endpoints,
    payload: Object[]
  ) {
    return await api.patch(`${endpoints[endpoint]}bulk_update/`, payload);
  },
  delete: async function (endpoint: keyof typeof endpoints, id?: Number) {
    if (id === undefined) {
      return await api.delete(endpoints[endpoint]);
    }
    return await api.delete(`${endpoints[endpoint]}${id}/`);
  },
  getWithParams: async function (
    endpoint: keyof typeof endpoints,
    params: Object
  ) {
    return await api.get(endpoints[endpoint], { params });
  },
};
