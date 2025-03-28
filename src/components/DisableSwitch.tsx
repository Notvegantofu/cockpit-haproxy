/*
 * This file is part of Cockpit-Haproxy.
 *
 * Copyright (C) 2025 Tobias Vale
 *
 * Cockpit-Haproxy is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit-Haproxy is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit-Haproxy; If not, see <http://www.gnu.org/licenses/>.
 */

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