import { useFormContext } from 'react-hook-form'
import type { PersonType } from 'schemas'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export const PersonFormComponent = () => {
  const form = useFormContext<PersonType>()

  return (
    <>
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>First Name</FormLabel>
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
        name="lastName"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>Last Name</FormLabel>
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
        name="email"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>Email</FormLabel>
              <FormControl>
                <Input type="email" id={field.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>Phone</FormLabel>
              <FormControl>
                <Input type="tel" id={field.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </>
  )
}
