import { API, endpoints } from "@/api/api";
import { defineStore } from "pinia";
import type { DataObject, DataSchema } from "./../api/types";
import { DataTemplate } from "./../api/types";

type membersObject = keyof typeof endpoints;
type membersStore = { [index: string]: DataSchema };

async function storeCreate(
  store: any,
  objectName: membersObject,
  payload?: Object
) {
  const response = await API.post(objectName, payload);
  const object = store[objectName];
  object.list.push(response.data);
  object.detail = response.data;
  return response;
}

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

const DirectDetailEndpoints = new Set([
  "profilesProfilesSelf",
  "lotzappSettings",
]);

export const useMembersStore = defineStore({
  id: "members",
  state: () => {
    const store = {} as membersStore;
    for (const objectName of Object.keys(endpoints)) {
      store[objectName] = JSON.parse(JSON.stringify(DataTemplate));
    }
    return store;
  },

  actions: {
    async get(objectName: keyof typeof endpoints, id?: Number) {
      if (id || DirectDetailEndpoints.has(objectName)) {
        this[objectName].detailLoaded = false;
        // Get schema and object(s) and save in store
        const [schema, objects] = await Promise.all([
          API.getSchema(objectName),
          API.get(objectName, id),
        ]);
        // Throw error if response does not match store data type
        if (objects.data.results instanceof Array) {
          throw new Error("Receiving list, expecting detail.");
        }
        // Save detail in store
        this[objectName].schema = extendSchema(schema.data);
        this[objectName].schemaLoaded = true;
        this[objectName].detail = objects.data;
        this[objectName].detailLoaded = true;
        return;
      }

      this[objectName].listLoaded = false;
      const [schema, objects] = await Promise.all([
        API.getSchema(objectName),
        API.get(objectName, id),
      ]);

      // Throw error if response does not match store data type
      if (!(objects.data.results instanceof Array)) {
        throw new Error("Receiving detail, expecting list.");
      }

      // Save data in store
      this[objectName].list = objects.data.results;
      this[objectName].listLoaded = true;
      this[objectName].listTotalRecords = parseInt(objects.data.count);
      this[objectName].schema = extendSchema(schema.data);
      this[objectName].schemaLoaded = true;
    },
    async getSchema(objectName: membersObject) {
      // Get schema and save in store
      const schema = await API.getSchema(objectName);
      this[objectName].schema = extendSchema(schema.data);
      this[objectName].schemaLoaded = true;
    },
    async create(objectName: membersObject, payload?: Object) {
      return storeCreate(this, objectName, payload);
    },
    async update(objectName: membersObject, payload: Object, id?: Number) {
      // Update object and save in store
      if (DirectDetailEndpoints.has(objectName)) {
        id = undefined;
      }
      let response: any = null;
      response = await API.patch(objectName, payload, id);

      const object = this[objectName];

      const index = object.list.findIndex((m: DataObject) => {
        return m.id === response.data.id;
      });
      if (index !== null && index !== undefined) {
        object.list[index] = response.data;
      }
      object.detail = response.data;
    },
    async delete(objectName: membersObject, id: Number) {
      // Delete object and remove from store
      const response = await API.delete(objectName, id);
      const object = this[objectName];

      const index = object.list.findIndex((m: DataObject) => {
        return m.id === id;
      });
      if (index == -1) {
        throw `Object with id ${id} not found in store`;
      }
      if (index !== null && index !== undefined) {
        object.list.splice(index, 1);
      }
      object.detail = { id: null };

      return response;
    },
    async getMilaMembershipNumber() {
      await this.get("membershipsMembershipsSelf");
      const m = this.membershipsMembershipsSelf.list.filter(
        (e: any) => e.type.name == "MILA Mitmach-Supermarkt e. G."
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
        (this[objectName].list instanceof Array &&
          !(objects.data.results instanceof Array)) ||
        (!(this[objectName].list instanceof Array) &&
          objects.data instanceof Array)
      ) {
        throw new Error("API response does not match store list type.");
      }
      // Save list in store
      this[objectName].list = objects.data.results;
      this[objectName].schema = extendSchema(schema.data);
      this[objectName].listLoaded = true;
      this[objectName].schemaLoaded = true;
      this[objectName].listTotalRecords = parseInt(objects.data.count);
    },
  },
});
