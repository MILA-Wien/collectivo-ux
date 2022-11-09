import { defineStore } from "pinia";
import { getMembershipFn } from "@/api/api";
import type { Membership } from "@/api/types";

export type MembershipStoreState = {
  membership: Membership | null;
};

export const useMembershipStore = defineStore({
  id: "membership",
  state: () =>
    ({
      membership: null,
    } as MembershipStoreState),

  actions: {
    async getMembership() {
      await getMembershipFn().then((response) => {
        console.log("getMembership", response)
      });
    },
  },
  getters: {},
});
