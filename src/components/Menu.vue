<template>
    <div>
        <Toast />
        <Menu :model="items" />
    </div>
</template>

<script>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

export default {
    setup() {
        const toast = useToast();
        const menu = ref();
        const items = ref([
            {
                label: 'Navigate',
                items: [{
                    label: 'Menu',
                    icon: 'pi pi-bars',
                    command: () => {
                        window.location.href = "/menu"
                    }
                },
                {
                    label: 'About',
                    icon: 'pi pi-megaphone',
                    command: () => {
                        window.location.href = "/about"
                    }
                },
                {
                    label: 'Version',
                    icon: 'pi pi-verified',
                    command: () => {
                        window.location.href = "/"
                    }
                }
                ]
            },
            {
                label: 'Toasts',
                items: [{
                    label: 'Update',
                    icon: 'pi pi-refresh',
                    command: () => {
                        toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
                    }
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-times',
                    command: () => {
                        toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
                    }
                }
                ]
            },
        ]);

        const toggle = (event) => {
            menu.value.toggle(event);
        };
        const save = () => {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
        };

        return { items, menu, toggle, save }
    }
}
</script>