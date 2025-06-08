import { createStore, useStore } from 'zustand';
import { produce } from 'immer';
import { CreateTestCenterView } from '../CreateTestCenterView';
import { CreateTestCenterStoreContext } from '../createTestCenterStore';
import type {
  CreateTestCenterStoreActions,
  CreateTestCenterStoreType,
} from '../createTestCenterStore';
import type { TestCenterStoreType, WhichPerson, initialStore } from 'schemas';
import type { PropsWithChildren } from 'react';
import type { UserEvent } from '@testing-library/user-event';
import { render, screen, userEvent } from '@/test/helper';

const Wrapper = ({ store, children }: PropsWithChildren<{ store: CreateTestCenterStoreType }>) => {
  return <CreateTestCenterStoreContext value={store}> {children}</CreateTestCenterStoreContext>;
};

describe('CreateTestCenterView', () => {
  describe('happy path', () => {
    it('move through steps and successfully submit create the new test center', async () => {
      const { user, incrementStep } = setup(state2);
      expect(screen.getByRole('heading', { name: 'Test Center' })).toBeInTheDocument();
      await goToNextPage(user);
      expect(incrementStep).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('heading', { name: 'Primary Coordinator' })).toBeInTheDocument();
    });
  });
});

const setup = (_state: TestCenterStoreType) => {
  const user = userEvent.setup();
  const incrementStep = vi.fn();
  const decrementStep = vi.fn();
  const setStep = vi.fn();
  const setReadyToSubmit = vi.fn();
  const updateTestCenterInfo = vi.fn();
  const updatePerson = vi.fn();
  const updateShippingAddress = vi.fn();

  const store = createStore<TestCenterStoreType & CreateTestCenterStoreActions>()((set) => ({
    ..._state,
    incrementStep: incrementStep.mockImplementation(() => set(({ step }) => ({ step: step + 1 }))),
    decrementStep: decrementStep.mockImplementation(() => set(({ step }) => ({ step: step - 1 }))),
    setStep: setStep.mockImplementation((newStep) => set(() => ({ step: newStep }))),
    setReadyToSubmit: setReadyToSubmit.mockImplementation((newReady) =>
      set(() => ({ readyToSubmit: newReady })),
    ),
    updateTestCenterInfo: updateTestCenterInfo.mockImplementation(
      (testCenterName, testCenterType, reportingAddress) =>
        set((state) =>
          produce(state, (draft) => {
            draft.testCenter.testCenterName = testCenterName;
            draft.testCenter.testCenterType = testCenterType;
            draft.testCenter.reportingAddress = reportingAddress;
          }),
        ),
    ),
    updatePerson: updatePerson.mockImplementation((whichPerson, person) =>
      set((state) =>
        produce(state, (draft) => {
          draft.testCenter[whichPerson as WhichPerson] = person;
        }),
      ),
    ),
    updateShippingAddress: updateShippingAddress.mockImplementation((address) =>
      set((state) =>
        produce(state, (draft) => {
          draft.testCenter.shippingAddress = address;
        }),
      ),
    ),
  }));

  const result = render(
    <Wrapper store={store}>
      <CreateTestCenterView />
    </Wrapper>,
  );

  return {
    incrementStep,
    decrementStep,
    setStep,
    setReadyToSubmit,
    updateTestCenterInfo,
    updatePerson,
    updateShippingAddress,
    store,
    result,
    user,
  };
};

const state2: TestCenterStoreType = {
  step: 1,
  readyToSubmit: false,
  testCenter: {
    testCenterName: 'Zia Kirk',
    testCenterType: 'Veritatis ad sed lab',
    alternateCoordinator: {
      firstName: 'Tatum',
      lastName: 'Wells',
      email: 'tesonob@mailinator.com',
      phone: '+1 (105) 147-8384',
    },
    primaryCoordinator: {
      firstName: 'Azalia',
      lastName: 'Robles',
      email: 'xilawov@mailinator.com',
      phone: '+1 (747) 635-7543',
    },
    shippingPoc: {
      firstName: 'Keefe',
      lastName: 'Wilkins',
      email: 'fyzyqyqi@mailinator.com',
      phone: '+1 (156) 275-8443',
    },
    techCoordinator: {
      firstName: 'Maxine',
      lastName: 'Sargent',
      email: 'xubumuwoje@mailinator.com',
      phone: '+1 (288) 313-1218',
    },
    reportingAddress: {
      country: 'United States of America',
      countryIsoCd: 'US',
      address1: '887 First Lane',
      address2: 'Est consequatur Sit',
      address3: 'Praesentium consequa',
      city: 'Consequatur Cum rep',
      intlPostalCd: '',
      regionName: '',
      state: 'Virginia',
      stateCd: 'VA',
      zip4: '4444',
      zip5: '55555',
    },
    shippingAddress: {
      country: 'Aruba',
      countryIsoCd: 'AW',
      address1: '19 Clarendon Drive',
      address2: 'Eius eaque veniam d',
      address3: 'Excepturi deleniti q',
      city: 'Quis consequatur ame',
      intlPostalCd: '555555',
      regionName: 'Teagan Campbell',
      state: '',
      stateCd: '',
      zip4: '',
      zip5: '',
    },
  },
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
