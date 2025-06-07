/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, userEvent, waitFor } from '@/test/helper';
import { reactive } from 'vue';
import * as store from './createTestCenterStore';
import PersonStepComponent from './PersonStepComponent.vue';
import { state } from './testUtils';
import type { ComponentProps } from 'vue-component-type-helpers';

const setup = (localState: typeof state, props: ComponentProps<typeof PersonStepComponent>) => {
  const user = userEvent.setup();
  const incrementStep = vi.fn();
  const setPerson = vi.fn();
  const decrementStep = vi.fn();
  vi.spyOn(store, 'useCreateTestCenterContext').mockReturnValue({
    state: reactive(localState),
    incrementStep,
    setPerson,
    decrementStep,
  } as any);

  const result = render(PersonStepComponent, {
    props,
  });
  const next = screen.getByRole('button', { name: 'Next' });
  const prev = screen.getByRole('button', { name: 'Prev' });
  return {
    result,
    user,
    incrementStep,
    setPerson,
    decrementStep,
    next,
    prev,
  };
};

describe('PersonStepComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('happy path', () => {
    it('form submits successfully', async () => {
      const { incrementStep, setPerson, next, user, prev, decrementStep } = setup(happyPathState, {
        title: 'Primary Coordinator',
        whichPerson: 'primaryCoordinator',
      });
      await user.click(next);
      await waitFor(() => expect(incrementStep).toHaveBeenCalled());
      expect(setPerson).toHaveBeenCalledWith('primaryCoordinator', {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'mhellams@gmail.com',
        phone: '+1 202 250 0268',
      });
      await user.click(prev);
      expect(decrementStep).toHaveBeenCalled();
    });
  });

  describe('unhappy path', () => {
    it('form shows error messages', async () => {
      const { incrementStep, setPerson, next, user } = setup(state, {
        title: 'Primary Coordinator',
        whichPerson: 'primaryCoordinator',
      });
      await user.click(next);
      await waitFor(() => expect(screen.getByText('First Name is Required')).toBeInTheDocument());
      expect(screen.getByText('Last Name is Required')).toBeInTheDocument();
      expect(screen.getByText('Email is Required')).toBeInTheDocument();
      expect(incrementStep).not.toHaveBeenCalled();
      expect(setPerson).not.toHaveBeenCalled();
    });

    it('form should successfully submit after errors are corrected', async () => {
      const { incrementStep, setPerson, next, user } = setup(state, {
        title: 'Primary Coordinator',
        whichPerson: 'primaryCoordinator',
      });
      await user.click(next);
      await user.type(screen.getByRole('textbox', { name: 'First Name' }), 'first name');
      await user.type(screen.getByRole('textbox', { name: 'Last Name' }), 'last name');
      await user.type(screen.getByRole('textbox', { name: 'Email' }), 'mhellams@');
      await user.type(screen.getByRole('textbox', { name: 'Phone' }), '+1 202 250 0268');
      await user.click(next);
      expect(screen.getByText('A Valid Email is Required')).toBeInTheDocument();
      await user.type(screen.getByRole('textbox', { name: 'Email' }), 'gmail.com');
      await user.click(next);
      await waitFor(() => expect(incrementStep).toHaveBeenCalled());
      expect(setPerson).toHaveBeenCalledWith('primaryCoordinator', {
        email: 'mhellams@gmail.com',
        firstName: 'first name',
        lastName: 'last name',
        phone: '+1 202 250 0268',
      });
    });
  });
});

const happyPathState = structuredClone(state);
happyPathState.testCenter.primaryCoordinator = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'mhellams@gmail.com',
  phone: '+1 202 250 0268',
};
