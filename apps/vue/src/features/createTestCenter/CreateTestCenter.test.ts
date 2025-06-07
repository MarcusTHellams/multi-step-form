import { render, screen, userEvent, waitFor } from '@/test/helper';
import { provide, reactive } from 'vue';
import * as store from './createTestCenterStore';
import { state2 } from './testUtils';
import CreateTestCenter from './CreateTestCenter.vue';
import type { AddressType, PersonType, WhichPerson } from 'schemas';
import { CREATE_TEST_CENTER_PROVIDER_KEY } from './createTestCenterStore';
import type { UserEvent } from '@testing-library/user-event';

describe('CreateTestCenter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('happy path', () => {
    describe('multi-step form is submitted successfully', () => {
      it('goes through all the steps and submits', async () => {
        const alertSpy = vi.spyOn(window, 'alert');
        const { user, setReadyToSubmit } = setup(state2);
        expect(screen.getByRole('heading', { name: 'Test Center' })).toBeInTheDocument();
        await goToNextPage(user);
        await waitFor(() =>
          expect(screen.getByRole('heading', { name: 'Primary Coordinator' })).toBeInTheDocument(),
        );
        await goToNextPage(user);
        await waitFor(() =>
          expect(
            screen.getByRole('heading', { name: 'Alternate Coordinator' }),
          ).toBeInTheDocument(),
        );
        await goToNextPage(user);
        await waitFor(() =>
          expect(
            screen.getByRole('heading', { name: 'Technical Coordinator' }),
          ).toBeInTheDocument(),
        );
        await goToNextPage(user);
        await waitFor(() =>
          expect(screen.getByRole('heading', { name: 'Shipping POC' })).toBeInTheDocument(),
        );
        await goToNextPage(user);
        await waitFor(() =>
          expect(screen.getByRole('heading', { name: 'Shipping Address' })).toBeInTheDocument(),
        );
        await goToNextPage(user);
        await waitFor(() => expect(setReadyToSubmit).toHaveBeenCalledTimes(2));
        expect(alertSpy).toHaveBeenCalled();
      });

      it('goes backWords and keeps all the form field values', async () => {
        const backWardsState = structuredClone(state2);
        backWardsState.step = 6;
        const { user, decrementStep, setPerson, setShippingAddress, setTestCenterInfo } =
          setup(backWardsState);
        expect(screen.getByRole('heading', { name: 'Shipping Address' })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Address 1' })).toHaveValue(
          '19 Clarendon Drive',
        );
        expect(screen.getByRole('textbox', { name: 'Country Iso Code' })).toHaveValue('AW');
        expect(screen.getByRole('combobox')).toHaveTextContent('Aruba');

        await goToPrevPage(user);
        await waitFor(() =>
          expect(screen.getByRole('heading', { name: 'Shipping POC' })).toBeInTheDocument(),
        );
        expect(screen.getByRole('textbox', { name: 'First Name' })).toHaveValue('Keefe');
        expect(screen.getByRole('textbox', { name: 'Last Name' })).toHaveValue('Wilkins');
        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue(
          'fyzyqyqi@mailinator.com',
        );
        expect(decrementStep).toHaveBeenCalledTimes(1);

        await goToPrevPage(user);
        await waitFor(() =>
          expect(
            screen.getByRole('heading', { name: 'Technical Coordinator' }),
          ).toBeInTheDocument(),
        );
        expect(screen.getByRole('textbox', { name: 'First Name' })).toHaveValue('Maxine');
        expect(screen.getByRole('textbox', { name: 'Last Name' })).toHaveValue('Sargent');
        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue(
          'xubumuwoje@mailinator.com',
        );
        expect(decrementStep).toHaveBeenCalledTimes(2);

        await goToPrevPage(user);
        await waitFor(() =>
          expect(
            screen.getByRole('heading', { name: 'Alternate Coordinator' }),
          ).toBeInTheDocument(),
        );
        expect(screen.getByRole('textbox', { name: 'First Name' })).toHaveValue('Tatum');
        expect(screen.getByRole('textbox', { name: 'Last Name' })).toHaveValue('Wells');
        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue(
          'tesonob@mailinator.com',
        );
        expect(decrementStep).toHaveBeenCalledTimes(3);

        await goToPrevPage(user);
        await waitFor(() =>
          expect(screen.getByRole('heading', { name: 'Primary Coordinator' })).toBeInTheDocument(),
        );
        expect(screen.getByRole('textbox', { name: 'First Name' })).toHaveValue('Azalia');
        expect(screen.getByRole('textbox', { name: 'Last Name' })).toHaveValue('Robles');
        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue(
          'xilawov@mailinator.com',
        );
        expect(decrementStep).toHaveBeenCalledTimes(4);

        await goToPrevPage(user);
        await waitFor(() =>
          expect(screen.getByRole('heading', { name: 'Test Center' })).toBeInTheDocument(),
        );
        expect(screen.getByRole('textbox', { name: 'Address 1' })).toHaveValue('887 First Lane');
        expect(screen.getByRole('textbox', { name: 'Test Center Name' })).toHaveValue('Zia Kirk');
        expect(screen.getByRole('textbox', { name: 'Test Center Type' })).toHaveValue(
          'Veritatis ad sed lab',
        );
        expect(screen.getByRole('textbox', { name: 'Country Iso Code' })).toHaveValue('US');
        expect(screen.getAllByRole('combobox')[0]).toHaveTextContent('United States of America');
        expect(screen.getAllByRole('combobox')[1]).toHaveTextContent('Virginia');
        expect(decrementStep).toHaveBeenCalledTimes(5);
        expect(setPerson).toHaveBeenCalledTimes(4);
        expect(setShippingAddress).toHaveBeenCalledTimes(1);
        expect(setTestCenterInfo).not.toHaveBeenCalled();
        await goToNextPage(user);
        await waitFor(() => expect(setTestCenterInfo).toHaveBeenCalled());
      });
    });
  });
});

