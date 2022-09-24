<template>
  <div :class="{ dark: user.isDarkMode.value == true }" class="flex flex-col h-screen">
    <template v-if="user.isLoggedIn.value === true">
      <the-header></the-header>
      <div class="flex flex-row w-full h-full">
        <the-sidebar></the-sidebar>
        <div class="container p-3 background">
          <router-view></router-view>
        </div>
      </div>
    </template>
    <template v-else>
      <the-login></the-login>
    </template>
  </div>
</template>

<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import TheSidebar from "./components/TheSidebar.vue";
import TheLogin from "./components/TheLogin.vue";
import { user } from "@/state";
</script>




