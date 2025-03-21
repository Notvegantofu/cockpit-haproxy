import { HelperText, HelperTextItem, TextInput } from '@patternfly/react-core';
import React, { useEffect, useState } from 'react';
import { ProxyData } from './DomainTable';
import { DisableSwitch } from './DisableSwitch';
import { BackendSelect } from './BackendSelect';
import { Td, Tr } from '@patternfly/react-table';
import { ConfirmAdding } from './ConfirmAdding';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

interface AddProps {
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>],
  backends: string[]
}

export const AddDomain: React.FunctionComponent<AddProps> = ({ proxyDataState, backends}) => {
  const activeState = useState(true);
  const backendState = useState("Select Backend");
  const [ domain, setDomain ] = useState("");
  const [ invalidDomain, setInvalidDomain ] = useState(false);
  const [ invalidBackend, setInvalidBackend ] = useState(false);

  function onDomainChange(_: any, newValue: string) {
    setDomain(newValue)
  }

  useEffect(() => {
    setInvalidDomain(false)
  }, [domain])

  useEffect(() => {
    setInvalidBackend(false)
  }, [backendState[0]])

  return (
    <Tr className='sticky-row'>
      <Td textCenter>
        <DisableSwitch activeState={activeState}/>
      </Td>
      <Td>
        <TextInput aria-label='DomainInput' value={domain} onChange={onDomainChange} />
        {invalidDomain &&
          <HelperText>
            <HelperTextItem icon={<ExclamationCircleIcon />} variant='error'>
              Please specify a domain
            </HelperTextItem>
          </HelperText>
        }
      </Td>
      <Td>
        <BackendSelect options={['Select Backend'].concat(backends)} backendState={backendState} />
        {invalidBackend &&
          <HelperText>
            <HelperTextItem icon={<ExclamationCircleIcon />} variant='error'>
              Please specify a Backend
            </HelperTextItem>
          </HelperText>
        }
      </Td>
      <Td textCenter>
        <ConfirmAdding proxyDataState={proxyDataState} domainState={[domain, setDomain]} activeState={activeState} backendState={backendState} setInvalidDomain={setInvalidDomain} setInvalidBackend={setInvalidBackend} />
      </Td>
      <Td />
  </Tr>
  )
}