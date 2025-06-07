<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { addAddressRefinement, type AddressType } from 'schemas';
import { useForm } from 'vee-validate';
import { toRaw } from 'vue';
import AddressFormComponent from './AddressFormComponent.vue';
import { useCreateTestCenterContext } from './createTestCenterStore';
import PrevNextComponent from './PrevNextComponent.vue';

const { state, setReadyToSubmit, setShippingAddress, decrementStep } = useCreateTestCenterContext();
const { testCenter } = toRaw(state);

const form = useForm<AddressType>({
  validationSchema: toTypedSchema(addAddressRefinement()),
  initialValues: testCenter.shippingAddress,
});
const submitHandler = form.handleSubmit((values) => {
  setShippingAddress(values);
  setReadyToSubmit(true);
});

const prevHandler = () => {
  setShippingAddress(form.values);
  decrementStep();
};
</script>
<template>
  <h1 class="text-center">Shipping Address</h1>
  <form class="not-prose space-y-5" novalidate @submit="submitHandler">
    <AddressFormComponent />
    <PrevNextComponent @prev="prevHandler" />
  </form>
</template>
