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

import cockpit from 'cockpit';
import { mapLocation, domainmap } from './DomainTable'

export async function createBackup() {
  const timestamp = new Date().toISOString().slice(0, 19);
  const backUpFile = `${mapLocation}/${timestamp}-hosts.map.bak`
  return cockpit.spawn(['cp', domainmap, backUpFile], {superuser: 'require'})
    .then(() => cockpit.spawn(['ls', '-1', mapLocation]))
    .then(output => output.split('\n').filter(line => line.includes('hosts.map.bak')).sort())
    .then(lines => {
      const oldest = [];
      while (lines.length > 10) {
        oldest.push(`${mapLocation}/${lines.shift()}`);
      }
      return oldest;
    })
    .then(oldest => cockpit.spawn(['rm', '-f'].concat(oldest), {superuser: 'require'}));
}