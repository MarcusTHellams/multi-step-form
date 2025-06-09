import SELECT from 'react-select';
import { getCountryIsoCd, getModifiedCountries, getStateCd } from 'schemas';
import countries from 'world-countries';
import states from 'states-us';
import { useFormContext } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import type { AddressType } from 'schemas';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const digitCheck = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if ((event.key.length === 1 && isNaN(Number(event.key))) || event.code === 'Space') {
    event.preventDefault();
  }
};

const countrySelectLabel = '-- Select a Country --';

const getCountryOption = (countryName: string) => {
  const _country = countries.find((country) => country.name.official === countryName);
  if (_country) {
    return {
      value: _country.name.official,
      label: _country.name.official,
    };
  }
  return {
    value: '',
    label: countrySelectLabel,
  };
};

export const fields = [
  {
    name: 'country',
    label: 'Country',
    comp: (form: UseFormReturn<AddressType>) => (
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>Country</FormLabel>
              <FormControl>
                <SELECT
                  isDisabled={field.disabled}
                  name={field.name}
                  inputId={field.name}
                  ref={field.ref}
                  value={getCountryOption(field.value)}
                  onChange={(newValue) => {
                    field.onChange(newValue?.value || '');
                    form.setValue('countryIsoCd', getCountryIsoCd(newValue?.value || ''), {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
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
          );
        }}
      />
    ),
  },
  {
    name: 'countryIsoCd',
    label: 'Country Iso Code',
    readonly: true,
    type: 'text',
  },
  {
    name: 'address1',
    label: 'Address 1',
    readonly: false,
    type: 'text',
  },
  {
    name: 'address2',
    label: 'Address 2',
    readonly: false,
    type: 'text',
  },
  {
    name: 'address3',
    label: 'Address 3',
    readonly: false,
    type: 'text',
  },
  {
    name: 'city',
    label: 'City',
    readonly: false,
    type: 'text',
  },
  {
    name: 'state',
    label: 'State',
    comp: (form: UseFormReturn<AddressType>) => (
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel htmlFor={field.name}>State</FormLabel>
              <Select
                onValueChange={(newValue) => {
                  const _newValue = newValue === 'noop' ? '' : newValue;
                  field.onChange(_newValue);
                  form.setValue('stateCd', getStateCd(_newValue), {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
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
          );
        }}
      />
    ),
  },
  {
    name: 'stateCd',
    label: 'State Code',
    readonly: true,
    type: 'text',
  },
  {
    name: 'zip5',
    label: 'Zip 5',
    readonly: false,
    type: 'text',
    onKeyDown: digitCheck,
    maxLength: 5,
  },
  {
    name: 'zip4',
    label: 'Zip 4',
    readonly: false,
    type: 'text',
    onKeyDown: digitCheck,
    maxLength: 4,
  },
  {
    name: 'intlPostalCd',
    label: 'International Postal Code',
    readonly: false,
    type: 'text',
  },
  {
    name: 'regionName',
    label: 'Region Name',
    readonly: false,
    type: 'text',
  },
];

export const AddressField = ({ fieldDefinition }: { fieldDefinition: (typeof fields)[number] }) => {
  const { name, label, onKeyDown, maxLength, type, readonly } = fieldDefinition;
  const form = useFormContext<AddressType>();
  return (
    <FormField
      control={form.control}
      name={name as keyof AddressType}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <FormControl>
              <Input
                readOnly={readonly}
                type={type}
                onKeyDown={onKeyDown}
                maxLength={maxLength}
                id={field.name}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
