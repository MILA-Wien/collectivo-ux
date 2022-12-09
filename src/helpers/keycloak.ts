import Keycloak from "keycloak-js";
import { useUserStore } from "@/stores/user";
import { keycloakURL } from "@/app.config";

const initOptions = {
  url: keycloakURL ? keycloakURL : "http://keycloak:8080",
  realm: "collectivo",
  clientId: "collectivo-ux",
  onLoad: <Keycloak.KeycloakOnLoad>"check-sso", // login-required means that the user will be redirected to the login page if not already authenticated
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
    keycloak.updateToken(30).then(() => {
      store.setToken(keycloak.token);
    });
  };
  keycloak.onReady = (authenticated) => {
    console.log("onReady", authenticated);
    if (!authenticated) {
      keycloak.login({
        locale: "de",
        redirectUri: window.location.origin + window.location.pathname + "/",
      });
    } else {
      store.setKeycloak(keycloak);
    }
  };

  return keycloak.init({
    redirectUri: window.location.origin + window.location.pathname + "/",
    onLoad: initOptions.onLoad,
    checkLoginIframe: false,
    flow: "standard",
  });
}
export { initKeycloak };
