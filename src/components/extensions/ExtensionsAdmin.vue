<script setup lang="ts">
import ObjectList from "@/components/datatable/ObjectList.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import PrimePanel from "primevue/panel";

const membersStore = useMembersStore();
const menuStore = useMenuStore();
menuStore.setTitle("Extensions");
</script>

<template>
  <div class="h-full tabview-full-height" id="tags-admin">
    <ObjectList :store="membersStore" :name="'extensionsExtensions'">
      <template #item="slotProps">
        <PrimePanel :header="slotProps.data.label" class="mb-5">
          <p class="pb-3">{{ slotProps.data.description }}</p>
          <p>Active: {{ slotProps.data.active }}</p>
          <p>Built-in: {{ slotProps.data.built_in }}</p>
          <p v-if="slotProps.data.version">
            Version: {{ slotProps.data.version }}
          </p>
        </PrimePanel>
      </template>
    </ObjectList>
  </div>
</template>
