import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { personSchema } from 'schemas'
import { useCreateTestCenterStore } from './createTestCenterStore'
import { PersonFormComponent } from './PersonFormComponent'
import { PrevNextComponent } from './PrevNextComponent'
import type { PersonType, WhichPerson } from 'schemas'
import { Form } from '@/components/ui/form'

type PersonStepComponentProps = {
  whichPerson: WhichPerson
  title: string
}

export const PersonStepComponent = ({
  title,
  whichPerson,
}: PersonStepComponentProps) => {
  const incrementStep = useCreateTestCenterStore((state) => state.incrementStep)
  const decrementStep = useCreateTestCenterStore((state) => state.decrementStep)
  const updatePerson = useCreateTestCenterStore((state) => state.updatePerson)
  const person = useCreateTestCenterStore(
    (state) => state.testCenter[whichPerson],
  )

  const form = useForm<PersonType>({
    defaultValues: person,
    resolver: zodResolver(personSchema),
  })

  const submitHandler = form.handleSubmit((values) => {
    updatePerson(whichPerson, values)
    incrementStep()
  })

  const prevHandler = () => {
    updatePerson(whichPerson, form.getValues())
    decrementStep()
  }

  return (
    <>
      <h1 className="text-center">{title}</h1>
      <Form {...form}>
        <form
          onSubmit={submitHandler}
          noValidate
          className="not-prose space-y-5"
        >
          <PersonFormComponent />
          <PrevNextComponent {...{ prevHandler }} />
        </form>
      </Form>
    </>
  )
}
