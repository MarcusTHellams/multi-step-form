import { useFormContext } from 'react-hook-form'
import states from 'states-us'
import countries from 'world-countries'
import SELECT from 'react-select'
import { getCountryIsoCd, getModifiedCountries, getStateCd } from 'schemas'
import type { AddressType } from 'schemas'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const countrySelectLabel = '-- Select a Country --'

const digitCheck = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key.length === 1 && isNaN(Number(event.key))) {
    event.preventDefault()
  }
}

const getCountryOption = (countryName: string) => {
  const _country = countries.find(
    (country) => country.name.official === countryName,
  )
  if (_country) {
    return {
      value: _country.name.official,
      label: _country.name.official,
    }
  }
  return {
    value: '',
    label: countrySelectLabel,
  }
}

export const AddressComponent = () => {
  const form = useFormContext<AddressType>()

  const isInternational = form.watch('countryIsoCd').toLowerCase() !== 'us'

  return (
    <>
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>Country</FormLabel>
              <FormControl>
                <SELECT
                  name={field.name}
                  inputId={field.name}
                  value={getCountryOption(field.value)}
                  onChange={(newValue) => {
                    field.onChange(newValue?.value || '')
                    form.setValue(
                      'countryIsoCd',
                      getCountryIsoCd(newValue?.value || ''),
                      {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      },
                    )
                  }}
                  onBlur={field.onBlur}
                  options={[
                    {
                      value: '',
                      label: countrySelectLabel,
                    },
                    ...getModifiedCountries().map((country) => ({
                      label: country.name.official,
                      value: country.name.official,
                    })),
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={form.control}
        name="countryIsoCd"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>Country Iso Code</FormLabel>
              <FormControl>
                <Input readOnly id={field.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      <FormField
        control={form.control}
        name="address1"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>Address 1</FormLabel>
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
        name="address2"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>Address 2</FormLabel>
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
        name="address3"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>Address 3</FormLabel>
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
        name="city"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>City</FormLabel>
              <FormControl>
                <Input id={field.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      {!isInternational ? (
        <>
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>State</FormLabel>
                  <Select
                    onValueChange={(newValue) => {
                      const _newValue = newValue === 'noop' ? '' : newValue
                      field.onChange(_newValue)
                      form.setValue('stateCd', getStateCd(_newValue), {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }}
                    value={!field.value ? 'noop' : field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        onBlur={field.onBlur}
                        name={field.name}
                        disabled={field.disabled}
                        id={field.name}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="noop">-- Choose a State --</SelectItem>
                      {states.map(({ name }) => (
                        <SelectItem value={name} key={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="stateCd"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>StateCode</FormLabel>
                  <FormControl>
                    <Input readOnly id={field.name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="zip5"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Zip 5</FormLabel>
                  <FormControl>
                    <Input
                      onKeyDown={digitCheck}
                      maxLength={5}
                      id={field.name}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="zip4"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Zip 4</FormLabel>
                  <FormControl>
                    <Input
                      onKeyDown={digitCheck}
                      maxLength={4}
                      id={field.name}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </>
      ) : (
        <>
          <FormField
            control={form.control}
            name="intlPostalCd"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>
                    International Postal Code
                  </FormLabel>
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
            name="regionName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Region Name</FormLabel>
                  <FormControl>
                    <Input id={field.name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </>
      )}
    </>
  )
}
