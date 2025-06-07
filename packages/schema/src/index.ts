import { z, type AnyZodObject } from 'zod';
export * from './countryAndStateUtils';

export const addAddressRefinement = (schema?: AnyZodObject) => {
  return addressSchema
    .merge(schema || z.object({}))
    .superRefine(({ countryIsoCd, zip5, state, stateCd }, ctx) => {
      if (countryIsoCd.toLowerCase() === 'us') {
        if (!zip5) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Zip 5 is Required',
            path: ['zip5'],
          });
        }
        if (!state) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'State is Required',
            path: ['state'],
          });
        }
        if (!stateCd) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'State Code is Required',
            path: ['stateCd'],
          });
        }
      }
    });
};

export const personSchema = z.object({
  firstName: z
    .string({ required_error: 'First Name is Required' })
    .nonempty('First Name is Required'),
  lastName: z.string({ required_error: 'Last Name is Required' }).nonempty('Last Name is Required'),
  email: z
    .string()
    .nonempty('Email is Required')
    .refine(
      (email) => {
        if (email.length === 0) {
          return true;
        }

        const { success } = z.string().email().safeParse(email);

        if (!success) {
          return false;
        }

        return true;
      },
      {
        message: 'A Valid Email is Required',
      },
    ),
  phone: z.string().optional(),
});

export type PersonType = z.infer<typeof personSchema>;

export const addressSchema = z.object({
  country: z.string({ required_error: 'Country is Required' }).nonempty('Country is Required'),
  countryIsoCd: z
    .string({ required_error: 'Country Iso Code is Required' })
    .nonempty('Country Iso Code is Required'),
  address1: z.string({ required_error: 'Address 1 is Required' }).nonempty('Address 1 is Required'),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string({ required_error: 'City is Required' }).nonempty('City is Required'),
  state: z.string().optional(),
  stateCd: z.string().optional(),
  zip5: z.string().optional(),
  zip4: z.string().optional(),
  intlPostalCd: z.string().optional(),
  regionName: z.string().optional(),
});

export type AddressType = z.infer<typeof addressSchema>;

export const testCenterInfoSchema = z.object({
  testCenterName: z
    .string({ required_error: 'Test Center Name is Required' })
    .nonempty('Test Center Name is Required'),
  testCenterType: z
    .string({ required_error: 'Test Center Type is Required' })
    .nonempty('Test Center Type is Required'),
});

export type TestCenterInfoType = z.infer<typeof testCenterInfoSchema>;

export const testCenterSchema = z
  .object({
    testCenterName: z.string(),
    testCenterType: z.string(),
  })
  .merge(
    z.object({
      reportingAddress: addressSchema,
      shippingAddress: addressSchema,
      primaryCoordinator: personSchema,
      alternateCoordinator: personSchema,
      techCoordinator: personSchema,
      shippingPoc: personSchema,
    }),
  );

export type WhichPerson =
  | 'primaryCoordinator'
  | 'alternateCoordinator'
  | 'techCoordinator'
  | 'shippingPoc';

export type TestCenterType = z.infer<typeof testCenterSchema>;

export const testCenterStoreSchema = z
  .object({
    step: z.number(),
    readyToSubmit: z.boolean(),
  })
  .merge(
    z.object({
      testCenter: testCenterSchema,
    }),
  );

export type TestCenterStoreType = z.infer<typeof testCenterStoreSchema>;

export const initialPerson: PersonType = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export const initialAddress: AddressType = {
  country: '',
  countryIsoCd: '',
  address1: '',
  address2: '',
  address3: '',
  city: '',
  intlPostalCd: '',
  regionName: '',
  state: '',
  stateCd: '',
  zip4: '',
  zip5: '',
};

export const initialTestCenter: TestCenterType = {
  testCenterName: '',
  testCenterType: '',
  alternateCoordinator: {
    ...initialPerson,
  },
  primaryCoordinator: {
    ...initialPerson,
  },
  shippingPoc: {
    ...initialPerson,
  },
  techCoordinator: {
    ...initialPerson,
  },
  reportingAddress: {
    ...initialAddress,
  },
  shippingAddress: {
    ...initialAddress,
  },
};

export const initialStore: TestCenterStoreType = {
  step: 1,
  readyToSubmit: false,
  testCenter: initialTestCenter,
};
