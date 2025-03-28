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