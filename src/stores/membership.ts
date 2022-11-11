import { defineStore } from "pinia";
import { createMembershipFn, getMembershipFn } from "@/api/api";
import type { Member, Version } from "@/api/types";

export type MembershipStoreState = {
  membership: Member | null;
};

export const useMembershipStore = defineStore({
  id: "membership",
  state: () =>
  ({
    membership: null,
  } as MembershipStoreState),

  actions: {
    // WIP: Wrong type for POST-Call
    async createMembership(membership: Member) {
      await createMembershipFn(membership).then((response) => {
        console.log("createMembership", response);
      }).catch((error) => {
        console.log("post membership error", error);
      });
    },
    async getMembership() {
      await getMembershipFn().then((response) => {
        if (this.membership === null) {
          this.membership = { id: 0, user_id: "", user_attr: "", create_attr: "", admin_attr: "" };
        }
        this.membership = response;
      })
        .catch((error) => {
          console.log("get membership error", error);
        });
    },
  },
  getters: {},
});
