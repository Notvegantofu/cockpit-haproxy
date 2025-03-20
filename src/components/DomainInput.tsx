import React, { useState } from "react";
import { TextInput } from "@patternfly/react-core";
import { ProxyData } from "./DomainTable";

interface InputProps {
  index: number,
  initial: string,
  proxyData: ProxyData[]
}

export const DomainInput: React.FunctionComponent<InputProps> = ({ index, initial, proxyData }) => {
  const [ value, setValue ] = useState(initial);

  const onChange = (_: any, newValue: string) => {
    setValue(newValue);
    proxyData.forEach(date => {if (date.index === index) date.domain = newValue});
  }

  return (
    <TextInput
      value={value}
      type="text"
      onChange={onChange}
      aria-label="Domain Input"
    />
  )
}