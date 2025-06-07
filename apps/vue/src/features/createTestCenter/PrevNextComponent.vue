<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
defineEmits<{
  prev: [];
}>();
</script>
<template>
  <div class="space-x-5">
    <Button variant="outline" @click="$emit('prev')" type="button">Prev</Button>
    <Button type="submit">Next</Button>
  </div>
</template>
