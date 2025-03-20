import React from 'react';
import { FormSelect, FormSelectOption } from '@patternfly/react-core';
import { ProxyData } from './DomainTable';

interface SelectProps {
  options: string[],
  initial: string,
  index: number,
  proxyData: ProxyData[]
}

export const BackendSelect: React.FunctionComponent<SelectProps> = ({ options, initial, index, proxyData }) => {
  const [formSelectValue, setFormSelectValue] = React.useState(initial);

  const onChange = (_: any, value: string) => {
    setFormSelectValue(value);
    proxyData.forEach(date => {if (date.index === index) date.backend = value});
  };

  return (
    <FormSelect value={formSelectValue} onChange={onChange} aria-label="FormSelect Input" ouiaId="BasicFormSelect">
      {options.map((option, index) => (
        <FormSelectOption isDisabled={false} key={index} value={option} label={option} />
      ))}
    </FormSelect>
  );
};