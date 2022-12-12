import { getRegisterSchemaFn, registerMemberFn } from "./../api/api";
import type { Members, Member, Schema } from "./../api/types";
import { defineStore } from "pinia";
import { membersMembersFn, membersMembersPatch } from "@/api/api";

type MembersState = {
  members: Members | null;
  membersLoaded: boolean;
  membersLoadingError: string | null;
  registrationSchema: Schema | null;
  registrationFinished: boolean;
};

export const useMembersStore = defineStore({
  id: "members",
  state: () =>
  ({
    members: null,
    membersLoaded: false,
    membersLoadingError: null,
    registrationSchema: null,
    registrationFinished: false,
  } as MembersState),
  actions: {
    async getMembers() {
      membersMembersFn()
        .then((response) => {
          if (this.members === null) {
            this.members = { results: [] };
          }
          this.members.results = response.data;
          this.membersLoaded = true;
          this.membersLoadingError = null;
        })
        .catch((error) => {
          console.log("members error", error);
          this.membersLoadingError = error.message;
        });
    },
    async getMembersNext(nextUrl: string) {
      console.log("nextUrl", nextUrl);
    },
    async getMembersPrevious(previousUrl: string) {
      console.log("previousUrl", previousUrl);
    },
    async getMembersDetail(id: string) {
      console.log("id", id);
    },
    async updateMember(member: Member) {
      const response = await membersMembersPatch(member)
      // Save updated member data in store
      const memberIndex = this.members?.results?.findIndex((m: Member) => {
        return m.id === response.data.id;
      });
      if (memberIndex !== null && memberIndex !== undefined) {
        this.members!.results![memberIndex] = response.data;
      }
      return response
    },
    async deleteMember(member: Member) {
      alert("deleteMember not yet implemented " + member.id);
    },
    async register(registrationData: any) {
      return registerMemberFn(registrationData);
    },
    async loadRegisterSchema() {
      getRegisterSchemaFn().then((response) => {
        this.registrationSchema = response;
      });
    },
    setRegistrationFinished() {
      this.registrationFinished = true;
    }
  },
});
