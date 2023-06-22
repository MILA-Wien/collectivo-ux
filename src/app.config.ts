export const baseURL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "VITE_API_URL_value";
export const keycloakURL = import.meta.env.VITE_KEYCLOAK_URL
  ? import.meta.env.VITE_KEYCLOAK_URL
  : "VITE_KEYCLOAK_URL_value";

export default {
  baseURL,
  keycloakURL,
};
