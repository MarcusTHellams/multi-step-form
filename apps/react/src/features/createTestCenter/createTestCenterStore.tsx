import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'
import merge from 'lodash/merge'
import { initialStore } from 'schemas'
import { produce } from 'immer'
import type { PropsWithChildren } from 'react'
import type {
  AddressType,
  PersonType,
  TestCenterStoreType,
  WhichPerson,
} from 'schemas'
import type { PartialDeep } from 'type-fest'

export type CreateTestCenterStoreType = ReturnType<typeof getCreateTestCenterStore>

export const CreateTestCenterStoreContext = createContext<
  CreateTestCenterStoreType | undefined
>(undefined)

export type CreateTestCenterStoreActions = {
  incrementStep: () => void
  decrementStep: () => void
  setStep: (newStep: number) => void
  setReadyToSubmit: (ready: boolean) => void
  updateTestCenterInfo: (
    testCenterName: string,
    testCenterType: string,
    reportingAddress: AddressType,
  ) => void

  updatePerson: (whichPerson: WhichPerson, person: PersonType) => void
  updateShippingAddress: (newAddress: AddressType) => void
}

export const getCreateTestCenterStore = (
  store?: PartialDeep<TestCenterStoreType>,
) => {
  const _store = merge(structuredClone(initialStore), store)
  return createStore<TestCenterStoreType & CreateTestCenterStoreActions>()(
    (set) => ({
      ..._store,
      incrementStep: () => set(({ step }) => ({ step: step + 1 })),
      decrementStep: () => set(({ step }) => ({ step: step - 1 })),
      setStep: (newStep) => set(() => ({ step: newStep })),
      setReadyToSubmit: (newReady) => set(() => ({ readyToSubmit: newReady })),
      updateTestCenterInfo: (
        testCenterName,
        testCenterType,
        reportingAddress,
      ) =>
        set((state) =>
          produce(state, (draft) => {
            draft.testCenter.testCenterName = testCenterName
            draft.testCenter.testCenterType = testCenterType
            draft.testCenter.reportingAddress = reportingAddress
          }),
        ),
      updatePerson: (whichPerson, person) =>
        set((state) =>
          produce(state, (draft) => {
            draft.testCenter[whichPerson] = person
          }),
        ),
      updateShippingAddress: (address) =>
        set((state) =>
          produce(state, (draft) => {
            draft.testCenter.shippingAddress = address
          }),
        ),
    }),
  )
}

export const useCreateTestCenterStore = <T,>(
  selectorFn: (state: TestCenterStoreType & CreateTestCenterStoreActions) => T,
) => {
  const store = useContext(CreateTestCenterStoreContext)
  if (!store) {
    throw new Error(
      'Can not locate an ancestor that has CreateTestCenterStoreContext',
    )
  }
  return useStore(store, selectorFn)
}

export const CreateTestCenterStoreContextProvider = (
  props: PropsWithChildren,
) => {
  const store = useRef(getCreateTestCenterStore())
  return <CreateTestCenterStoreContext value={store.current} {...props} />
}
