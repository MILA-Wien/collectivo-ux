import { defineStore } from "pinia";
import type { User } from "@/api/types";

export type UserStoreState = {
  user: User | null;
  isLoggedIn: boolean;
  token: string | undefined;
  authenticated: boolean;
  keycloak: any | null;
};

export const useUserStore = defineStore({
  id: "user",
  state: () =>
  ({
    user: <User>{
      authenticated: false,
    },
    keycloak: null,
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
      if (!this.keycloak) return;
      this.setUserInfo(this.keycloak.userInfo);
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
    setKeycloak(keycloak: any) {
      this.keycloak = keycloak;
    },
    logout() {
      const logOutUrl = this.user!.logoutUrl;
      this.user = null;
      location.href = logOutUrl;
    },
    updateUserInfo() {
      if (!this.keycloak) return;
      return this.keycloak.updateToken(30).then(() => {
        this.setToken(this.keycloak.token);
        this.keycloak.loadUserInfo().then(() => {
          this.user!.userInfo = this.keycloak.userInfo;
        });
      });
    },
    finishRegistration() {
      if (!this.keycloak) return;
      this.keycloak.login();
    }
  },
  getters: {},
});
