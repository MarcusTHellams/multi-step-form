import { render, screen, userEvent, waitFor } from '@/test/helper';
import type { UserEvent } from '@testing-library/user-event';
import CreateTestCenter from '../src/features/createTestCenter/CreateTestCenter.vue';
import { state2 } from '../src/features/createTestCenter/testUtils';

describe('CreateTestCenter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('happy path', () => {
    describe('multi-step form is submitted successfully', () => {
      it('goes through all the steps and submits', async () => {
        const alertSpy = vi.spyOn(window, 'alert');
        const { user } = setup(state2);
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
        await waitFor(() => expect(alertSpy).toHaveBeenCalled());
      });

      it('goes backWords and keeps all the form field values', async () => {
        const backWardsState = structuredClone(state2);
        backWardsState.step = 6;
        const { user } = setup(backWardsState);
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

        await goToPrevPage(user);
        await waitFor(() =>
          expect(screen.getByRole('heading', { name: 'Primary Coordinator' })).toBeInTheDocument(),
        );
        expect(screen.getByRole('textbox', { name: 'First Name' })).toHaveValue('Azalia');
        expect(screen.getByRole('textbox', { name: 'Last Name' })).toHaveValue('Robles');
        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue(
          'xilawov@mailinator.com',
        );

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
        await goToNextPage(user);
      });
    });
  });
});

const setup = (localState: typeof state2) => {
  const user = userEvent.setup();
  const result = render(CreateTestCenter, {
    props: {
      createTestCenterState: localState,
    },
  });
  return {
    result,
    user,
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
