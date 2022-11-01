
<template>
    <div>
        <Toast />
        <PrimeMenu :model="items" />


    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from "@/stores/menu";
import type { MenuItem } from 'primevue/menuitem';
import { storeToRefs } from 'pinia'

const store = useMenuStore();
store.getMenu(); //Promise

const toast = useToast();
const menuLabel = ref();
const items = ref<MenuItem>([]);

const { menu } = storeToRefs(store)
watch(menu, (currentValue, oldValue) => {
    console.log("current", currentValue);
    console.log("old", oldValue);
    items.value = [{
        label: "Extensions",
        items: []

    }];
    if (menu != null) {
        items.value[0].items.push(
            {
                label: store.menu[0].microfrontend,
                icon: 'pi pi-bars',
                to: "/micro",
            }
        )
        items.value[0].items.push(
            {
                label: store.menu[1].microfrontend,
                icon: 'pi pi-bell',
                to: "/iframe",
            }
        )
    }
});

const toggle = (event: any) => {
    menuLabel.value.toggle(event);
};
const save = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
};

</script>
