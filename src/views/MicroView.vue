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

import HelloSingle from 'hello-test/HelloSingle'
import HelloSingle2 from 'hello-test/HelloSingle2'
</script>
