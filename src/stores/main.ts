// Main store to handle CRUD requests for all registered endpoints
import { API, endpoints } from "@/api/api";
import { defineStore } from "pinia";
import type { DataObject, DataSchema, Schema } from "../api/types";
import { DataTemplate } from "../api/types";

type mainStore = { [index: string]: DataSchema };

async function storeCreate(store: any, objectName: any, payload?: Object) {
  const response = await API.post(objectName, payload);
  const object = store[objectName];
  object.list.push(response.data);
  object.detail = response.data;
  return response;
}

function extendSchema(schema: Schema) {
  // Transform choices dict into an options list
  for (const value of Object.values(schema.fields)) {
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

export const useMainStore = defineStore({
  id: "members",
  state: () => {
    const store = {} as mainStore;
    for (const objectName of Object.keys(endpoints)) {
      store[objectName] = JSON.parse(JSON.stringify(DataTemplate));
    }
    return store;
  },

  actions: {
    async getDetail(objectName: any, id?: Number, force?: boolean) {
      return this.get(objectName, id, force, true);
    },

    async get(
      objectName: keyof typeof endpoints,
      id?: Number, // Get detail with given id, otherwise get list
      force?: boolean, // Reload data even if already loaded
      detail?: boolean // Get detail even if no id is given
    ) {
      // Get schema if not already loaded
      this.getSchema(objectName);

      // Case 1 - Get detail
      if (id || detail) {
        if (!force && this[objectName].detailLoaded) {
          return;
        }

        // Get object and save in store
        this[objectName].detailLoaded = false;
        const objects = await API.get(objectName, id);

        // Throw error if response does not match store data type
        if (objects.data.results instanceof Array) {
          throw new Error("Receiving list, expecting detail.");
        }

        // Save object in store
        this[objectName].detail = objects.data;
        this[objectName].detailLoaded = true;
        return;
      }

      // Case 2 - Get list
      this[objectName].listLoaded = false;
      const objects = await API.get(objectName, id);

      // Throw error if response does not match store data type
      if (!(objects.data.results instanceof Array)) {
        throw new Error("Receiving detail, expecting list.");
      }

      // Save data in store
      this[objectName].list = objects.data.results;
      this[objectName].listLoaded = true;
      this[objectName].listTotalRecords = parseInt(objects.data.count);
    },

    // Get schema and save in store
    async getSchema(objectName: any, force?: boolean) {
      if (!force && this[objectName].schemaLoaded) {
        return;
      }
      this[objectName].schemaLoaded = false;
      const schema = await API.getSchema(objectName);
      this[objectName].schema = extendSchema(schema.data);
      this[objectName].schemaLoaded = true;
    },
    async create(objectName: any, payload?: Object) {
      return storeCreate(this, objectName, payload);
    },
    async update(objectName: any, payload: Object, id?: Number) {
      // Update object and save in store
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
    async delete(objectName: any, id: Number) {
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
    async filter(objectName: any, page?: any, order?: any, filters?: any) {
      // Get schema if not already loaded
      this.getSchema(objectName);
      this[objectName].listLoaded = false;

      // Get schema and object(s) and save in store
      const objects = await API.get(
        objectName,
        undefined,
        page.page,
        page.rows,
        order,
        filters
      );

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
      this[objectName].listLoaded = true;
      this[objectName].listTotalRecords = parseInt(objects.data.count);
    },
  },
});
