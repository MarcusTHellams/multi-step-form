<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
  addAddressRefinement,
  type AddressType,
  type TestCenterInfoType,
  testCenterInfoSchema,
} from 'schemas';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateTestCenterContext } from './createTestCenterStore';
import { toRaw } from 'vue';
import AddressFormComponent from './AddressFormComponent.vue';

const { state, incrementStep, setTestCenterInfo } = useCreateTestCenterContext();
const { testCenter } = toRaw(state);

const form = useForm<AddressType & TestCenterInfoType>({
  validationSchema: toTypedSchema(addAddressRefinement(testCenterInfoSchema)),
  initialValues: {
    testCenterName: testCenter.testCenterName,
    testCenterType: testCenter.testCenterType,
    ...testCenter.reportingAddress,
  },
});
const submitHandler = form.handleSubmit(({ testCenterName, testCenterType, ...address }) => {
  setTestCenterInfo(testCenterName, testCenterType, address);
  incrementStep();
});
</script>
<template>
  <h1 class="text-center">Test Center</h1>
  <form class="not-prose space-y-5" novalidate @submit="submitHandler">
    <FormField v-slot="{ componentField }" name="testCenterName">
      <FormItem>
        <FormLabel :for="componentField.name">Test Center Name</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="testCenterType">
      <FormItem>
        <FormLabel :for="componentField.name">Test Center Type</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <AddressFormComponent />
    <Button type="submit">Next</Button>
  </form>
</template>
