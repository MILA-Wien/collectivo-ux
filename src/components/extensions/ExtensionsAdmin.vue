<script setup lang="ts">
import ObjectLoader from "@/components/datatable/ObjectLoader.vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import PrimePanel from "primevue/panel";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const membersStore = useMembersStore();
const menuStore = useMenuStore();
menuStore.setTitle("Extensions");
</script>

<template>
  <div class="h-full tabview-full" id="tags-admin">
    <ObjectLoader
      :store="membersStore"
      :name="'extensionsExtensions'"
      :display-type="'list'"
    >
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
    </ObjectLoader>
  </div>
</template>
