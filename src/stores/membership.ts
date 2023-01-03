import { defineStore } from "pinia";
import {
  updateMembershipFn,
  getProfileSchemaFn,
  getMembershipFn,
} from "@/api/api";
import type { Member, Schema } from "@/api/types";

export type MembershipStoreState = {
  membership: Member | null;
  membershipSchema: Schema | null;
};

export const useMembershipStore = defineStore({
  id: "membership",
  state: () =>
    ({
      membership: null,
      membershipSchema: null,
    } as MembershipStoreState),

  actions: {
    async updateMembership(membership: Member) {
      await updateMembershipFn(membership);
      this.membership = membership;
    },
    async getMembership() {
      await getMembershipFn()
        .then((response) => {
          if (response === null) {
            this.membership = {};
          }
          this.membership = response
        })
        .catch((error) => {
          console.log("get membership error", error);
        });
    },
    async getMembershipSchema() {
      await getProfileSchemaFn()
        .then((response: null | Schema) => {
          if (response === null) {
            this.membershipSchema = {};
          }
          this.membershipSchema = response;
        })
        .catch((error) => {
          console.log("get membershipSchema error", error);
        });
    },
  },
  getters: {},
});
