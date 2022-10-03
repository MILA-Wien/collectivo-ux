

<template>
    <div text-center>
        <h3>Username</h3>
        <InputText type="text" />
        <br />
        <br />

        <h3>Password</h3>
        <Password></Password>
        <br />
        <br />
        <Button label="Login" class="p-button-outlined" align="center"></Button>
        <!-- <h5>Basic</h5>
        <Password v-model="value1" :feedback="false" />

        <h5>Password Meter</h5>
        <Password v-model="value2" />

        <h5>Show Password</h5>
        <Password v-model="value3" toggleMask></Password>

        <h5>Templating</h5>
        <Password v-model="value4">
            <template #header>
                <h6>Pick a password</h6>
            </template>
            <template #footer="sp">
                {{sp.level}}
                <Divider />
                <p class="mt-2">Suggestions</p>
                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                    <li>At least one lowercase</li>
                    <li>At least one uppercase</li>
                    <li>At least one numeric</li>
                    <li>Minimum 8 characters</li>
                </ul>
            </template>
        </Password> -->
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

// export default {
//     setup() {
//         const value1 = ref();
//         const value2 = ref();
//         const value3 = ref();
//         const value4 = ref();

//         return { value1, value2, value3, value4 }
//     }
// }

</script>

<style>

</style>

