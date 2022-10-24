
<template>
    <div>
        <Toast />
        <div v-if="store">

            {{  store.menu  }}
        </div>
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
        console.log(menu)
        for (let index = 0; index < store.menu?.length; index++) {
            const element = [...store.menu][index];
            items.value[0].items.push(
                {
                    label: element.name,
                    icon: 'pi pi-bars',
                    to: "/menu",
                }
            )
            console.log(element)
        }
    }
    //     items.value = [
    //         {
    //             label: 'Navigate',
    //             items: [{
    //                 label: 'Menu',
    //                 icon: 'pi pi-bars',
    //                 to: "/menu",
    //             },
    //             {
    //                 label: 'About',
    //                 icon: 'pi pi-megaphone',
    //                 to: "/about",
    //             },
    //             {
    //                 label: 'Version',
    //                 icon: 'pi pi-verified',
    //                 to: "/"
    //             }
    //             ]
    //         },
    //         {
    //             label: 'Toasts',
    //             items: [{
    //                 label: 'Update',
    //                 icon: 'pi pi-refresh',
    //                 command: () => {
    //                     toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
    //                 }
    //             },
    //             {
    //                 label: 'Delete',
    //                 icon: 'pi pi-times',
    //                 command: () => {
    //                     toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
    //                 }
    //             }
    //             ]
    //         },
    //     ]
});



const toggle = (event: any) => {
    menuLabel.value.toggle(event);
};
const save = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
};

// return { items, menu, toggle, save }
</script>
