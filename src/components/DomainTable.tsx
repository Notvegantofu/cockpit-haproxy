import React, { useEffect, useState } from "react";
import { Table, Thead, Tr, Th, Tbody } from '@patternfly/react-table';
import { SearchInput, Toolbar, ToolbarItem, ToolbarContent } from '@patternfly/react-core'
import { LoadingData } from "./LoadingData";
import { MissingData } from "./MissingData";
import { DateRow } from "./DateRow";
import { AddDomain } from './AddDomain'

import cockpit from "cockpit";


const config = '/etc/haproxy/haproxy.cfg';
export const mapLocation = '/etc/haproxy/maps'
export const domainmap = `${mapLocation}/hosts.map`;
export const devMode = true;

export const columnNames = {
  active: 'Active?',
  domain: 'Domain ends with',
  backend: 'Backend',
  remove: 'Remove',
  apply: 'Apply'
};

export interface ProxyData {
  domain: string;
  backend: string;
  active: boolean;
  index: number;
}

export const DomainTable = () => {
  const [ backends, setBackends ] = useState<string[]>([]);
  const [ proxyData, setProxyData ] = useState<ProxyData[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [ready, setReady] = useState(false);
  const rows = proxyData.map((date) => <DateRow date={date} proxyDataState={[proxyData, setProxyData]} backends={backends} key={date.index}/>)
  const filteredRows = rows.filter(onFilter);

  useEffect(() => {
    cockpit.file(config, {superuser: 'require'}).read().then(content => updateBackends(content || ""))
    cockpit.file(domainmap, {superuser: 'require'}).read().then(content => updateProxyData(content || ""));
  }, [])

  async function updateBackends(content: string) {
    const newBackends = content.split("\n")
      .filter(line => line.startsWith('backend'))
      .map(line => line.split(/\s/)[1]);
    setBackends(newBackends);
  }

  async function updateProxyData(content: string) {
    const newProxyData: ProxyData[] = []
    let i = 0;
    for (let line of content.split("\n").map(line => line.trim())) {
      let active = true;
      const index = i++;
      if (!line) {
        continue;
      } else if (line.startsWith('#')) {
        line = line.substring(1).trim();
        active = false;
      }
      const [ domain, backend ] = line.split(/\s+/);
      newProxyData.push({domain, backend, active, index});
    }
    setProxyData(newProxyData)
    setReady(true)
  }

  function onSearchChange(value: string) {
    setSearchValue(value);
  };

  function onFilter(row: React.JSX.Element) {
    if (searchValue === '') {
      return true;
    }

    let input: RegExp;
    try {
      input = new RegExp(searchValue, 'i');
    } catch (err) {
      input = new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }
    return row.props.date.domain.search(input) >= 0 || row.props.date.backend.search(input) >= 0;
  };

  return (
    <>
      <Toolbar isSticky>
        <ToolbarContent>
          <ToolbarItem className="expand">
            <SearchInput
              placeholder="Filter by domain or backend"
              value={searchValue}
              onChange={(_event, value) => onSearchChange(value)}
              onClear={() => onSearchChange('')}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table
      aria-label="HAProxy table"
      variant='compact'
      >
        <Thead>
          <Tr>
            <Th width={10} textCenter>{columnNames.active}</Th>
            <Th width={35}>{columnNames.domain}</Th>
            <Th width={35}>{columnNames.backend}</Th>
            <Th width={10} screenReaderText='Delete Column' textCenter/>
            <Th width={10} screenReaderText="Apply Column" textCenter/>
          </Tr>
        </Thead>
        <Tbody>
          <AddDomain proxyDataState={[proxyData, setProxyData]} backends={backends}/>
          {!ready? <LoadingData/> : filteredRows.length === 0 ? <MissingData/> : filteredRows}
        </Tbody>
      </Table>
    </>
  )
}