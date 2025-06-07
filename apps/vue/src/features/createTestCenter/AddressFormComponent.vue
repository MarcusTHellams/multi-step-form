<script setup lang="ts">
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { AddressType } from 'schemas';
import { getCountryIsoCd, getModifiedCountries, getStateCd } from 'schemas';
import { useFormContext } from 'vee-validate';
import { computed } from 'vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import states from 'states-us';
import VueSelect from 'vue3-select-component';

const digitCheck = (event: KeyboardEvent) => {
  if ((event.key.length === 1 && isNaN(Number(event.key))) || event.code === 'Space') {
    event.preventDefault();
  }
};

const form = useFormContext<AddressType>();
const isInternational = computed(() => form.values.countryIsoCd.toLowerCase() === 'us');
</script>
<template>
  <FormField v-slot="{ componentField: { name, onBlur, onChange, modelValue } }" name="country">
    <FormItem>
      <FormLabel>Country</FormLabel>
      <FormControl>
        <VueSelect
          input-id="country"
          @blur="onBlur"
          :name="name"
          :model-value="modelValue"
          @update:model-value="
            onChange($event);
            form.setFieldValue('countryIsoCd', getCountryIsoCd($event), true);
          "
          :options="[
            {
              value: '',
              label: '-- Select a Country --',
            },
            ...getModifiedCountries().map((country) => ({
              label: country.name.official,
              value: country.name.official,
            })),
          ]"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="countryIsoCd">
    <FormItem>
      <FormLabel>Country Iso Code</FormLabel>
      <FormControl>
        <Input readonly type="text" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="address1">
    <FormItem>
      <FormLabel>Address 1</FormLabel>
      <FormControl>
        <Input type="text" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="address2">
    <FormItem>
      <FormLabel>Address 2</FormLabel>
      <FormControl>
        <Input type="text" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="address3">
    <FormItem>
      <FormLabel>Address 3</FormLabel>
      <FormControl>
        <Input type="text" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <FormField v-slot="{ componentField }" name="city">
    <FormItem>
      <FormLabel>City</FormLabel>
      <FormControl>
        <Input type="text" v-bind="componentField" />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
  <template v-if="isInternational">
    <FormField v-slot="{ componentField: { name, onBlur, onChange, modelValue } }" name="state">
      <FormItem>
        <FormLabel>State</FormLabel>
        <Select
          @update:model-value="
            $event === 'noop' ? onChange('') : onChange($event);
            form.setFieldValue('stateCd', getStateCd($event as string), true);
          "
          :model-value="!modelValue ? 'noop' : modelValue"
          @blur="onBlur"
          :name="name"
        >
          <FormControl>
            <SelectTrigger class="w-full">
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="noop">-- Select a State --</SelectItem>
            <SelectItem :value="name" v-for="{ name } in states" :key="name">
              {{ name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="stateCd">
      <FormItem>
        <FormLabel>State Code</FormLabel>
        <FormControl>
          <Input readonly type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="zip5">
      <FormItem>
        <FormLabel>Zip 5</FormLabel>
        <FormControl>
          <Input @keydown="digitCheck" maxlength="5" type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="zip4">
      <FormItem>
        <FormLabel>Zip 4</FormLabel>
        <FormControl>
          <Input @keydown="digitCheck" maxlength="4" type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </template>
  <template v-else>
    <FormField v-slot="{ componentField }" name="intlPostalCd">
      <FormItem>
        <FormLabel>International Postal Code</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="regionName">
      <FormItem>
        <FormLabel>Region Name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </template>
</template>
