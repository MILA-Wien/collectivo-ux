import {
  getMembersSchemaFn,
  getMembersSummarySchemaFn,
  getRegisterSchemaFn,
  registerMemberFn,
  getMembersEmailCampaignsFn,
  getMembersEmailTemplatesFn,
  getMembersEmailDesignsFn,
} from "./../api/api";
import type { Members, Member, Schema } from "./../api/types";
import { defineStore, storeToRefs } from "pinia";
import { membersMembersFn, membersMembersPatch, APIObjects, get } from "@/api/api";



type MembersState = {
  members: Members | null;
  membersSchema: Schema | null;
  summarySchema: Schema | null;
  membersLoaded: boolean;
  membersLoadingError: string | null;
  registrationSchema: Schema | null;
  registrationFinished: boolean;
  membersEmailsCampaigns: any;
  membersEmailsTemplates: any;
  membersEmailsDesigns: any;
};

// Create type that is overlap between APIObjects and MembersState
type MembersAPIObjects = keyof typeof APIObjects & keyof MembersState;

function createObjectManager(objectName: MembersAPIObjects, store: any) {
  if (store[objectName] === undefined) {
    throw new Error(`Object ${objectName} does not exist in store`);
  }
  return {
    objectName: objectName,
    async get() {
      const response = await get(objectName);
      store[objectName] = response.data;
    }
  }
}

export const useMembersStore = defineStore({
  id: "members",
  state: () =>
    ({
      members: null,
      membersSchema: null,
      summarySchema: null,
      membersLoaded: false,
      membersLoadingError: null,
      registrationSchema: null,
      registrationFinished: false,
      membersEmailsCampaigns: null,
      membersEmailsTemplates: null,
      membersEmailsDesigns: null,
    } as MembersState),
  actions: {
    async getMembers() {
      try {
        const [membersSchema, summarySchema, members] = await Promise.all([
          getMembersSchemaFn(),
          getMembersSummarySchemaFn(),
          membersMembersFn(),
        ]);
        this.membersSchema = membersSchema;
        this.summarySchema = summarySchema;

        if (this.members === null) {
          this.members = { results: [] };
        }
        this.members.results = members.data;
        this.membersLoaded = true;
        this.membersLoadingError = null;
      } catch (error: any) {
        console.log("members error", error);
        this.membersLoadingError = error.message;
      }
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
      const response = await membersMembersPatch(member);
      // Save updated member data in store
      const memberIndex = this.members?.results?.findIndex((m: Member) => {
        return m.id === response.data.id;
      });
      if (memberIndex !== null && memberIndex !== undefined) {
        this.members!.results![memberIndex] = response.data;
      }
      return response;
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
    },
    getManager(objectName: keyof typeof APIObjects) {
      return createObjectManager(objectName, this)
    },
  },
});
