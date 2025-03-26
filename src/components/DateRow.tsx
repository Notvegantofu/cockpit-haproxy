import { Tr, Td } from '@patternfly/react-table';
import React, { memo, useEffect, useState } from 'react';
import { DisableSwitch } from './DisableSwitch';
import { BackendSelect } from './BackendSelect';
import { columnNames, ProxyData, domainmap, devMode } from './DomainTable';
import { ArrowsAltVIcon, BanIcon, LongArrowAltDownIcon } from '@patternfly/react-icons';
import { Button, Icon } from '@patternfly/react-core';
import { createBackup } from './createBackup';
import cockpit from 'cockpit'
import { ConfirmActionModal } from 'shared/ConfirmActionModal';

export interface RowProps {
  date: ProxyData,
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>],
  backends: string[],
  reorderingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
  selectedIndexState: [number, React.Dispatch<React.SetStateAction<number>>],
  setShowApplyButton: React.Dispatch<React.SetStateAction<boolean>>
}

export const DateRow: React.FunctionComponent<RowProps> = memo(({ date, proxyDataState, backends, reorderingState: [ reordering, setReordering ], selectedIndexState: [ selectedIndex, setSelectedIndex ], setShowApplyButton }) => {
  const [ proxyData, setProxyData ] = proxyDataState;
  const tempActiveState = useState(date.active);
  const tempActive = tempActiveState[0];
  const tempBackendState = useState(date.backend);
  const tempBackend = tempBackendState[0];
  const updater = useState(["update"])[1]

  // useEffect(() => {
  //   console.log(`Mounting ${date.domain} with index ${date.index}`);
  //   return () => console.log(`Unmounting ${date.domain} with index ${date.index}`);
  // }, [])
  // console.log(`Rendering ${date.domain} with index ${date.index}`);

  const changed = tempActive !== date.active || tempBackend !== date.backend

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
        setShowApplyButton(true);
      }
      setSelectedIndex(prev => -1);
    } else {
      setSelectedIndex(prev => date.index);
    }
    setReordering(prev => !prev);
  }

  async function confirmApplication() {
  let output = "";
  let prevActive;
  for (const curr of proxyData) {
    if (curr.index === date.index) {
      prevActive = curr.active;
      curr.active = tempActive;
      curr.backend = tempBackend;
    }
    output += `${curr.active ? "" : "# "}${curr.domain} ${curr.backend}\n`;
  }
  await createBackup()
        .then(() => cockpit.file(domainmap, {superuser: 'require'}).replace(output));
  if (tempActive && prevActive) {
    if (devMode) {
      console.log(["sh", "-c", `echo "set map ${domainmap} ${date.domain} ${tempBackend}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
    } else {
      await cockpit.spawn(["sh", "-c", `echo "set map ${domainmap} ${date.domain} ${tempBackend}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
    }
  } else if (tempActive) {
    if (devMode) {
      console.log(["sh", "-c", `echo "set add ${domainmap} ${date.domain} ${tempBackend}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
    } else {
      await cockpit.spawn(["sh", "-c", `echo "set add ${domainmap} ${date.domain} ${tempBackend}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
    }
  } else if (!tempActive && prevActive) {
    if (devMode) {
      console.log(["sh", "-c", `echo "set del ${domainmap} ${date.domain}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
    } else {
      await cockpit.spawn(["sh", "-c", `echo "set del ${domainmap} ${date.domain}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
    }
  }
  updater(["update"]);
  }

  async function confirmDeletion() {
    setProxyData(prevData => prevData.filter(curr => curr.index !== date.index));
    let output = "";
    for (const curr of proxyData) {
      if (curr.index !== date.index) {
        output += `${curr.active ? "" : "# "}${curr.domain} ${curr.backend}\n`;
      }
    }
    await createBackup()
      .then(() => cockpit.file(domainmap, {superuser: 'require'}).replace(output));
    if (date.active) {
      if (devMode) {
        console.log(["sh", "-c", `echo "set del ${domainmap} ${date.domain}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
      } else {
        await cockpit.spawn(["sh", "-c", `echo "set del ${domainmap} ${date.domain}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
      }
    }
  }

  return (
    <Tr>
      <Td dataLabel={columnNames.reorder} textCenter>
        <Button onClick={onReorder}>
          {!reordering? <ArrowsAltVIcon /> : selectedIndex === date.index ? <BanIcon /> : <LongArrowAltDownIcon />}
        </Button>
      </Td>
      <Td dataLabel={columnNames.active} textCenter>
        <DisableSwitch activeState={tempActiveState}/>
      </Td>
      <Td dataLabel={columnNames.domain}>
        {date.domain}
      </Td>
      <Td dataLabel={columnNames.backend}>
        <BackendSelect
          options={backends}
          backendState={tempBackendState}
        />
      </Td>
      <Td dataLabel={columnNames.remove} textCenter>
        <ConfirmActionModal
          action={confirmDeletion}
          message={`Are you sure you want to delete the entry for "${date.domain}"? This action cannot be reversed!`}
          buttonText='Delete'
          variant='danger'
        />
      </Td>
      <Td dataLabel={columnNames.apply} textCenter>
        {changed && <ConfirmActionModal
          action={confirmApplication}
          message={`Are you sure you want to apply your changes to "${date.domain}"?`}
          buttonText='Apply'
        />}
      </Td>
    </Tr>
  )
})