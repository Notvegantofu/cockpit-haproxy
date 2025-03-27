import { HelperText, HelperTextItem, TextInput, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import React, { useEffect, useState } from 'react';
import { DisableSwitch } from './DisableSwitch';
import { BackendSelect } from './BackendSelect';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { ConfirmActionModal } from 'shared/ConfirmActionModal';
import { createBackup } from './createBackup';
import { domainmap, devMode, ProxyData } from './DomainTable';
import cockpit from 'cockpit';

interface AddProps {
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>],
  backends: string[]
}

export const AddDomain: React.FunctionComponent<AddProps> = ({ proxyDataState: [ proxyData, setProxyData ], backends}) => {
  const activeState = useState(true);
  const [ active, setActive ] = activeState;
  const backendState = useState("Select Backend");
  const [ backend, setBackend ] = backendState;
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
  }, [backend])

  const openingValidation = () => {
    if (domain === "" || backend === "Select Backend") {
      if (domain === "") setInvalidDomain(true);
      if (backend === "Select Backend") setInvalidBackend(true);
      return false;
    }
    return true;
  }

  async function confirmAdding() {
    const index = proxyData[proxyData.length-1].index + 1;
    setProxyData(proxyData => proxyData.concat({index, active, domain, backend}));
    await createBackup()
      .then(() => cockpit.file(domainmap, {superuser: 'require'}).modify(content => `${content}${active ? "" : "# "}${domain} ${backend}\n`));
    if (active) {
      if (devMode) {
        console.log(["sh", "-c", `echo "set add ${domainmap} ${domain} ${backend}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
      } else {
        await cockpit.spawn(["sh", "-c", `echo "set add ${domainmap} ${domain} ${backend}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
      }
    }
    setActive(prev => true);
    setDomain(prev => "");
    setBackend(prev => "Select Backend");
  }

  return (
    <Toolbar isSticky>
      <ToolbarContent className='no-margin'>
        <ToolbarItem className='small-width left-offset' gap={{default: "gapNone"}}>
          <DisableSwitch activeState={activeState}/>
        </ToolbarItem>
        <ToolbarItem className='big-width' gap={{default: "gapNone"}}>
          <TextInput aria-label='DomainInput' value={domain} onChange={onDomainChange} placeholder='Domain' />
          {invalidDomain &&
            <HelperText>
              <HelperTextItem icon={<ExclamationCircleIcon />} variant='error'>
                Please specify a domain
              </HelperTextItem>
            </HelperText>
          }
        </ToolbarItem>
        <ToolbarItem className='big-width' gap={{default: "gapNone"}}>
          <BackendSelect options={['Select Backend'].concat(backends)} backendState={backendState} />
          {invalidBackend &&
            <HelperText>
              <HelperTextItem icon={<ExclamationCircleIcon />} variant='error'>
                Please specify a Backend
              </HelperTextItem>
            </HelperText>
          }
        </ToolbarItem>
        <ToolbarItem className='small-width' gap={{default: "gapNone"}}>
          <ConfirmActionModal
          action={confirmAdding}
          openingValidation={openingValidation}
          message={`Are you sure you want to add ${domain}?`}
          buttonText='Add'
        />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  )
}