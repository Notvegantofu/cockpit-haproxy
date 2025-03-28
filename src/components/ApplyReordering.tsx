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

import React from "react";
import { Button } from "@patternfly/react-core";
import { devMode } from "./DomainTable";
import cockpit from 'cockpit';

interface ReorderProps {
  setShowButton: React.Dispatch<React.SetStateAction<boolean>>;
}


export const ApplyReordering: React.FunctionComponent<ReorderProps> = ({ setShowButton }) => {

  function onClick() {
    if (devMode) {
      console.log('sudo systemctl reload haproxy');
    } else {
    cockpit.spawn(['sudo', 'systemctl', 'reload', 'haproxy'], {superuser: 'require'});
    }
    setShowButton(false);
  }

  return (
    <Button onClick={onClick}>Apply Order</Button>
  )
}