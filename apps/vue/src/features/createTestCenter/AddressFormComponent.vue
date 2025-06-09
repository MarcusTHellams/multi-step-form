<script setup lang="ts">
import type { AddressType } from 'schemas';
import { useFormContext } from 'vee-validate';
import { computed } from 'vue';
import { AddressField, fields } from './useAddressFormComponent';

const form = useFormContext<AddressType>();
const isInternational = computed(() => form.values.countryIsoCd.toLowerCase() !== 'us');
</script>
<template>
  <template v-for="field in fields.slice(0, 6)" :key="field.name">
    <component v-if="field.comp" :is="field.comp" :form />
    <AddressField :field v-else />
  </template>
  <template v-if="!isInternational">
    <template v-for="field in fields.slice(6, 10)" :key="field.name">
      <component v-if="field.comp" :is="field.comp" :form />
      <AddressField :field v-else />
    </template>
  </template>
  <template v-else>
    <template v-for="field in fields.slice(10)" :key="field.name">
      <component v-if="field.comp" :is="field.comp" :form />
      <AddressField :field v-else />
    </template>
  </template>
</template>
