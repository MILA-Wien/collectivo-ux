<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import type { PropType } from "vue";
import type { StoreGeneric } from "pinia";
import type { endpoints } from "@/api/api";
import ObjectDetail from "@/components/datatable/ObjectDetail.vue";

const { t } = useI18n();
const emit = defineEmits(["close"]);

const props = defineProps({
  store: {
    type: Object as PropType<StoreGeneric>,
    required: true,
  },
  name: {
    type: String as PropType<keyof typeof endpoints>,
    required: true,
  },
  pk: {
    type: Number as PropType<number | null>,
    required: true,
  },
  create: {
    type: Boolean,
    required: true,
  },
});

const error = ref<Object | null>(null);
const data = storeToRefs(props.store)[props.name];

// Load data
if (!data.value.loaded) {
  props.store.getDetail(props.name, props.pk).catch((e: any) => {
    error.value = e;
  });
}

</script>

<template>
  <ObjectDetail
    v-if="data.loaded"
    :object="data.data"
    :create="create"
    :store="store"
    :name="name"
    :schema="data.schema"
    @close="emit('close')"
  />
</template>
