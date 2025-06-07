<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { personSchema, type PersonType, type WhichPerson } from 'schemas';
import { useForm } from 'vee-validate';
import { toRaw } from 'vue';
import { useCreateTestCenterContext } from './createTestCenterStore';
import PersonFormComponent from './PersonFormComponent.vue';
import PrevNextComponent from './PrevNextComponent.vue';

const { whichPerson } = defineProps<{
  title: string;
  whichPerson: WhichPerson;
}>();

const { state, incrementStep, setPerson, decrementStep } = useCreateTestCenterContext();
const { testCenter } = toRaw(state);

const form = useForm<PersonType>({
  validationSchema: toTypedSchema(personSchema),
  initialValues: testCenter[whichPerson],
});
const submitHandler = form.handleSubmit((values) => {
  setPerson(whichPerson, values);
  incrementStep();
});

const prevHandler = () => {
  setPerson(whichPerson, form.values);
  decrementStep();
};
</script>
<template>
  <h1 class="text-center">{{ title }}</h1>
  <form class="not-prose space-y-5" novalidate @submit="submitHandler">
    <PersonFormComponent />
    <PrevNextComponent @prev="prevHandler" />
  </form>
</template>
