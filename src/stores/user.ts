import { defineStore } from "pinia";
import type { User } from "@/api/types";

export type UserStoreState = {
  user: User | null;
  isLoggedIn: boolean;
  token: string | undefined;
  authenticated: boolean;
};

export const useUserStore = defineStore({
  id: "user",
  state: () =>
    ({
      user: <User>{
        authenticated: false,
      },
    } as UserStoreState),

  actions: {
    setToken(token: string | undefined) {
      if (token) {
        this.user!.token = token;
      }
    },
    setRefreshToken(refreshToken: string | undefined) {
      if (refreshToken) {
        this.user!.refreshToken = refreshToken;
      }
    },
    setTokenParsed(tokenParsed: any) {
      this.user!.tokenParsed = tokenParsed;
    },
    setUserInfo(userInfo: any) {
      this.user!.userInfo = userInfo;
    },
    setAuthenticated(authenticated: boolean) {
      this.user!.authenticated = authenticated;
    },
    setLoginUrl(loginUrl: string) {
      this.user!.loginUrl = loginUrl;
    },
    setLogoutUrl(logoutUrl: string) {
      this.user!.logoutUrl = logoutUrl;
    },
    setRegisterUrl(registerUrl: string) {
      this.user!.registerUrl = registerUrl;
    },
    setAccountUrl(accountUrl: string) {
      this.user!.accountUrl = accountUrl;
    },
    setRedirectUri(redirectUri: string | undefined) {
      this.user!.redirectUri = redirectUri;
    },
    setProfile(profile: any) {
      this.user!.profile = profile;
    },
  },
  getters: {},
});
