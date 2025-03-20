import React, { useEffect, useState } from "react";
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { SearchInput, Toolbar, ToolbarItem, ToolbarContent } from '@patternfly/react-core'
import { ConfirmDeletion } from './ConfirmDeletion';
import { LoadingData } from "./LoadingData";
import { MissingData } from "./MissingData";
import { DisableSwitch } from "./DisableSwitch";
import { ConfirmApplication } from "./ConfirmApplication";
import { BackendSelect } from "./BackendSelect";
import { DomainInput } from "./DomainInput";


import cockpit from "cockpit";


const config = '/home/tobias/cockpit-haproxy/src/haproxy.cfg';
export const domainmap = '/home/tobias/cockpit-haproxy/src/domain.map';

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
  const [activeSortIndex, setActiveSortIndex] = useState(0);
  const [activeSortDirection, setActiveSortDirection] = useState<'asc'|'desc'>('asc');
  const filteredProxyData = proxyData.filter(onFilter);

  useEffect(() => {
    cockpit.file(config).read().then(content => updateBackends(content || ""))
    const handle = cockpit.file(domainmap).watch(content => updateProxyData(content || ""));

    return () => handle.remove();
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

  function onFilter(row: ProxyData) {
    if (searchValue === '') {
      return true;
    }

    let input: RegExp;
    try {
      input = new RegExp(searchValue, 'i');
    } catch (err) {
      input = new RegExp(searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }
    return row.domain.search(input) >= 0 || row.backend.search(input) >= 0;
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
      defaultDirection: 'asc'
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction);
    },
    columnIndex
  });

  const columnNames = {
    active: 'Active?',
    domain: 'Domain ends with',
    backend: 'Backend',
    remove: 'Remove'
  };
  
  const getSortableRowValues = (data: ProxyData): (string | boolean)[] => {
    const { domain, backend } = data;
    return [domain, backend ];
  };

  
  let sortedData = filteredProxyData.sort((a, b) => {
    const aValue = getSortableRowValues(a)[activeSortIndex];
    const bValue = getSortableRowValues(b)[activeSortIndex];
    if (activeSortDirection === 'asc') {
      return (aValue as string).localeCompare(bValue as string);
    }
    return (bValue as string).localeCompare(aValue as string);
  });

  const DataRows: React.FunctionComponent = () => {
    return (
      <>
        {!ready? <LoadingData/> :
        filteredProxyData.length === 0 ? <MissingData/> : filteredProxyData.map((date) => (
          <Tr key={date.domain}>
              <Td dataLabel={columnNames.active}><DisableSwitch index={date.index} active={date.active} proxyData={proxyData}/></Td>
              <Td dataLabel={columnNames.domain}><DomainInput index={date.index} initial={date.domain} proxyData={proxyData}/></Td>
              <Td dataLabel={columnNames.backend}><BackendSelect options={backends} initial={date.backend} index={date.index} proxyData={proxyData}/></Td>
              <Td dataLabel={columnNames.remove}>{<ConfirmDeletion index={date.index} domain={date.domain} proxyDataState={[proxyData, setProxyData]}/>}</Td>
          </Tr>
        ))}
      </>)
  }

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
          <ToolbarItem>
            <ConfirmApplication proxyData={proxyData}/>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table
      aria-label="HAProxy table"
      variant='compact'
      >
      <Thead>
        <Tr>
          <Th>{columnNames.active}</Th>
          <Th sort={getSortParams(0) || {sortBy:{}, columnIndex:0}}>{columnNames.domain}</Th>
          <Th sort={getSortParams(1) || {sortBy:{}, columnIndex:1}}>{columnNames.backend}</Th>
          <Th screenReaderText='Delete Column'></Th>
        </Tr>
      </Thead>
        <Tbody>
          <DataRows/>
        </Tbody>
      </Table>
    </>
  )
}