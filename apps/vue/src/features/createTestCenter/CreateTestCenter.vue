<script setup lang="ts">
import { toRaw, toRefs, watch } from 'vue';
import { useCreateTestCenterProvider } from './createTestCenterStore';
import TestCenterInfoComponent from './TestCenterInfoComponent.vue';
import PersonStepComponent from './PersonStepComponent.vue';
import ShippingAddressComponent from './ShippingAddressComponent.vue';

const { state, setReadyToSubmit } = useCreateTestCenterProvider();
const { step, readyToSubmit, testCenter } = toRefs(state);

watch(readyToSubmit, (newReady) => {
  if (newReady) {
    alert(`Ready to create new test center: \n${JSON.stringify(toRaw(testCenter.value), null, 2)}`);
    setReadyToSubmit(false);
  }
});
</script>

<template>
  <main class="mx-auto mt-16 mb-16 lg:w-5/12 px-4 lg:px-0">
    <TestCenterInfoComponent v-if="step === 1" />
    <PersonStepComponent
      :key="2"
      which-person="primaryCoordinator"
      title="Primary Coordinator"
      v-else-if="step === 2"
    />
    <PersonStepComponent
      :key="3"
      which-person="alternateCoordinator"
      title="Alternate Coordinator"
      v-else-if="step === 3"
    />
    <PersonStepComponent
      :key="4"
      which-person="techCoordinator"
      title="Technical Coordinator"
      v-else-if="step === 4"
    />
    <PersonStepComponent
      :key="5"
      which-person="shippingPoc"
      title="Shipping POC"
      v-else-if="step === 5"
    />
    <ShippingAddressComponent v-else />
  </main>
</template>
