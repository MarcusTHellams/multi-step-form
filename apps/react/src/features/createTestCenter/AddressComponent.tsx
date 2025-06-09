import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AddressField, fields } from './useAddressComponent';
import type { AddressType } from 'schemas';

export const AddressComponent = () => {
  const form = useFormContext<AddressType>();

  const isInternational = form.watch('countryIsoCd').toLowerCase() !== 'us';

  return (
    <>
      {fields.slice(0, 6).map((fieldDefinition) => {
        if (fieldDefinition.comp) {
          return (
            <React.Fragment key={fieldDefinition.name}>{fieldDefinition.comp(form)}</React.Fragment>
          );
        }
        return <AddressField key={fieldDefinition.name} fieldDefinition={fieldDefinition} />;
      })}

      {!isInternational
        ? fields.slice(6, 10).map((fieldDefinition) => {
            if (fieldDefinition.comp) {
              return (
                <React.Fragment key={fieldDefinition.name}>
                  {fieldDefinition.comp(form)}
                </React.Fragment>
              );
            }
            return <AddressField key={fieldDefinition.name} fieldDefinition={fieldDefinition} />;
          })
        : fields.slice(10).map((fieldDefinition) => {
            return <AddressField key={fieldDefinition.name} fieldDefinition={fieldDefinition} />;
          })}
    </>
  );
};
