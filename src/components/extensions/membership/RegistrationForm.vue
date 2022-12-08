<template>
  <div>
    <!-- <h2>{{ `${t("Registration")} ${userStore.user?.tokenParsed?.name}` }}</h2> -->
    <div v-for="error of validation.$errors" :key="error.$uid">
      <PrimeMessage v-if="registrationSchema" severity="error">
        {{ t(registrationSchema[error.$propertyPath].label) }}:
        {{ t(error.$message.toString()) }}
      </PrimeMessage>
    </div>
    <FormView @formSubmit="submit" v-if="!registrationFinished"></FormView>
    <div v-else>
      <p class="my-5">{{ t("Deine Beitrittserklärung wurde erfolgreich eingereicht! In den nächsten Tagen senden wir dir eine Email mit den weiteren Schritten.") }}</p>
      <PrimeButton @click="router.push('/')" label="Return to dashboard" />
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
import { defineAsyncComponent, ref, watch } from "vue";
import { useDashboardStore } from "@/stores/dashboard";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import PrimeMessage from "primevue/message";
import { useTitle } from "@/hooks/useTitle";

const title = useTitle();
title.title.value = "Membership application";

const validation = useVuelidate();
const { t } = useI18n();

// store
const formViewerStore = useFormViewerStore();
const { tree } = storeToRefs(formViewerStore);
// @ts-ignore
tree.value = treeData;

const memberStore = useMembersStore();
memberStore.loadRegisterSchema();
const { registrationSchema } = storeToRefs(memberStore);
const userStore = useUserStore();
const registrationFinished = ref(false);
// check if user is already registered
if (userStore.user?.tokenParsed?.realm_access?.roles?.includes("is_member")) {
  registrationFinished.value = true;
}
async function submit() {
  const registerData = formViewerStore.values;
  try {
    await memberStore.register(registerData);
    registrationFinished.value = true;
    useDashboardStore().getDashboardTiles();
  } catch (e: any) {
    console.log(e);
    alert(
      `Registration failed:\n request-id: ${
        e?.response?.headers["x-request-id"]
      } \n${JSON.stringify(e.response.data)}`
    );
  }
  // reload the dashboard
}
// Add informations from keycloak to the form
if (userStore.user) {
  formViewerStore.updateValue("email", userStore.user.tokenParsed.email);
  formViewerStore.updateValue("first_name", userStore.user.tokenParsed.family_name);
  formViewerStore.updateValue("last_name", userStore.user.tokenParsed.given_name);
}
const router = useRouter();
const PrimeButton = defineAsyncComponent(() => import("primevue/button"));
</script>


<style lang="scss">
.element-page {
  padding: 0 !important;
}
</style>
