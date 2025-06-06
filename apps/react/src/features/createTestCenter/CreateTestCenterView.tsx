import { useState } from 'react'
import { useCreateTestCenterStore } from './createTestCenterStore'
import { PersonStepComponent } from './PersonStepComponent'
import { ShippingAddressComponent } from './ShippingAddressComponent'
import { TestCenterInfoComponent } from './TestCenterInfoComponent'

export const CreateTestCenterView = () => {
  const step = useCreateTestCenterStore((state) => state.step)
  const readyToSubmit = useCreateTestCenterStore((state) => state.readyToSubmit)
  const setReadyToSubmit = useCreateTestCenterStore(
    (state) => state.setReadyToSubmit,
  )
  const testCenter = useCreateTestCenterStore((state) => state.testCenter)

  const [prevReadyToSubmit, setPrevReadyToSubmit] = useState(readyToSubmit)

  if (prevReadyToSubmit !== readyToSubmit) {
    if (readyToSubmit) {
      alert(
        `Ready to create test center: \n ${JSON.stringify(testCenter, null, 2)}`,
      )
      setReadyToSubmit(false)
    }

    setPrevReadyToSubmit(readyToSubmit)
  }

  let comp: React.ReactNode
  switch (step) {
    case 1:
      comp = <TestCenterInfoComponent />
      break
    case 2:
      comp = (
        <PersonStepComponent
          key={2}
          whichPerson="primaryCoordinator"
          title="Primary Coordinator"
        />
      )
      break
    case 3:
      comp = (
        <PersonStepComponent
          key={3}
          whichPerson="alternateCoordinator"
          title="Alternate Coordinator"
        />
      )
      break
    case 4:
      comp = (
        <PersonStepComponent
          key={4}
          whichPerson="techCoordinator"
          title="Technical Coordinator"
        />
      )
      break
    case 5:
      comp = (
        <PersonStepComponent
          key={5}
          whichPerson="shippingPoc"
          title="Shipping POC"
        />
      )
      break

    default:
      comp = <ShippingAddressComponent />
      break
  }
  return <main className="mx-auto mt-16 mb-16 w-4/12">{comp}</main>
}
