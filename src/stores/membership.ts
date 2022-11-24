import { defineStore } from "pinia";
import { updateMembershipFn, getProfileSchemaFn, getMembershipFn } from "@/api/api";
import type { Member } from "@/api/types";

export type MembershipStoreState = {
  membership: Member | null;
  membershipSchema: Member | null;
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
      await updateMembershipFn(membership).then(() => {
        this.membership = membership;
      }).catch(error => {
        console.log("put membership error", error);
      });
    },
    async getMembership() {
      await getMembershipFn().then((response) => {
        if (response === null) {
          this.membership = { first_name: "", last_name: "", email: "" };
        }
        this.membership = {
          title_pre: response.title_pre,
          title_post: response.title_post,
          first_name: response.first_name,
          last_name: response.last_name,
          gender: response.gender,
          date_birth: response.date_birth,
          email: response.email,
          email_2: response.email_2,
          phone: response.phone,
          phone_2: response.phone_2,
          address_street: response.address_street,
          address_number: response.address_number,
          address_is_home: response.address_is_home,
          address_co: response.address_co,
          address_stair: response.address_stair,
          address_door: response.address_door,
          address_postcode: response.address_postcode,
          address_city: response.address_city,
          address_country: response.address_country,
          legal_name: response.legal_name,
          legal_type: response.legal_type,
          legal_seat: response.legal_seat,
          legal_type_id: response.legal_type_id,
          id: response.id,
        };
      })
        .catch((error) => {
          console.log("get membership error", error);
        });
    },
    async getMembershipSchema() {
      await getProfileSchemaFn().then((response) => {
        if (response === null) {
          this.membershipSchema = { first_name: "", last_name: "", email: "" };
        }
        this.membershipSchema = {
          title_pre: response.title_pre,
          title_post: response.title_post,
          first_name: response.first_name,
          last_name: response.last_name,
          gender: response.gender,
          date_birth: response.date_birth,
          email: response.email,
          email_2: response.email_2,
          phone: response.phone,
          phone_2: response.phone_2,
          address_street: response.address_street,
          address_number: response.address_number,
          address_is_home: response.address_is_home,
          address_co: response.address_co,
          address_stair: response.address_stair,
          address_door: response.address_door,
          address_postcode: response.address_postcode,
          address_city: response.address_city,
          address_country: response.address_country,
          legal_name: response.legal_name,
          legal_type: response.legal_type,
          legal_seat: response.legal_seat,
          legal_type_id: response.legal_type_id,
          id: response.id,
        };
      })
        .catch((error) => {
          console.log("get membershipSchema error", error);
        });
    },
  },
  getters: {},
});
