import { defineStore } from "pinia";
import { getMembershipFn } from "@/api/api";
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
    async getMembership() {
      await getMembershipFn().then((response) => {
        if (this.membership === null) {
          this.membership = {id: 0, user_id: "", user_attr: "", create_attr: "", admin_attr: ""};
        }
        this.membership = response.data;
      })
      .catch((error) => {
        console.log("membership error", error);
      });
      // await getMembershipFn().then((response) => {
      //   console.log("getMembership", response)
      // });
    },
  },
  getters: {},
});
