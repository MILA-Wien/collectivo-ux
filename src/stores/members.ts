import { API } from "@/api/api";
import { defineStore } from "pinia";
import type { DataDetail, DataList, DataObject } from "./../api/types";
import { DataDetailTemplate, DataListTemplate } from "./../api/types";

type membersStore = {
  coreUsers: DataList;
  coreGroups: DataList;
  membersMembers: DataList;
  membersProfile: DataDetail;
  membersRegister: DataDetail;
  membersMemberships: DataList;
  tagsTags: DataList;
  tagsCategories: DataList;
  emailsCampaigns: DataList;
  emailsTemplates: DataList;
  emailsDesigns: DataList;
};

type membersObject = keyof membersStore;

function extendSchema(schema: any) {
  // Transform choices dict into an options list
  for (const value of Object.values(schema) as any) {
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
  return schema;
}

export const useMembersStore = defineStore({
  id: "members",
  state: () =>
    ({
      coreUsers: JSON.parse(JSON.stringify(DataListTemplate)),
      coreGroups: JSON.parse(JSON.stringify(DataListTemplate)),
      membersMembers: JSON.parse(JSON.stringify(DataListTemplate)),
      membersProfile: JSON.parse(JSON.stringify(DataDetailTemplate)),
      membersRegister: JSON.parse(JSON.stringify(DataDetailTemplate)),
      membersMemberships: JSON.parse(JSON.stringify(DataListTemplate)),
      tagsTags: JSON.parse(JSON.stringify(DataListTemplate)),
      tagsCategories: JSON.parse(JSON.stringify(DataListTemplate)),
      emailsCampaigns: JSON.parse(JSON.stringify(DataListTemplate)),
      emailsTemplates: JSON.parse(JSON.stringify(DataListTemplate)),
      emailsDesigns: JSON.parse(JSON.stringify(DataListTemplate)),
    } as membersStore),

  actions: {
    async get(objectName: membersObject, id?: Number) {
      this[objectName].loaded = false;
      // Get schema and object(s) and save in store
      const [schema, objects] = await Promise.all([
        API.getSchema(objectName),
        API.get(objectName, id),
      ]);

      // Throw error if response does not match store data type
      if (
        (this[objectName].data instanceof Array &&
          !(objects.data.results instanceof Array)) ||
        (!(this[objectName].data instanceof Array) &&
          objects.data instanceof Array)
      ) {
        throw new Error("API response does not match store data type.");
      }
      // Save data in store
      if (objects.data.results instanceof Array) {
        this[objectName].data = objects.data.results;
      } else {
        this[objectName].data = objects.data;
      }
      this[objectName].schema = extendSchema(schema.data);
      this[objectName].loaded = true;
      this[objectName].schemaLoaded = true;
      //@ts-ignore
      this[objectName].totalRecords = parseInt(objects.data.count);
    },
    async getSchema(objectName: membersObject) {
      // Get schema and save in store
      const schema = await API.getSchema(objectName);
      this[objectName].schema = extendSchema(schema.data);
      this[objectName].schemaLoaded = true;
    },
    async create(objectName: membersObject, payload: Object) {
      const response = await API.post(objectName, payload);
      let object = this[objectName];

      if (object.data instanceof Array) {
        object.data.push(response.data);
      } else {
        object.data = response.data;
      }
      return response;
    },
    async update(objectName: membersObject, payload: Object, id?: Number) {
      // Update object and save in store
      const response = await API.patch(objectName, payload, id);
      let object = this[objectName];

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
    async delete(objectName: membersObject, id: Number) {
      // Delete object and remove from store
      const response = await API.delete(objectName, id);
      const object = this[objectName];
      if (object.data instanceof Array) {
        const index = object.data.findIndex((m: DataObject) => {
          return m.id === id;
        });
        if (index == -1) {
          throw `Object with id ${id} not found in store`;
        }
        if (index !== null && index !== undefined) {
          object.data.splice(index, 1);
        }
      } else {
        object.data = { id: null };
      }
      return response;
    },
    async getMilaMembershipNumber() {
      await this.get("membersProfile");
      const m = this.membersProfile.data.memberships?.filter(
        (e: any) => e.type.name == "MILA Genossenschaft"
      );
      if (m.length > 0) {
        return m[0].number;
      }
      return false;
    },
    async filter(
      objectName: membersObject,
      page?: any,
      order?: any,
      filters?: any
    ) {
      // Get schema and object(s) and save in store
      const [schema, objects] = await Promise.all([
        API.getSchema(objectName),
        API.get(objectName, undefined, page.page, page.rows, order, filters),
      ]);

      // Throw error if response does not match store data type
      if (
        (this[objectName].data instanceof Array &&
          !(objects.data.results instanceof Array)) ||
        (!(this[objectName].data instanceof Array) &&
          objects.data instanceof Array)
      ) {
        throw new Error("API response does not match store data type.");
      }
      // Save data in store
      this[objectName].data = objects.data.results;
      this[objectName].schema = extendSchema(schema.data);
      this[objectName].loaded = true;
      this[objectName].schemaLoaded = true;
      //@ts-ignore totalRecords exists on DataList
      this[objectName].totalRecords = parseInt(objects.data.count);
    },
  },
});
