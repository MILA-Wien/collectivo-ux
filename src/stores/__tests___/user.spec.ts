import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "../user";
import { it, describe, expect, beforeEach, test } from "vitest";

describe("User Store", () => {
    beforeEach(() => {
      // creates a fresh pinia and make it active so it's automatically picked
      // up by any useStore() call without having to pass it to it:
      // `useStore(pinia)`
      setActivePinia(createPinia());
    });

    it("should have set authentication status", () => {
        const userStore = useUserStore();
        expect(userStore.user?.authenticated).toBeFalsy;
        userStore.setAuthenticated(true);
        expect(userStore.user?.authenticated).toBeTruthy;
      });

    test("if all setter functions work", () => {
        const userStore = useUserStore();
        expect(userStore.user?.token).toBeNull;

        userStore.setToken("1234567890qewrt");
        expect(userStore.user?.token).toBe("1234567890qewrt");

        userStore.setRefreshToken("asdfgghjklööä0987654321");
        expect(userStore.user?.refreshToken).toBe("asdfgghjklööä0987654321");

        userStore.setKeycloak({userInfo: "userInfo"});
        expect(userStore.keycloak).toStrictEqual({userInfo: "userInfo"});

        userStore.setTokenParsed(918274349);
        expect(userStore.user?.tokenParsed).toBe(918274349);
        expect(userStore.user?.userInfo).toBe("userInfo");

        userStore.setUserInfo({name: test});
        expect(userStore.user?.userInfo).toStrictEqual({name: test});

        userStore.setLoginUrl("0912929");
        expect(userStore.user?.loginUrl).toBe("0912929");

        userStore.setLogoutUrl("Logout");
        expect(userStore.user?.logoutUrl).toBe("Logout");

        userStore.setRegisterUrl("Register");
        expect(userStore.user?.registerUrl).toBe("Register");

        userStore.setAccountUrl("Account");
        expect(userStore.user?.accountUrl).toBe("Account");

        userStore.setRedirectUri("Redirect");
        expect(userStore.user?.redirectUri).toBe("Redirect");

        userStore.setProfile({name: "qwertz"});
        expect(userStore.user?.profile).toStrictEqual({name: "qwertz"});

        userStore.logout();
        expect(userStore).toBeNull;



    });

});