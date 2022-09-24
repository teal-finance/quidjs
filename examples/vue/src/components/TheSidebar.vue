<template>
  <sw-sidebar v-model:opened="sidebar" name="sidebar1" class="flex flex-col h-full sw-sidebar secondary">
    <div class="flex-grow mt-5 ml-6 space-y-6">
      <div>
        <i-fluent-settings-32-regular class="txt-lighter dark:txt-light"></i-fluent-settings-32-regular>
        <span v-if="sidebar === true" class="ml-3">
          <router-link to="/settings">Settings</router-link>
        </span>
      </div>
    </div>
    <div class="flex-none h-12 mb-3 text-2xl text-center cursor-pointer" @click="sidebar = !sidebar">
      <i-fa-solid:angle-double-left v-if="sidebar === true"></i-fa-solid:angle-double-left>
      <i-fa-solid:angle-double-right v-else></i-fa-solid:angle-double-right>
    </div>
  </sw-sidebar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SwSidebar from "@snowind/sidebar";

const sidebar = ref(true);
</script>

 <style lang="sass" scoped>
 
 #sidebar1
   &.opened
     @apply w-96
 </style>


