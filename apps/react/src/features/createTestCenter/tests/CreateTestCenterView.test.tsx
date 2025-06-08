import { useRef } from 'react';
import { CreateTestCenterView } from '../CreateTestCenterView';
import { CreateTestCenterStoreContext, getCreateTestCenterStore } from '../createTestCenterStore';
import type { UserEvent } from '@testing-library/user-event';
import type { PropsWithChildren } from 'react';
import type { TestCenterStoreType } from 'schemas';
import type { PartialDeep } from 'type-fest';
import { render, screen, userEvent } from '@/test/helper';
import selectEvent from 'react-select-event';

const Wrapper = ({
  state,
  children,
}: PropsWithChildren<{ state: PartialDeep<TestCenterStoreType> }>) => {
  const store = useRef(getCreateTestCenterStore(state));
  return (
    <CreateTestCenterStoreContext value={store.current}> {children}</CreateTestCenterStoreContext>
  );
};

describe('CreateTestCenterView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('happy path', () => {
    it('move through steps and successfully submit create the new test center', async () => {
      const alertSpy = vi.spyOn(window, 'alert');
      const { user } = setup(state2);
      expect(screen.getByRole('heading', { name: 'Test Center' })).toBeInTheDocument();
      await goToNextPage(user);
      expect(screen.getByRole('heading', { name: 'Primary Coordinator' })).toBeInTheDocument();
      await goToNextPage(user);
      expect(screen.getByRole('heading', { name: 'Alternate Coordinator' })).toBeInTheDocument();
      await goToNextPage(user);
      expect(screen.getByRole('heading', { name: 'Technical Coordinator' })).toBeInTheDocument();
      await goToNextPage(user);
      expect(screen.getByRole('heading', { name: 'Shipping POC' })).toBeInTheDocument();
      await goToNextPage(user);
      expect(screen.getByRole('heading', { name: 'Shipping Address' })).toBeInTheDocument();
      await goToNextPage(user);
      expect(alertSpy).toHaveBeenCalled();
    });

    it('move backwards through the steps and keeps the form information intact', async () => {
      const { user } = setup({ ...structuredClone(state2), step: 6 });
      expect(screen.getByRole('heading', { name: 'Shipping Address' })).toBeInTheDocument();
      expect(getInput('Country Iso Code')).toHaveValue('AW');
      expect(getInput('Address 1')).toHaveValue('19 Clarendon Drive');
      expect(screen.getByText('Aruba')).toBeInTheDocument();
      await goToPrevPage(user);
      expect(screen.getByRole('heading', { name: 'Shipping POC' })).toBeInTheDocument();
      expect(getInput('First Name')).toHaveValue('Keefe');
      expect(getInput('Last Name')).toHaveValue('Wilkins');
      expect(getInput('Email')).toHaveValue('fyzyqyqi@mailinator.com');
      await goToPrevPage(user);
      expect(screen.getByRole('heading', { name: 'Technical Coordinator' })).toBeInTheDocument();
      expect(getInput('First Name')).toHaveValue('Maxine');
      expect(getInput('Last Name')).toHaveValue('Sargent');
      expect(getInput('Email')).toHaveValue('xubumuwoje@mailinator.com');

      await goToPrevPage(user);
      expect(screen.getByRole('heading', { name: 'Alternate Coordinator' })).toBeInTheDocument();
      expect(getInput('First Name')).toHaveValue('Tatum');
      expect(getInput('Last Name')).toHaveValue('Wells');
      expect(getInput('Email')).toHaveValue('tesonob@mailinator.com');

      await goToPrevPage(user);
      expect(screen.getByRole('heading', { name: 'Primary Coordinator' })).toBeInTheDocument();
      expect(getInput('First Name')).toHaveValue('Azalia');
      expect(getInput('Last Name')).toHaveValue('Robles');
      expect(getInput('Email')).toHaveValue('xilawov@mailinator.com');

      await goToPrevPage(user);
      expect(screen.getByRole('heading', { name: 'Test Center' })).toBeInTheDocument();
      expect(getInput('Country Iso Code')).toHaveValue('US');
      expect(getInput('Address 1')).toHaveValue('887 First Lane');
      expect(getStateSelect()).toHaveTextContent('Virginia');
      expect(screen.getByText('United States of America')).toBeInTheDocument();
    });
  });
});

const setup = (_state: PartialDeep<TestCenterStoreType>) => {
  const user = userEvent.setup();
  const result = render(
    <Wrapper state={_state}>
      <CreateTestCenterView />
    </Wrapper>,
  );
  return {
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

const getInput = (name: string) => {
  return screen.getByRole('textbox', { name });
};

const getCountrySelect = () => {
  return screen.getByLabelText('Country');
};

const getStateSelect = () => {
  return screen.getByRole('combobox', { name: 'State' });
};
