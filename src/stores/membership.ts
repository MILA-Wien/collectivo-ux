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
          this.membership = {
            first_name: response.first_name,
            last_name: response.last_name,
            shares_number: response.shares_number,
            gender: response.gender,
            occupation: response.occupation,
            phone: response.phone,
            email: response.email,
            address_street: response.address_street,
            address_number: response.address_number,
            address_stair: response.address_stair,
            address_door: response.address_door,
            address_postcode: response.address_postcode,
            address_city: response.address_city,
            address_country: response.address_country,
            id: response.id,
            membership_start: response.membership_start,
          };
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
