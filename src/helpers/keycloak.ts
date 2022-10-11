import Keycloak from "keycloak-js";
import { useUserStore } from "@/stores/user";

const initOptions = {
  url: "http://127.0.0.1:8080/",
  realm: "collectivo",
  clientId: "collectivo-ux",
  onLoad: <Keycloak.KeycloakOnLoad>"login-required", // login-required means that the user will be redirected to the login page if not already authenticated
};

function initKeycloak() {
  const store = useUserStore();

  const keycloak = new Keycloak(initOptions);
  keycloak.redirectUri = window.location.origin + "/";
  keycloak.onAuthSuccess = () => {
    store.setToken(keycloak.token);
    store.setRefreshToken(keycloak.refreshToken);
    store.setTokenParsed(keycloak.tokenParsed);
    store.setUserInfo(keycloak.userInfo);
    store.setAuthenticated(true);
    store.setLoginUrl(keycloak.createLoginUrl());
    store.setLogoutUrl(keycloak.createLogoutUrl());
    store.setRegisterUrl(keycloak.createRegisterUrl());
    store.setAccountUrl(keycloak.createAccountUrl());
    store.setRedirectUri(keycloak.redirectUri);
    keycloak
      .loadUserProfile()
      .then(function (profile) {
        store.setProfile(profile);
      })
      .catch(function () {
        console.log("Failed to load user profile");
      });
  };
  keycloak.onAuthError = () => {
    console.log("onAuthError");
  };
  keycloak.onAuthRefreshSuccess = () => {
    console.log("onAuthRefreshSuccess");
  };
  keycloak.onAuthRefreshError = () => {
    console.log("onAuthRefreshError");
  };
  keycloak.onAuthLogout = () => {
    console.log("onAuthLogout");
  };
  keycloak.onTokenExpired = () => {
    console.log("onTokenExpired");
  };
  keycloak.init({ onLoad: initOptions.onLoad, checkLoginIframe: false });
}
export { initKeycloak };
