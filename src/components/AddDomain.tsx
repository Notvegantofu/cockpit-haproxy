import { TextInput, Button, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import React, { useEffect, useState } from 'react';
import { ProxyData } from './DomainTable';
import { DisableSwitch } from './DisableSwitch';
import { BackendSelect } from './BackendSelect';
import { Td, Tr } from '@patternfly/react-table';
import { ConfirmAdding } from './ConfirmAdding';

interface AddProps {
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>],
  backends: string[]
}

export const AddDomain: React.FunctionComponent<AddProps> = ({ proxyDataState, backends}) => {
  const activeState = useState(true);
  const backendState = useState("");
  const [ domain, setDomain ] = useState("");
  function onDomainChange(_: any, newValue: string) {
    setDomain(newValue)
  }

  useEffect(() => backendState[1](backends[0]), [backends[0]]); //necessary due to delay in backends content

  return (
    <Tr className='sticky-row'>
      <Td textCenter>
        <DisableSwitch activeState={activeState}/>
      </Td>
      <Td>
        <TextInput aria-label='DomainInput' value={domain} onChange={onDomainChange} />
      </Td>
      <Td>
        <BackendSelect options={backends} backendState={backendState}/>
      </Td>
      <Td textCenter>
        <ConfirmAdding proxyDataState={proxyDataState} domainState={[domain, setDomain]} activeState={activeState} backendState={backendState} backends={backends} />
      </Td>
      <Td />
  </Tr>
  )
}