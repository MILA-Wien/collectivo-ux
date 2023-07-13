<script setup lang="ts">
import { useMainStore } from "@/stores/main";
import { useMenuStore } from "@/stores/menu";
import { storeToRefs } from "pinia";
import PrimeButton from "primevue/button";
import PrimeColumn from "primevue/column";
import TabPanel from "primevue/tabpanel";
import TabView from "primevue/tabview";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ObjectModal from "../datatable/ObjectModal.vue";
import ObjectTable from "../datatable/ObjectTable.vue";

const { t } = useI18n();
const mainStore = useMainStore();
const menuStore = useMenuStore();
const { coreUsers } = storeToRefs(mainStore);
mainStore.getSchema("coreUsers");
menuStore.setTitle("Users");
const view_groups = mainStore.hasPermission("view_groups", "core");

// Dialogs ----------------------------------------------------------------- //
const editActive = ref(false);
const editObject = ref({});
const editCreate = ref(false);
const table = ref();
function createObjectFn() {
  editObject.value = {};
  editCreate.value = true;
  editActive.value = true;
}
function closeEditor() {
  editActive.value = false;
  table.value.table.table.refresh();
}
</script>

<template>
  <div class="h-full tabview-full-height" id="core-users">
    <TabView lazy>
      <TabPanel :header="t('Users')">
        <ObjectTable
          :store="mainStore"
          :name="'coreUsersExtended'"
          :default-columns="['first_name', 'last_name', 'email', 'tags']"
          :email-button="true"
          ref="table"
        >
          <template #action-column>
            <PrimeColumn style="width: 45px; max-width: 45px" :frozen="true">
              <template #header
                ><PrimeButton
                  icon="pi pi-eye"
                  class="p-button-text p-button-sm button-edit"
                  disabled="true"
              /></template>
              <template #body="slotProps">
                <PrimeButton
                  icon="pi pi-eye"
                  class="p-button-text p-button-sm button-edit"
                  @click="
                    $router.push('/core/users/' + slotProps.data.id + '/')
                  "
                />
              </template>
            </PrimeColumn>
          </template>
          <template #toolbar-before>
            <div class="m-1" v-if="coreUsers.schemaLoaded">
              <PrimeButton
                icon="pi pi-plus"
                class="p-button-sm"
                @click="createObjectFn()"
                :label="t('New')"
              >
              </PrimeButton>
            </div>
            <!-- Detail dialog -->
            <ObjectModal
              v-if="editActive"
              :object="editObject"
              :create="editCreate"
              :store="mainStore"
              :name="'coreUsers'"
              :schema="coreUsers.schema"
              @close="closeEditor()"
            />
          </template>
        </ObjectTable>
      </TabPanel>
      <TabPanel :header="t('Permission groups')" v-if="view_groups">
        <ObjectTable
          :store="mainStore"
          :name="'coreGroups'"
          :default-columns="['label', 'permissions', 'extension', 'users']"
        >
        </ObjectTable>
      </TabPanel>
      <TabPanel :header="t('Tags')">
        <ObjectTable
          :store="mainStore"
          name="tagsTags"
          :default-columns="['name', 'description']"
        />
      </TabPanel>
    </TabView>
  </div>
</template>
