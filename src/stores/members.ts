import type { DataObject, DataDetail, DataList } from "./../api/types";
import { defineStore } from "pinia";
import { API } from "@/api/api";

type membersStore = {
  membersSummary: DataList,
  membersMembers: DataDetail,
  membersProfile: DataDetail,
  membersRegister: DataDetail,
  membersEmailsCampaigns: DataList,
  membersEmailsTemplates: DataList,
  membersEmailsDesigns: DataList,
}
type membersObject = keyof membersStore;

export const useMembersStore = defineStore({
  id: "members",
  state: () => ({
    membersMembers: {schema: {}, data: {id: null}, loaded: false},
    membersSummary: {schema: {}, data: [], loaded: false},
    membersProfile: {schema: {}, data: {id: null}, loaded: false},
    membersRegister: {schema: {}, data: {id: null}, loaded: false},
    membersEmailsCampaigns: {schema: {}, data: [], loaded: false},
    membersEmailsTemplates: {schema: {}, data: [], loaded: false},
    membersEmailsDesigns: {schema: {}, data: [], loaded: false},
  } as membersStore),

  actions: {
    async _get(store: any, objectName: membersObject, pk?: Number) {
      // Get schema and object(s) and save in store
      const [schema, objects] = await Promise.all([
        API.getSchema(objectName),
        API.get(objectName, pk),
      ]);
      // Extend schema
      for (const value of Object.values(schema.data) as any) {
        if (value.choices == undefined) {
          continue;
        }
        value.options = [];
        let i = 0;
        for (const [key2, value2] of Object.entries(value.choices) as any) {
          value.options.push({
            label: value2,
            value: parseInt(key2), // Keys are Integers in actual data
            key: ++i,
          });
        }
      }
      store[objectName].data = objects.data;
      store[objectName].schema = schema.data;
      store[objectName].loaded = true;
    },
    async getList(objectName: membersObject) {
      // Get schema and list of objects and save in store
      if (!(this[objectName].data instanceof Array)) {
        throw `Object ${objectName} needs to be called with getDetail`;
      }
      this._get(this, objectName);
    },
    async getDetail(objectName: membersObject, pk: Number) {
      // Get schema and single object and save in store
      if ((this[objectName].data instanceof Array)) {
        throw `Object ${objectName} needs to be called with getList`;
      }
      this._get(this, objectName, pk);
    },
    async update(objectName: membersObject, pk: Number, payload: Object) {
      // Update object and save in store
      const response = await API.patch(objectName, pk, payload);
      const object = this[objectName];
      if (object.data instanceof Array) {
        const index = object.data.findIndex((m: DataObject) => {
          return m.id === response.data.id;
        });
        if (index !== null && index !== undefined) {
          object.data[index] = response.data;
        }
      } else {
        object.data = response.data;
      }
    },
    async delete(objectName: membersObject, pk: Number) {
      // Delete object and remove from store
      const response = await API.delete(objectName, pk);
      const object = this[objectName];
      if (object.data instanceof Array) {
        const index = this[objectName]?.data?.findIndex((m: DataObject) => {
          return m.id === response.data.id;
        });
        if (index !== null && index !== undefined) {
          object.data.splice(index, 1);
        }
      } else {
        object.data = {id: null};
      }
      return response;
    },
    async create(objectName: membersObject, payload: Object) {
      const response = await API.post(objectName, payload);
      const object = this[objectName];
      if (object.data instanceof Array) {
        object.data.push(response.data);
      } else {
        object.data = response.data;
      }
      return response;
    },
  },
});
