import React from 'react';
import { FormSelect, FormSelectOption } from '@patternfly/react-core';

interface SelectProps {
  options: string[],
  backendState: [string, React.Dispatch<React.SetStateAction<string>>]
}

export const BackendSelect: React.FunctionComponent<SelectProps> = ({ options, backendState: [backend, setBackend] }) => {

  const onChange = (_: any, value: string) => {
    setBackend(value);
  };

  return (
    <FormSelect value={backend} onChange={onChange} aria-label="FormSelect Input" ouiaId="BasicFormSelect">
      {options.map((option, index) => (
        <FormSelectOption isDisabled={false} key={index} value={option} label={option} />
      ))}
    </FormSelect>
  );
};