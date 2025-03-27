import React, { useEffect, useState } from "react";
import { StandardTable, HeaderValue } from 'shared/StandardTable'
import { DateRow } from "./DateRow";

import cockpit from "cockpit";
import { ApplyReordering } from "./ApplyReordering";
import { AddDomain } from "./AddDomain";


const config = '/etc/haproxy/haproxy.cfg';
export const mapLocation = '/etc/haproxy/maps'
export const domainmap = `${mapLocation}/hosts.map`;
export const devMode = true;

export const columnNames = {
  reorder: 'Reorder',
  active: 'Active?',
  domain: 'Domain',
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
  const [ ready, setReady ] = useState(false);
  const [ showApplyButton, setShowApplyButton ] = useState(false);
  const reorderingState = useState(false);
  const selectedIndexState = useState(-1);
  const rows = proxyData.map((date) => {return {
    row: <DateRow date={date} proxyDataState={[proxyData, setProxyData]} backends={backends} key={date.index} reorderingState={reorderingState} selectedIndexState={selectedIndexState} setShowApplyButton={setShowApplyButton}/>,
    values: ["", "", date.domain, date.backend, "", ""]
    }
  })

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
  
  const headerValues: HeaderValue[] = [
    {text: columnNames.reorder, width: 10},
    {text: columnNames.active, width: 10},
    {text: columnNames.domain, width: 30, filtrable: true},
    {text: columnNames.backend, width: 30, filtrable: true},
    {screenReaderText: 'Delete', width: 10},
    {screenReaderText: 'Apply', width: 10}
  ]

  return (
    <StandardTable
    headerValues={headerValues}
    rows={rows}
    ready={ready}
    additonalToolbarItems={showApplyButton ? [<ApplyReordering setShowButton={setShowApplyButton}/>] : []}
    secondaryToolbar={<AddDomain proxyDataState={[proxyData, setProxyData]} backends={backends}/>}
    />
  )
}