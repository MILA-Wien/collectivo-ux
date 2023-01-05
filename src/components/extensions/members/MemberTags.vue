<script setup lang="ts">
import { ref } from "vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import MemberTagsTable from "./MemberTagsTable.vue";
import ProgressSpinner from 'primevue/progressspinner';

const menuStore = useMenuStore();
menuStore.setTitle("Member Tags");

const membersStore = useMembersStore();
const { tags } = storeToRefs(membersStore);

const error = ref<Object|null>(null);
membersStore.getTags().catch((e) => {error.value = e});

</script>

<template>
  <div>
    <div v-if="error !== null">
      <p>There was an error loading the data. <br/> {{error}}</p>
    </div>
    <div v-else-if="tags === null">
      <ProgressSpinner />
    </div>
    <div v-else>
      <MemberTagsTable :rows="tags"/>
    </div>
  </div>
</template>

<style scoped>
</style>
