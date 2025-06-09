/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { defineComponent } from 'vue';
import type { ComponentFieldBindingObject, FormContext } from 'vee-validate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import states from 'states-us';
import { getCountryIsoCd, getModifiedCountries, getStateCd, type AddressType } from 'schemas';
import VueSelect from 'vue3-select-component';
import { Input } from '@/components/ui/input';

const digitCheck = (event: KeyboardEvent) => {
  if ((event.key.length === 1 && isNaN(Number(event.key))) || event.code === 'Space') {
    event.preventDefault();
  }
};

export const fields = [
  {
    name: 'country',
    label: 'Country',
    comp: defineComponent<{ form: FormContext<AddressType> }>(
      ({ form }) => {
        return () => (
          <FormField name="country">
            {{
              default: ({
                componentField: { onChange, modelValue },
              }: {
                componentField: ComponentFieldBindingObject;
              }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <VueSelect
                      options={[
                        {
                          value: '',
                          label: '-- Select a Country --',
                        },
                        ...getModifiedCountries().map((country) => ({
                          label: country.name.official,
                          value: country.name.official,
                        })),
                      ]}
                      modelValue={modelValue}
                      onUpdate:modelValue={(value) => {
                        onChange(value);
                        form.setFieldValue('countryIsoCd', getCountryIsoCd(value), true);
                      }}
                      inputId="country"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              ),
            }}
          </FormField>
        );
      },
      {
        props: ['form'],
      },
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
    comp: defineComponent<{ form: FormContext<AddressType> }>(
      ({ form }) => {
        return () => (
          <FormField name="state">
            {{
              default: ({
                componentField: { name, onChange, modelValue },
              }: {
                componentField: ComponentFieldBindingObject;
              }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onUpdate:modelValue={(value) => {
                      if (value === 'noop') {
                        onChange('');
                        form.setFieldValue('stateCd', '', true);
                        return;
                      }
                      onChange(value);
                      form.setFieldValue('stateCd', getStateCd(value as string), true);
                    }}
                    name={name}
                    modelValue={!modelValue ? 'noop' : modelValue}
                  >
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="noop">-- Select a State --</SelectItem>
                        {states.map((state) => (
                          <SelectItem value={state.name}>{state.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </FormControl>
                  </Select>
                  <FormMessage />
                </FormItem>
              ),
            }}
          </FormField>
        );
      },
      {
        props: ['form'],
      },
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

export const AddressField = defineComponent<{
  field: (typeof fields)[number];
}>(
  ({ field }) => {
    return () => (
      <FormField name={field.name}>
        {{
          default: ({ componentField }: { componentField: ComponentFieldBindingObject }) => (
            <>
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    // @ts-expect-error
                    maxLength={field.maxLength}
                    onkeydown={field.onKeyDown}
                    readonly={field.readonly}
                    type={field.type}
                    {...componentField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          ),
        }}
      </FormField>
    );
  },
  {
    props: ['field'],
    name: 'AddressField',
  },
);
