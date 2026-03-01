<template>
  <v-app>
    <!-- Hidden on /login via route meta -->
    <GuestAppbar v-if="!route.meta.hideAppBar" />

    <v-main>
      <router-view />
    </v-main>

    <v-footer
      app
      color="grey-darken-4"
      class="text-caption d-flex justify-center align-center text-white"
    >
      © {{ new Date().getFullYear() }} EstateVue — All rights reserved. &nbsp; {{ version }}
    </v-footer>
  </v-app>
</template>

<script setup>
import { useRoute } from 'vue-router'
import GuestAppbar from '@/components/Guest/Navigation/GuestAppbar.vue'
import version from '@/utils/version.js'

const route = useRoute()
</script>