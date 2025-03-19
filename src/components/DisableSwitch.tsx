import React, { useState } from "react";
import { Switch } from '@patternfly/react-core';

interface SwitchProps {
  disableDomain: (index: number) => void;
  index: number;
  active: boolean;
}

export const DisableSwitch: React.FunctionComponent<SwitchProps> = ({ disableDomain, index, active }) => {
  const [isChecked, setIsChecked] = useState(active);

  const handleChange = (_: any, checked: boolean) => {
    setIsChecked(checked);
    disableDomain(index);
  };

  return <Switch aria-label='switch' isChecked={isChecked} onChange={handleChange} />;
}