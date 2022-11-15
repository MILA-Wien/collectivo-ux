import { defineStore } from "pinia";
import { updateMembershipFn, getMembershipFn } from "@/api/api";
import type { Member, Membership } from "@/api/types";

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
    async updateMembership(membership: Member) {
      await updateMembershipFn(membership).then((response) => {
        console.log("updateMembership", response.data);
      }).catch(error => {
        console.log("put membership error", error);
      });
    },
    async getMembership() {
      await getMembershipFn().then((response) => {
        if (this.membership === null) {
          this.membership = { profile: [] };
        }
        this.membership = { profile: [response] };
      })
        .catch((error) => {
          console.log("get membership error", error);
        });
    },
  },
  getters: {},
});
