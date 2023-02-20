<script setup lang="ts">
import { ref } from "vue";
import { useMembersStore } from "@/stores/members";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import MembersProfile from "./MembersProfile.vue";
import PrimeProgressSpinner from "primevue/progressspinner";

const menuStore = useMenuStore();
menuStore.setTitle("Membership");
const error = ref<Object | null>(null);
const membersStore = useMembersStore();
membersStore.get("membersProfile").catch((e: any) => {
  error.value = e;
});
const { membersProfile } = storeToRefs(membersStore);
</script>

<template>
  <div v-if="error !== null">
    <p>There was an error loading the data.</p>
  </div>
  <div v-else-if="!membersProfile.loaded">
    <PrimeProgressSpinner />
  </div>
  <div v-else>
    <MembersProfile
      :membership="membersProfile.data"
      :membershipSchema="membersProfile.schema"
    />
  </div>
</template>

<style scoped>
.error-message {
  border: 1px solid red;
  padding: 10px;
  border-radius: 5px;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
</style>
