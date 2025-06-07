/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, userEvent, waitFor } from '@/test/helper';
import { reactive } from 'vue';
import * as store from './createTestCenterStore';
import { state } from './testUtils';
import ShippingAddressComponent from './ShippingAddressComponent.vue';

describe('ShippingAddressComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('happy path', () => {
    it('form submits successfully', async () => {
      const { next, prev, decrementStep, setReadyToSubmit, setShippingAddress, user } =
        setup(happyState);
      await user.click(next);
      await waitFor(() => expect(setReadyToSubmit).toHaveBeenCalled());
      expect(setShippingAddress).toHaveBeenCalledWith({
        address1: 'Address 1',
        address2: 'Address 2',
        address3: 'Address 3',
        city: 'City',
        country: 'United States of America',
        countryIsoCd: 'US',
        intlPostalCd: '',
        regionName: '',
        state: 'Virginia',
        stateCd: 'VA',
        zip4: '4444',
        zip5: '55555',
      });

      await user.click(prev);
      expect(decrementStep).toHaveBeenCalled();
      expect(setShippingAddress).toHaveBeenCalledTimes(2);
    });

    describe('zip 5', () => {
      it('zip 5 should be limited to only 5 digits', async () => {
        const { user } = setup(happyState);

        const zip5 = screen.getByRole('textbox', { name: 'Zip 5' });
        await user.type(zip5, '555555555555555555');
        expect(zip5).toHaveValue('55555');
      });

      it('zip 5 should not have non numbers or spaces', async () => {
        const { user } = setup(happyState);

        const zip5 = screen.getByRole('textbox', { name: 'Zip 5' }) as HTMLInputElement;
        await user.clear(zip5);
        await user.type(zip5, '{Space}{Space}marcus{Space}{Space}');
        expect(zip5.value).toHaveLength(0);
      });
    });

    describe('zip 4', () => {
      it('zip 4 should be limited to only 4 digits', async () => {
        const { user } = setup(happyState);

        const zip4 = screen.getByRole('textbox', { name: 'Zip 4' });
        await user.type(zip4, '44444444444444444444444');
        expect(zip4).toHaveValue('4444');
      });

      it('zip 4 should not have non numbers or spaces', async () => {
        const { user } = setup(happyState);

        const zip4 = screen.getByRole('textbox', { name: 'Zip 4' }) as HTMLInputElement;
        await user.clear(zip4);
        await user.type(zip4, '{Space}{Space}marcus{Space}{Space}');
        expect(zip4.value).toHaveLength(0);
      });
    });
  });
});

const setup = (localState: typeof state) => {
  const user = userEvent.setup();
  const setReadyToSubmit = vi.fn();
  const setShippingAddress = vi.fn();
  const decrementStep = vi.fn();
  vi.spyOn(store, 'useCreateTestCenterContext').mockReturnValue({
    state: reactive(localState),
    setReadyToSubmit,
    setShippingAddress,
    decrementStep,
  } as any);

  const result = render(ShippingAddressComponent);
  const next = screen.getByRole('button', { name: 'Next' });
  const prev = screen.getByRole('button', { name: 'Prev' });
  return {
    result,
    user,
    setReadyToSubmit,
    setShippingAddress,
    decrementStep,
    next,
    prev,
  };
};

const happyState = structuredClone(state);
happyState.testCenter.shippingAddress = structuredClone(happyState.testCenter.reportingAddress);
