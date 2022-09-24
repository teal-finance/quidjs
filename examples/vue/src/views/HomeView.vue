<template>
  <button class="mt-5 btn light" @click="fetchApi()">
    FETCH API
  </button>
</template>

<script setup lang="ts">
import { quid } from "@/state";

async function fetchApi() {
  const resp = await quid.get("/");
  console.log("Backend response:", resp)
}
</script>