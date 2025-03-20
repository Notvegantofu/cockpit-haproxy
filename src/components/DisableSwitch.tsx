import React, { useState } from "react";
import { Switch } from '@patternfly/react-core';

interface SwitchProps {
  activeState: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
}

export const DisableSwitch: React.FunctionComponent<SwitchProps> = ({activeState: [active, setActive] }) => {

  const handleChange = (_: any, checked: boolean) => {
    setActive(checked);
  };

  return <Switch aria-label='switch' isChecked={active} onChange={handleChange} />;
}