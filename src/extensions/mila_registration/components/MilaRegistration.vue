<template>
  <div id="registration-form">
    <div v-for="error of validation.$errors" :key="error.$uid">
      <PrimeMessage v-if="registrationSchema" severity="error">
        {{
          t(
            registrationSchema[error.$propertyPath]
              ? registrationSchema[error.$propertyPath].label
              : ""
          )
        }}:
        {{ t(error.$message.toString()) }}
      </PrimeMessage>
    </div>
    <FormView @formSubmit="submit" v-if="!registrationFinished"></FormView>
    <div v-else>
      <p class="my-5">
        {{
          t(
            "Deine Beitrittserklärung wurde erfolgreich eingereicht! In den nächsten Tagen senden wir dir eine Email\
                mit den weiteren Schritten."
          )
        }}
      </p>
      <RouterLink to="/">
        <PrimeButton> {{ t("Return to dashboard") }} </PrimeButton>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import treeData from "@/assets/registrationForm.json";
import FormView from "@/formviewer/components/FormView.vue";
import { useFormViewerStore } from "@/stores/formviewer";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import { useUserStore } from "@/stores/user";
import { useVuelidate } from "@vuelidate/core";
import { electronicFormatIBAN } from "ibantools";
import { storeToRefs } from "pinia";
import PrimeButton from "primevue/button";
import PrimeMessage from "primevue/message";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const menuStore = useMenuStore();
menuStore.setTitle("Membership application");

const validation = useVuelidate();
const { t } = useI18n();

// store
const formViewerStore = useFormViewerStore();
const { tree } = storeToRefs(formViewerStore);
// @ts-ignore
tree.value = treeData;

const mainStore = useMainStore();
mainStore.getSchema("milaRegister");
const { milaRegister } = storeToRefs(mainStore);
const registrationSchema = milaRegister.value.schema;
const registrationFinished = ref(false);
const userStore = useUserStore();
// check if user is already registered
const has_mila_membership = ref<boolean | null>(null);
mainStore
  .getMilaMembershipNumber()
  .catch(() => {})
  .then((res) => {
    has_mila_membership.value = res ? res : false;
    if (has_mila_membership.value == true) {
      registrationFinished.value = true;
    }
  });

async function submit() {
  const registerData = formViewerStore.values;
  for (const k in registerData) {
    const v = registerData[k];
    if (k == "bank_account_iban") {
      registerData[k] = electronicFormatIBAN(v) || "";
    }
  }
  try {
    await mainStore.create("milaRegister", registerData);
    registrationFinished.value = true;
  } catch (e: any) {
    console.log(e);
    alert(
      `Registration failed:\n request-id: ${
        e?.response?.headers["x-request-id"]
      } \n${JSON.stringify(e?.response?.data)}`
    );
  }
}
// Add informations from keycloak to the form
if (userStore.user) {
  formViewerStore.updateValue("email", userStore.user.tokenParsed.email);
  formViewerStore.updateValue(
    "first_name",
    userStore.user.tokenParsed.given_name
  );
  formViewerStore.updateValue(
    "last_name",
    userStore.user.tokenParsed.family_name
  );
}
// Add default values
formViewerStore.updateValue("address_country", "Österreich");
formViewerStore.updateValue("address_city", "Wien");
formViewerStore.updateValue("phone", "+43");
</script>
