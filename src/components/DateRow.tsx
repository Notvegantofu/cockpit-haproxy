import { Tr, Td } from '@patternfly/react-table';
import React, { memo, useEffect, useState } from 'react';
import { DisableSwitch } from './DisableSwitch';
import { BackendSelect } from './BackendSelect';
import { ConfirmDeletion } from './ConfirmDeletion';
import { ConfirmApplication } from './ConfirmApplication';
import { columnNames, ProxyData } from './DomainTable';

export interface RowProps {
  date: ProxyData,
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>],
  backends: string[]
}

export const DateRow: React.FunctionComponent<RowProps> = memo(({ date, proxyDataState, backends}) => {
  const tempActiveState = useState(date.active);
  const tempBackendState = useState(date.backend);
  const updater = useState(["update"])[1]

  // useEffect(() => {
  //   console.log(`Mounting ${date.domain} with index ${date.index}`);
  //   return () => console.log(`Unmounting ${date.domain} with index ${date.index}`);
  // }, [])
  // console.log(`Rendering ${date.domain} with index ${date.index}`);

  const changed = tempActiveState[0] !== date.active || tempBackendState[0] !== date.backend

  return (
    <Tr>
      <Td dataLabel={columnNames.active} textCenter><DisableSwitch activeState={tempActiveState}/></Td>
      <Td dataLabel={columnNames.domain}>{date.domain}</Td>
      <Td dataLabel={columnNames.backend}><BackendSelect options={backends} backendState={tempBackendState}/></Td>
      <Td dataLabel={columnNames.remove} textCenter>{<ConfirmDeletion index={date.index} domain={date.domain} proxyDataState={proxyDataState} active={date.active}/>}</Td>
      <Td dataLabel={columnNames.apply} textCenter>{changed && <ConfirmApplication index={date.index} domain={date.domain} backend={tempBackendState[0]} active={tempActiveState[0]} proxyData={proxyDataState[0]} updater={updater}/>}</Td>
    </Tr>
  )
})