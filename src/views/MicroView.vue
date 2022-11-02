<template>
  <div id="micro-view">
    <div class="wrapper">
      <h1>Micro</h1>
      <div class="content">
        <HelloSingle />
        <HelloSingle2 />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// For new versions of webpack

import HelloSingle from "test_extension/test_extension_modules";
import HelloSingle2 from "test_extension/HelloSingle2";
</script>