const setup = (localState: typeof state2) => {
  const user = userEvent.setup();
  const setReadyToSubmit = vi.fn();
  const incrementStep = vi.fn();
  const decrementStep = vi.fn();
  const setTestCenterInfo = vi.fn();
  const setPerson = vi.fn();
  const setShippingAddress = vi.fn();
  const setStep = vi.fn();

  vi.spyOn(store, 'useCreateTestCenterProvider').mockImplementation(() => {
    const reactiveState = reactive(localState);
    incrementStep.mockImplementation(() => {
      reactiveState.step++;
    });
    decrementStep.mockImplementation(() => {
      reactiveState.step--;
    });

    setStep.mockImplementation((newStep: number) => {
      reactiveState.step = newStep;
    });

    setTestCenterInfo.mockImplementation(
      (testCenterName: string, testCenterType: string, reportingAddress: AddressType) => {
        reactiveState.testCenter.testCenterName = testCenterName;
        reactiveState.testCenter.testCenterType = testCenterType;
        Object.entries(reportingAddress).forEach(([key, value]) => {
          reactiveState.testCenter.reportingAddress[key as keyof AddressType] = value;
        });
      },
    );

    setPerson.mockImplementation((whichPerson: WhichPerson, person: PersonType) => {
      Object.entries(person).forEach(([key, value]) => {
        reactiveState.testCenter[whichPerson][key as keyof PersonType] = value;
      });
    });

    setReadyToSubmit.mockImplementation((newReady: boolean) => {
      reactiveState.readyToSubmit = newReady;
    });

    setShippingAddress.mockImplementation((address: AddressType) => {
      Object.entries(address).forEach(([key, value]) => {
        reactiveState.testCenter.shippingAddress[key as keyof AddressType] = value;
      });
    });

    const returnValue = {
      decrementStep,
      incrementStep,
      setPerson,
      setReadyToSubmit,
      setShippingAddress,
      setStep,
      setTestCenterInfo,
      state: reactiveState,
    };

    provide(CREATE_TEST_CENTER_PROVIDER_KEY, returnValue);

    return returnValue;
  });

  const result = render(CreateTestCenter);
  return {
    result,
    user,
    setReadyToSubmit,
    incrementStep,
    decrementStep,
    setTestCenterInfo,
    setPerson,
    setShippingAddress,
    setStep,
  };
};

const getNextButton = () => {
  return screen.getByRole('button', { name: 'Next' });
};
const getPrevButton = () => {
  return screen.getByRole('button', { name: 'Prev' });
};

const goToNextPage = async (user: UserEvent) => {
  const next = getNextButton();
  await user.click(next);
};

const goToPrevPage = async (user: UserEvent) => {
  const prev = getPrevButton();
  await user.click(prev);
};
