import { inject, provide, reactive } from 'vue';
import {
  type TestCenterStoreType,
  initialStore,
  type AddressType,
  type WhichPerson,
  type PersonType,
} from 'schemas';
import type { PartialDeep } from 'type-fest';
import merge from 'lodash/merge';

export const CREATE_TEST_CENTER_PROVIDER_KEY = 'CREATE_TEST_CENTER_PROVIDER_KEY';

export const useCreateTestCenterProvider = (state?: PartialDeep<TestCenterStoreType>) => {
  const _state = merge(structuredClone(initialStore), state);
  const reactiveState = reactive(_state);

  const incrementStep = () => {
    reactiveState.step++;
  };
  const decrementStep = () => {
    reactiveState.step--;
  };
  const setStep = (newStep: number) => {
    reactiveState.step = newStep;
  };

  const setTestCenterInfo = (
    testCenterName: string,
    testCenterType: string,
    reportingAddress: AddressType,
  ) => {
    reactiveState.testCenter.testCenterName = testCenterName;
    reactiveState.testCenter.testCenterType = testCenterType;
    Object.entries(reportingAddress).forEach(([key, value]) => {
      reactiveState.testCenter.reportingAddress[key as keyof AddressType] = value;
    });
  };

  const setPerson = (whichPerson: WhichPerson, person: PersonType) => {
    Object.entries(person).forEach(([key, value]) => {
      reactiveState.testCenter[whichPerson][key as keyof PersonType] = value;
    });
  };

  const setReadyToSubmit = (newReady: boolean) => {
    reactiveState.readyToSubmit = newReady;
  };

  const setShippingAddress = (address: AddressType) => {
    Object.entries(address).forEach(([key, value]) => {
      reactiveState.testCenter.shippingAddress[key as keyof AddressType] = value;
    });
  };

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
};

export const useCreateTestCenterContext = () => {
  const store = inject(CREATE_TEST_CENTER_PROVIDER_KEY) as ReturnType<
    typeof useCreateTestCenterProvider
  >;

  if (!store) {
    throw new Error(
      'Can not find an ancestor that is injecting the CREATE_TEST_CENTER_PROVIDER_KEY',
    );
  }

  return store;
};
