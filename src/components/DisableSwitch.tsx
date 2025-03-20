import React, { useState } from "react";
import { Switch } from '@patternfly/react-core';
import { ProxyData } from "./DomainTable";

interface SwitchProps {
  index: number;
  active: boolean;
  proxyData: ProxyData[]
}

export const DisableSwitch: React.FunctionComponent<SwitchProps> = ({index, active, proxyData }) => {
  const [isChecked, setIsChecked] = useState(active);

  const handleChange = (_: any, checked: boolean) => {
    setIsChecked(checked);
    proxyData.forEach(date => {if (date.index === index) date.active = !date.active});
  };

  return <Switch aria-label='switch' isChecked={isChecked} onChange={handleChange} />;
}