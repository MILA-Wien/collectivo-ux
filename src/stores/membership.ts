import { defineStore } from "pinia";
import { updateMembershipFn, getMembershipFn } from "@/api/api";
import type { Member } from "@/api/types";

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
    async updateMembership(membership: Member) {
      await updateMembershipFn(membership).then((response) => {
        this.membership = membership;
      }).catch(error => {
        console.log("put membership error", error);
      });
    },
    async getMembership() {
      await getMembershipFn().then((response) => {
        if (this.membership === null) {
          this.membership = { user_attr: "" };
        }
        this.membership = {
          id: response.id,
          user_id: response.user_id,
          user_attr: response.user_attr,
          create_attr: response.create_attr,
          admin_attr: response.admin_attr
        };
      })
        .catch((error) => {
          console.log("get membership error", error);
        });
    },
  },
  getters: {},
});
