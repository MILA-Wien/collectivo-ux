<script setup lang="ts">
import ObjectList from "@/components/datatable/ObjectList.vue";
import { errorToast, successToast } from "@/helpers/toasts";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import PrimeButton from "primevue/button";
import PrimeDialog from "primevue/dialog";
import PrimeInputNumber from "primevue/inputnumber";
import PrimePanel from "primevue/panel";
import { useToast } from "primevue/usetoast";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const mainStore = useMainStore();
const menuStore = useMenuStore();
const toast = useToast();
const objectName = "membershipsMembershipsSelf";
menuStore.setTitle("My memberships");

const sharesDialog: any = ref({
  is_open: false,
  is_submitting: false,
  additional_shares: null as number | null,
  computed_value: computed(() => {
    return (
      sharesDialog.value.additional_shares *
      sharesDialog.value.membership.type.shares_amount_per_share
    );
  }),
  membership: null as any,
  label: t("Sign additional shares"),
  open: function (membership: any) {
    this.additional_shares = 0;
    this.membership = membership;
    this.is_open = true;
  },
  update: async function () {
    this.is_submitting = true;
    const data = {
      shares_signed: this.membership.shares_signed + this.additional_shares,
    };
    try {
      await mainStore.update(objectName, data, this.membership.id);
      successToast(toast, "Object has been created.");
    } catch (error) {
      errorToast(toast, error);
    }
    this.is_submitting = false;
    this.is_open = false;
  },
});
</script>

<template>
  <div class="h-full tabview-full-height" id="memberships-profile">
    <ObjectList :store="mainStore" :name="'membershipsMembershipsSelf'">
      <template #item="slotProps">
        <PrimePanel :header="slotProps.data.type.name" class="mb-5">
          <p v-html="slotProps.data.type.description" class="mb-3"></p>

          <p>
            {{ t("Membership number") }}:
            <span class="">{{ slotProps.data.number }}</span>
            <br />
            <span v-if="slotProps.data.date_accepted">
              {{ t("Date joined") }}:
              <span class="">{{ slotProps.data }}</span>
            </span>

            <br />
            {{ t("Status") }}:
            <span class="">{{ slotProps.data.status?.name }}</span>
          </p>
          <p v-if="slotProps.data.type.has_shares">
            {{ t("Signed shares") }}: {{ slotProps.data.shares_signed }}
          </p>

          <PrimeButton
            v-if="slotProps.data.type.has_shares"
            icon="pi pi-pencil"
            :label="sharesDialog.label"
            @click="sharesDialog.open(slotProps.data)"
          ></PrimeButton>
        </PrimePanel>
      </template>
    </ObjectList>

    <PrimeDialog
      v-model:visible="sharesDialog.is_open"
      :header="sharesDialog.label"
      :style="{ 'max-width': '40vw' }"
      :modal="true"
    >
      <div class="flex flex-col gap-5">
        <div>
          {{
            t(
              "Indicate the amount of additional shares that you want to sign. Each share is worth "
            ) +
            sharesDialog.membership.type.shares_amount_per_share +
            " " +
            sharesDialog.membership.type.currency +
            "."
          }}
        </div>

        <div>
          <PrimeInputNumber
            v-model="sharesDialog.additional_shares"
            :min="0"
            class="w-full"
            inputId="integeronly"
            showButtons
          ></PrimeInputNumber>
        </div>

        <div>
          <PrimeInputNumber
            v-model="sharesDialog.computed_value"
            disabled
            class="w-full"
            mode="currency"
            currency="EUR"
          ></PrimeInputNumber>
        </div>

        <div>
          <PrimeButton
            :label="t('Save')"
            icon="pi pi-check"
            class="p-button-success flex-none"
            :loading="sharesDialog.is_submitting"
            :disabled="sharesDialog.additional_shares <= 0"
            @click="sharesDialog.update()"
          />
        </div>
      </div>
    </PrimeDialog>
  </div>
</template>
