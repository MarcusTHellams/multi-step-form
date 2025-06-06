/* eslint-disable no-shadow */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addAddressRefinement, testCenterInfoSchema } from 'schemas'
import { useCreateTestCenterStore } from './createTestCenterStore'
import { AddressComponent } from './AddressComponent'
import type { Resolver } from 'react-hook-form'
import type { AddressType, TestCenterInfoType } from 'schemas'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const schema = addAddressRefinement(testCenterInfoSchema)

export const TestCenterInfoComponent = () => {
  const incrementStep = useCreateTestCenterStore((state) => state.incrementStep)
  const { reportingAddress, testCenterName, testCenterType } =
    useCreateTestCenterStore((state) => state.testCenter)
  const updateTestCenterInfo = useCreateTestCenterStore(
    (state) => state.updateTestCenterInfo,
  )

  const form = useForm<TestCenterInfoType & AddressType>({
    defaultValues: {
      testCenterName,
      testCenterType,
      ...reportingAddress,
    },
    resolver: zodResolver(schema) as unknown as Resolver<
      TestCenterInfoType & AddressType
    >,
  })

  const submitHandler = form.handleSubmit(
    ({ testCenterName, testCenterType, ...address }) => {
      updateTestCenterInfo(testCenterName, testCenterType, address)
      incrementStep()
    },
  )

  return (
    <>
      <h1 className="text-center">Test Center</h1>
      <Form {...form}>
        <form
          onSubmit={submitHandler}
          noValidate
          className="not-prose space-y-5"
        >
          <FormField
            control={form.control}
            name="testCenterName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Test Center Name</FormLabel>
                  <FormControl>
                    <Input id={field.name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="testCenterType"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Test Center Type</FormLabel>
                  <FormControl>
                    <Input id={field.name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <AddressComponent />
          <Button type="submit">Next</Button>
        </form>
      </Form>
    </>
  )
}
