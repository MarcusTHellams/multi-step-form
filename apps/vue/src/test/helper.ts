import { render, type RenderOptions } from '@testing-library/vue';

const customRender = <C>(component: C, options?: RenderOptions<C>) => {
  const { global, ...restOptions } = options || {};
  return render(component, {
    global: {
      ...global,
      plugins: [],
    },
    ...restOptions,
  });
};

export { customRender as render };

export * from '@testing-library/vue';
export { userEvent } from '@testing-library/user-event';
