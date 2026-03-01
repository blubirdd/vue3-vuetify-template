<template>
  <v-app-bar flat color="white" border="b" height="68">

    <!-- Logo -->
    <template v-slot:prepend>
      <div class="d-flex align-center ga-2 ml-2">
        <v-icon color="amber-darken-2" size="26">mdi-home-city</v-icon>
        <span class="text-subtitle-1 font-weight-bold">EstateVue</span>
      </div>
    </template>

    <!-- Centered nav — sits in the default slot which fills remaining space -->
    <div class="d-none d-md-flex align-center justify-center ga-1 flex-grow-1">
      <v-btn
        v-for="item in navItems"
        :key="item.to"
        variant="text"
        rounded="lg"
        :to="item.to"
        :color="isActive(item.to) ? 'amber-darken-2' : undefined"
        :class="isActive(item.to) ? 'font-weight-bold' : 'text-medium-emphasis'"
      >
        {{ item.label }}
      </v-btn>
    </div>

    <!-- Login + mobile toggle -->
    <template v-slot:append>
      <v-btn
        color="amber-darken-2"
        variant="flat"
        rounded="lg"
        size="small"
        class="d-none d-md-flex mr-3"
        to="/login"
      >
        <v-icon start size="16">mdi-login</v-icon>
        Login
      </v-btn>
      <v-app-bar-nav-icon class="d-flex d-md-none" @click="drawer = !drawer" />
    </template>
  </v-app-bar>

  <!-- Mobile drawer -->
  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.to"
        :prepend-icon="item.icon"
        :title="item.label"
        :to="item.to"
        rounded="lg"
        active-color="amber-darken-2"
      />
      <v-divider class="my-2" />
      <v-list-item
        prepend-icon="mdi-login"
        title="Login"
        to="/login"
        rounded="lg"
        active-color="amber-darken-2"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const drawer = ref(false)
const route = useRoute()

const navItems = [
  { label: 'Home',       to: '/',           icon: 'mdi-home-outline' },
  { label: 'Properties', to: '/properties', icon: 'mdi-office-building-outline' },
  { label: 'Agents',     to: '/agents',     icon: 'mdi-account-tie-outline' },
  { label: 'About',      to: '/about',      icon: 'mdi-information-outline' },
  { label: 'Contact',    to: '/contact',    icon: 'mdi-phone-outline' },
]

const isActive = (to) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>