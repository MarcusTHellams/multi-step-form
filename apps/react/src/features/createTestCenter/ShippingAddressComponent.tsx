import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { addAddressRefinement } from 'schemas'
import { AddressComponent } from './AddressComponent'
import { useCreateTestCenterStore } from './createTestCenterStore'
import { PrevNextComponent } from './PrevNextComponent'
import type { AddressType } from 'schemas'
import type { Resolver } from 'react-hook-form'
import { Form } from '@/components/ui/form'

export const ShippingAddressComponent = () => {
  const decrementStep = useCreateTestCenterStore((state) => state.decrementStep)
  const setReadyToSubmit = useCreateTestCenterStore(
    (state) => state.setReadyToSubmit,
  )
  const updateShippingAddress = useCreateTestCenterStore(
    (state) => state.updateShippingAddress,
  )
  const shippingAddress = useCreateTestCenterStore(
    (state) => state.testCenter.shippingAddress,
  )

  const form = useForm<AddressType>({
    defaultValues: shippingAddress,
    resolver: zodResolver(
      addAddressRefinement(),
    ) as unknown as Resolver<AddressType>,
  })

  const submitHandler = form.handleSubmit((values) => {
    updateShippingAddress(values)
    setReadyToSubmit(true)
  })

  const prevHandler = () => {
    updateShippingAddress(form.getValues())
    decrementStep()
  }

  return (
    <>
      <h1 className="text-center">Shipping Address</h1>
      <Form {...form}>
        <form
          onSubmit={submitHandler}
          noValidate
          className="not-prose space-y-5"
        >
          <AddressComponent />
          <PrevNextComponent {...{ prevHandler }} />
        </form>
      </Form>
    </>
  )
}
