<script setup lang="ts">
import type { DataSchema } from "@/api/types";
import { useMainStore } from "@/stores/main";
import PrimeButton from "primevue/button";
import type { PropType } from "vue";
import { ref, toRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import ObjectEditor from "../datatable/ObjectEditor.vue";
import MembershipsRegisterEditor from "./MembershipsRegisterEditor.vue";

const { t } = useI18n();
const mainStore = useMainStore();
const route = useRoute();

const props = defineProps({
  data: {
    type: Object as PropType<DataSchema>,
    required: true,
  },
});

const data = toRef(props, "data");
const emit = defineEmits(["next-page", "prev-page", "complete"]);

const step_names = Object.keys(data.value.schema.fields);
const current_step = Number(route.params.step);
const current_step_name = step_names[current_step - 1];
const step_data = data.value.detail[current_step_name];
const step_schema = props.data.schema.fields[current_step_name].schema!;
const first = current_step == 1;
const final = step_names.length == current_step;

const editor = ref<any>(null);

async function submit(emit_value: "next-page" | "prev-page" | "complete") {
  if (emit_value != "prev-page" && !(await editor.value.validate())) {
    return;
  }
  emit(emit_value, {
    step: current_step,
    name: current_step_name,
    data: editor.value.object_temp,
  });
}
</script>

<template>
  <div class="grow overflow-auto p-5 bg-white">
    <div class="flex flex-col h-full">
      <div class="grow overflow-auto" v-if="step_schema.label == 'Membership'">
        <MembershipsRegisterEditor
          :object="step_data"
          :create="false"
          :store="mainStore"
          :name="current_step_name"
          :schema="step_schema"
          ref="editor"
          :key="current_step_name"
        />
      </div>
      <div class="grow overflow-auto" v-else>
        <ObjectEditor
          :object="step_data"
          :create="false"
          :store="mainStore"
          :name="current_step_name"
          :schema="step_schema"
          ref="editor"
          :key="current_step_name"
        />
      </div>
      <div class="flex justify-end">
        <div v-if="!first" class="pr-2">
          <PrimeButton
            :label="t('Back')"
            icon="pi pi-arrow-left"
            class="flex-none"
            @click="submit('prev-page')"
          />
        </div>
        <div v-if="!final">
          <PrimeButton
            :label="t('Next')"
            icon="pi pi-arrow-right"
            class="flex-none"
            @click="submit('next-page')"
          />
        </div>
        <div v-else>
          <PrimeButton
            :label="t('Submit')"
            icon="pi pi-arrow-right"
            class="flex-none"
            @click="submit('complete')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
