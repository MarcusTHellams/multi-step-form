import { createRouter, createWebHistory } from 'vue-router';
import CreateTestCenter from '@/features/createTestCenter/CreateTestCenter.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CreateTestCenter,
    },
  ],
});

export default router;
