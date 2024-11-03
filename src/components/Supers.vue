<script lang="ts" setup>

import SuperCard from "./SuperCard.vue";

// TODO: Replaces this static ID's with client selected ones!
const defaultSuperIds = [
  'ChIJbQVG6McTYw0RXNA1t_ai6ks',
  'ChIJGZt6aIwTYw0RcDhx9Yuthww',
  'ChIJGaKd_MgTYw0RDsD1wGoH_Rc',
  'ChIJ07gXUdMTYw0RcpsLZnA1Ew8',
  'ChIJpVjAgFUTYw0Rhzouw3zz3w4',
  'ChIJC9amTMoTYw0RhB7CyzsC8HA',
];

const url = new URL(`${location.href}api/get-info-supers.json`);
defaultSuperIds.forEach((id) => {
  url.searchParams.append('ids[]', id)
})
const data = await (fetch(url).then(res => res.json()))
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SuperCard
          v-for="supermarket in data"
          :key="supermarket.id"
          class="w-full"
          v-bind="supermarket"
      />
    </div>
  </div>
</template>