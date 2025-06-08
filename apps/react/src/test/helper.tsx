import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

const customRender = (ui: React.ReactNode, options?: RenderOptions) => {
  return render(ui, {
    ...options,
    wrapper: ({ children }: PropsWithChildren) => {
      return <>{children}</>;
    },
  });
};

export { userEvent } from '@testing-library/user-event';
export { customRender as render };

export * from '@testing-library/react';
