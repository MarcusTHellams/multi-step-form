<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
</script>
<template>
  <FormField v-slot="{ componentField }" name="firstName">
    <FormItem>
      <FormLabel>First Name</FormLabel>
      <FormControl>
        <Input type="text" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="lastName">
    <FormItem>
      <FormLabel>Last Name</FormLabel>
      <FormControl>
        <Input type="text" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="email">
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="phone">
    <FormItem>
      <FormLabel>Phone</FormLabel>
      <FormControl>
        <Input type="tel" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
