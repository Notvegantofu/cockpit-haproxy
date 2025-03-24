import { Tr, Td } from '@patternfly/react-table';
import React, { memo, useEffect, useState } from 'react';
import { DisableSwitch } from './DisableSwitch';
import { BackendSelect } from './BackendSelect';
import { ConfirmDeletion } from './ConfirmDeletion';
import { ConfirmApplication } from './ConfirmApplication';
import { columnNames, ProxyData, domainmap } from './DomainTable';
import { ArrowsAltVIcon, BanIcon, LongArrowAltDownIcon } from '@patternfly/react-icons';
import { Button, Icon } from '@patternfly/react-core';
import { createBackup } from './createBackup';
import cockpit from 'cockpit'

export interface RowProps {
  date: ProxyData,
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>],
  backends: string[],
  reorderingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
  selectedIndexState: [number, React.Dispatch<React.SetStateAction<number>>]
}

export const DateRow: React.FunctionComponent<RowProps> = memo(({ date, proxyDataState, backends, reorderingState: [ reordering, setReordering ], selectedIndexState: [ selectedIndex, setSelectedIndex ] }) => {
  const [ proxyData, setProxyData ] = proxyDataState;
  const tempActiveState = useState(date.active);
  const tempBackendState = useState(date.backend);
  const updater = useState(["update"])[1]

  // useEffect(() => {
  //   console.log(`Mounting ${date.domain} with index ${date.index}`);
  //   return () => console.log(`Unmounting ${date.domain} with index ${date.index}`);
  // }, [])
  // console.log(`Rendering ${date.domain} with index ${date.index}`);

  const changed = tempActiveState[0] !== date.active || tempBackendState[0] !== date.backend

  function onReorder() {
    if (reordering) {
      if (selectedIndex !== date.index) {
        setProxyData(prev => {
          const selectedDate = prev.find(curr => curr.index === selectedIndex);
          const insertAt = prev.indexOf(date)+1;
          let newArray = prev.filter(curr => curr.index !== selectedIndex);
          newArray = [...newArray.slice(0, insertAt), selectedDate!, ...newArray.slice(insertAt)]
          let output = "";
          for (const date of newArray) {
            output += `${date.active ? "" : "# "}${date.domain} ${date.backend}\n`;
          }
          createBackup()
            .then(() => cockpit.file(domainmap, {superuser: 'require'}).replace(output));
          return newArray;
        })
      }
      setSelectedIndex(prev => -1);
    } else {
      setSelectedIndex(prev => date.index);
    }
    setReordering(prev => !prev);
  }

  return (
    <Tr>
      <Td dataLabel={columnNames.reorder} textCenter><Button onClick={onReorder}>{!reordering? <ArrowsAltVIcon /> : selectedIndex === date.index ? <BanIcon /> : <LongArrowAltDownIcon />}</Button></Td>
      <Td dataLabel={columnNames.active} textCenter><DisableSwitch activeState={tempActiveState}/></Td>
      <Td dataLabel={columnNames.domain}>{date.domain}</Td>
      <Td dataLabel={columnNames.backend}><BackendSelect options={backends} backendState={tempBackendState}/></Td>
      <Td dataLabel={columnNames.remove} textCenter>{<ConfirmDeletion index={date.index} domain={date.domain} proxyDataState={proxyDataState} active={date.active}/>}</Td>
      <Td dataLabel={columnNames.apply} textCenter>{changed && <ConfirmApplication index={date.index} domain={date.domain} backend={tempBackendState[0]} active={tempActiveState[0]} proxyData={proxyData} updater={updater}/>}</Td>
    </Tr>
  )
})