<script setup lang="ts">
import { errorToast, successToast } from "@/helpers/toasts";
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import PrimeCard from "primevue/card";
import PrimeSteps from "primevue/steps";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter, type RouteLocationRaw } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const menuStore = useMenuStore();
const mainStore = useMainStore();
menuStore.setTitle("Registration form");

const error = ref<Object | null>(null);
const data = storeToRefs(mainStore)["membershipsRegister"];

// Load data
const submitData = ref<any>({});

mainStore
  .get("membershipsRegister", Number(route.params.id))
  .catch((e: any) => {
    error.value = e;
  });

const { membershipsTypes } = storeToRefs(mainStore);
mainStore.get("membershipsTypes", Number(route.params.id)).catch((e: any) => {
  error.value = e;
});

function getRoute(step: Number | String): RouteLocationRaw {
  return "/memberships/register/" + route.params.id + "/" + String(step) + "/";
}

function getSteps() {
  let i = 0;
  const items = [];
  for (const step_name in data.value.schema.fields) {
    i++;
    items.push({
      label: data.value.schema.fields[step_name].schema?.label,
      number: i,
      to: getRoute(i),
    });
  }
  i++;
  items.push({
    label: "Completion",
    number: i,
    to: getRoute("complete"),
  });
  return items;
}

function formatDate(value: Date): string {
  // See https://stackoverflow.com/a/69399448/14396787
  var timestamp = value.getTime() - value.getTimezoneOffset() * 60000;
  var correctDate = new Date(timestamp);
  return correctDate.toISOString().split("T")[0];
}
function createSubmitData(object_temp: any) {
  if (object_temp === undefined) {
    return object_temp;
  }
  for (const [key, value] of Object.entries(object_temp)) {
    if (value instanceof Date) {
      object_temp[key] = formatDate(value);
    }
  }
  return object_temp;
}

async function nextPage(event: any) {
  submitData.value[event.name] = createSubmitData(event.data);
  router.push(getRoute(event.step + 1));
}
const prevPage = (event: any) => {
  submitData.value[event.name] = createSubmitData(event.data);
  router.push(getRoute(event.step - 1));
};
const isSaving = ref(false);

async function complete(event: any) {
  submitData.value[event.name] = createSubmitData(event.data);
  isSaving.value = true;
  try {
    await mainStore.create("membershipsRegister", submitData.value);
    successToast(toast, t("Registration successful."));
    router.push(getRoute("complete"));
  } catch (error) {
    errorToast(toast, error);
  }
  isSaving.value = false;
}
</script>

<template>
  <div
    class="flex flex-col h-full"
    v-if="
      data.schemaLoaded && data.detailLoaded && membershipsTypes.detailLoaded
    "
  >
    <PrimeCard>
      <template #content>
        <PrimeSteps
          :model="getSteps()"
          aria-label="Form Steps"
          :readonly="true"
        >
          <template #item="item">
            <router-link
              :disabled="true"
              :to="item.item.to!"
              class="p-menuitem-link"
              tabindex="0"
              aria-current="step"
              ><span class="p-steps-number">{{ item.item.number }}</span
              ><span class="p-steps-title">{{
                t(item.item.label as string)
              }}</span></router-link
            >
          </template>
        </PrimeSteps>
      </template>
    </PrimeCard>
    <div class="h-10"></div>
    <router-view
      v-slot="{ Component }"
      @prevPage="prevPage($event)"
      @nextPage="nextPage($event)"
      @complete="complete($event)"
    >
      <keep-alive>
        <component :is="Component" :key="$route.path" :data="data" />
      </keep-alive>
    </router-view>
  </div>
</template>
