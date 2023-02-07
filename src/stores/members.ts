import type { DataObject, DataDetail, DataList } from "./../api/types";
import { DataDetailTemplate, DataListTemplate } from "./../api/types";
import { defineStore } from "pinia";
import { API } from "@/api/api";

type membersStore = {
  membersMembers: DataDetail;
  membersSummary: DataList;
  membersProfile: DataDetail;
  membersRegister: DataDetail;
  membersTags: DataList;
  membersEmailsCampaigns: DataList;
  membersEmailsTemplates: DataList;
  membersEmailsDesigns: DataList;
};

type membersObject = keyof membersStore;

export const useMembersStore = defineStore({
  id: "members",
  state: () =>
    ({
      membersMembers: JSON.parse(JSON.stringify(DataDetailTemplate)),
      membersSummary: JSON.parse(JSON.stringify(DataListTemplate)),
      membersProfile: JSON.parse(JSON.stringify(DataDetailTemplate)),
      membersRegister: JSON.parse(JSON.stringify(DataDetailTemplate)),
      membersTags: JSON.parse(JSON.stringify(DataListTemplate)),
      membersEmailsCampaigns: JSON.parse(JSON.stringify(DataListTemplate)),
      membersEmailsTemplates: JSON.parse(JSON.stringify(DataListTemplate)),
      membersEmailsDesigns: JSON.parse(JSON.stringify(DataListTemplate)),
    } as membersStore),

  actions: {
    async get(objectName: membersObject, pk?: Number) {
      // Get schema and object(s) and save in store
      const [schema, objects] = await Promise.all([
        API.getSchema(objectName),
        API.get(objectName, pk),
      ]);

      // Throw error if response does not match store data type
      if (
        (this[objectName].data instanceof Array &&
          !(objects.data instanceof Array)) ||
        (!(this[objectName].data instanceof Array) &&
          objects.data instanceof Array)
      ) {
        throw new Error("API response does not match store data type.");
      }

      // Extend schema
      for (const value of Object.values(schema.data) as any) {
        if (value.choices == undefined) {
          continue;
        }
        value.options = [];
        let i = 0;
        for (const [key2, value2] of Object.entries(value.choices) as any) {
          const parsed = parseInt(key2);
          const key3 = isNaN(parsed) ? key2 : parsed;
          value.options.push({
            label: value2,
            value: key3,
            key: ++i,
          });
        }
      }
      // Save data in store
      this[objectName].data = objects.data;
      this[objectName].schema = schema.data;
      this[objectName].loaded = true;
      this[objectName].schemaLoaded = true;
    },
    async getSchema(objectName: membersObject) {
      // Get schema and save in store
      const schema = await API.getSchema(objectName);
      this[objectName].schema = schema.data;
      this[objectName].schemaLoaded = true;
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
    async update(objectName: membersObject, payload: Object, pk?: Number) {
      // Update object and save in store
      const response = await API.patch(objectName, payload, pk);
      let object = this[objectName];

      // Special case for membersMembers: Update added to summary list
      if (objectName == "membersMembers") {
        object = this["membersSummary"];
      }

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
        const index = object.data.findIndex((m: DataObject) => {
          return m.id === pk;
        });
        if (index == -1) {
          throw `Object with id ${pk} not found in store`;
        }
        if (index !== null && index !== undefined) {
          object.data.splice(index, 1);
        }
      } else {
        object.data = { id: null };
      }
      return response;
    },
  },
});
