<template>
  <div>
    <h2>{{ `${t("Registration")} ${userStore.user?.tokenParsed?.name}` }}</h2>
    <FormView @formSubmit="submit" v-if="!registrationFinished"></FormView>
    <div v-else>
      <h2>{{ t("Registration finished") }}</h2>
      <p>{{ t("You are now part of the collective") }}</p>
      <PrimeButton @click="router.push('/')" label="Go to home" />
    </div>
  </div>
</template>
<script setup lang="ts">
import FormView from "@/formviewer/components/FormView.vue";
import { useFormViewerStore } from "@/stores/formviewer";
import { storeToRefs } from "pinia";
import treeData from "@/assets/registrationForm.json";
import { useMembersStore } from "@/stores/members";
import { useUserStore } from "@/stores/user";
import { useI18n } from "vue-i18n";
import { defineAsyncComponent, ref } from "vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useRouter } from "vue-router";
const { t } = useI18n();

// store
const formViewerStore = useFormViewerStore();
const { tree } = storeToRefs(formViewerStore);
// @ts-ignore
tree.value = treeData;

const memberStore = useMembersStore();
memberStore.loadRegisterSchema();
const userStore = useUserStore();
const registrationFinished = ref(false);
// check if user is already registered
if (userStore.user?.tokenParsed?.realm_access?.roles?.includes("is_member")) {
  registrationFinished.value = true;
}
function submit() {
  alert("Form submitted");
  const registerData = formViewerStore.values;
  memberStore.register(registerData);
  registrationFinished.value = true;
  // reload the dashboard
  useDashboardStore().getDashboardTiles();
}
// Add informations from keycloak to the form
if (userStore.user) {
  formViewerStore.updateValue("email", userStore.user.tokenParsed.email);
  formViewerStore.updateValue(
    "first_name",
    userStore.user.tokenParsed.family_name
  );
  formViewerStore.updateValue(
    "last_name",
    userStore.user.tokenParsed.given_name
  );
}
const router = useRouter();
const PrimeButton = defineAsyncComponent(() => import("primevue/button"));
</script>
