<script setup lang="ts">
import type { endpoints } from "@/api/api";
import { useMembersStore } from "@/stores/members";
import type { StoreGeneric } from "pinia";
import { storeToRefs } from "pinia";
import PrimeProgressSpinner from "primevue/progressspinner";
import type { PropType } from "vue";
import { ref } from "vue";
import ObjectTableFrame from "./ObjectTableFrame.vue";

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String as PropType<keyof typeof endpoints>,
    required: true,
  },
  defaultColumns: {
    type: Array as PropType<string[]>,
    required: false,
  },
  displayType: {
    type: String as PropType<"table">,
    required: false,
    default: "table",
  },
  emailButton: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const error = ref<Object | null>(null);
const data = storeToRefs(props.store)[props.name];

// Load data
if (!data.value.loaded) {
  props.store.get(props.name).catch((e: any) => {
    error.value = e;
  });
}

// Optional emails schema
const membersStore = useMembersStore();
const { emailsCampaigns } = storeToRefs(membersStore);
if (emailsCampaigns.value.schemaLoaded === false) {
  membersStore.getSchema("emailsCampaigns").catch((e: any) => {
    error.value = e;
  });
}
</script>

<template>
  <div v-if="error !== null">
    <p>There was an error loading the data.<br />{{ error }}</p>
  </div>
  <div v-else-if="!data.loaded">
    <PrimeProgressSpinner />
  </div>
  <div v-else-if="displayType == 'table'" class="h-full">
    <ObjectTableFrame
      :store="store"
      :name="name"
      :objects="data.data"
      :schema="data.schema"
      :default-columns="defaultColumns"
      :emailButton="emailButton"
      :emailCampaignSchema="emailsCampaigns.schema"
    />
  </div>
  <div v-else>
    <p>Invalid display type.</p>
  </div>
</template>
