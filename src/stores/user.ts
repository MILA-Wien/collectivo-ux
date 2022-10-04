import { defineStore } from "pinia";
import { loginFn } from "@/api/api";
import type { User, LoginData } from "@/api/types";

export type UserStoreState = {
  user: User | null;
  isLoggedIn: boolean;
};


export const useUserStore = defineStore({
  id: "settings",
  state: () =>
    ({
      user: null,
      isLoggedIn: false,
    } as UserStoreState),

  actions: {
    async login(data: LoginData) {
      this.version = await loginFn(data);
    },
  },
  getters: {},
});
