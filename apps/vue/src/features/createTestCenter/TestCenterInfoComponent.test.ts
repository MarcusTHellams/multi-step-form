/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, userEvent, waitFor } from '@/test/helper';
import { reactive } from 'vue';
import * as store from './createTestCenterStore';
import TestCenterInfoComponent from './TestCenterInfoComponent.vue';

const setup = (localState: typeof state) => {
  const user = userEvent.setup();
  const incrementStep = vi.fn();
  const setTestCenterInfo = vi.fn();
  vi.spyOn(store, 'useCreateTestCenterContext').mockReturnValue({
    state: reactive(localState),
    incrementStep,
    setTestCenterInfo,
  } as any);
  const result = render(TestCenterInfoComponent);
  const next = screen.getByRole('button', { name: 'Next' });
  return {
    next,
    user,
    result,
    incrementStep,
    setTestCenterInfo,
  };
};

describe('TestCenterInfoComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('happy path: no errors, form submits successfully', () => {
    it('form submits successfully ', async () => {
      const { user, incrementStep, setTestCenterInfo, next } = setup(state);
      await user.click(next);
      await waitFor(() => expect(incrementStep).toHaveBeenCalled());
      expect(setTestCenterInfo).toHaveBeenCalled();
      expect(setTestCenterInfo).toHaveBeenCalledWith('James Finley', 'Quia rerum omnis vol', {
        country: 'United States of America',
        countryIsoCd: 'US',
        address1: 'Address 1',
        address2: 'Address 2',
        address3: 'Address 3',
        city: 'City',
        intlPostalCd: '',
        regionName: '',
        state: 'Virginia',
        stateCd: 'VA',
        zip4: '4444',
        zip5: '55555',
      });
    });
  });

  describe('unhappy path', () => {
    describe('international', () => {
      it('shows error messages', async () => {
        const { user, incrementStep, setTestCenterInfo, next } = setup(internationalState);
        await user.click(next);
        expect(incrementStep).not.toHaveBeenCalled();
        expect(setTestCenterInfo).not.toHaveBeenCalled();

        await waitFor(() =>
          expect(screen.getByText('Test Center Name is Required')).toBeInTheDocument(),
        );
        expect(screen.getByText('Test Center Type is Required')).toBeInTheDocument();
        expect(screen.getByText('Country is Required')).toBeInTheDocument();
        expect(screen.getByText('Country Iso Code is Required')).toBeInTheDocument();
        expect(screen.getByText('Address 1 is Required')).toBeInTheDocument();
        expect(screen.getByText('City is Required')).toBeInTheDocument();
      });
    });

    describe('national', () => {
      it('shows error messages', async () => {
        const { user, incrementStep, setTestCenterInfo, next } = setup(internationalState);
        await user.click(next);
        expect(incrementStep).not.toHaveBeenCalled();
        expect(setTestCenterInfo).not.toHaveBeenCalled();
        const country = screen.getByRole('combobox');
        await user.click(country);
        await user.click(screen.getByRole('option', { name: /united states of america/i }));
        expect(country).toHaveTextContent(/united states of america/i);
        expect(screen.getByRole('textbox', { name: 'Country Iso Code' })).toHaveValue('US');
        await user.click(next);
        await waitFor(() => expect(screen.getByText('State is Required')).toBeInTheDocument());
        expect(screen.getByText('State Code is Required')).toBeInTheDocument();
        expect(screen.getByText('Zip 5 is Required')).toBeInTheDocument();
      });
    });
  });
});

const state = {
  step: 1,
  readyToSubmit: false,
  testCenter: {
    testCenterName: 'James Finley',
    testCenterType: 'Quia rerum omnis vol',
    alternateCoordinator: { firstName: '', lastName: '', email: '', phone: '' },
    primaryCoordinator: { firstName: '', lastName: '', email: '', phone: '' },
    shippingPoc: { firstName: '', lastName: '', email: '', phone: '' },
    techCoordinator: { firstName: '', lastName: '', email: '', phone: '' },
    reportingAddress: {
      country: 'United States of America',
      countryIsoCd: 'US',
      address1: 'Address 1',
      address2: 'Address 2',
      address3: 'Address 3',
      city: 'City',
      intlPostalCd: '',
      regionName: '',
      state: 'Virginia',
      stateCd: 'VA',
      zip4: '4444',
      zip5: '55555',
    },
    shippingAddress: {
      country: '',
      countryIsoCd: '',
      address1: '',
      address2: '',
      address3: '',
      city: '',
      intlPostalCd: '',
      regionName: '',
      state: '',
      stateCd: '',
      zip4: '',
      zip5: '',
    },
  },
};

const internationalState = structuredClone(state);
internationalState.testCenter.testCenterName = '';
internationalState.testCenter.testCenterType = '';
internationalState.testCenter.reportingAddress = {
  country: '',
  countryIsoCd: '',
  address1: '',
  address2: '',
  address3: '',
  city: '',
  intlPostalCd: '',
  regionName: '',
  state: '',
  stateCd: '',
  zip4: '',
  zip5: '',
};
