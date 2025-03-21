import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { ProxyData, domainmap, devMode } from './DomainTable';
import cockpit from 'cockpit';

interface AddProps {
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>],
  domainState: [string, React.Dispatch<React.SetStateAction<string>>],
  activeState: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
  backendState: [string, React.Dispatch<React.SetStateAction<string>>],
  backends: string[]
}

export const ConfirmAdding: React.FunctionComponent<AddProps> = ({ proxyDataState: [proxyData, setProxyData], domainState: [domain, setDomain], activeState: [active, setActive], backendState: [backend, setBackend], backends }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const confirmAdding = async (_: any) => {
    const index = proxyData[proxyData.length-1].index + 1;
    setProxyData(proxyData => proxyData.concat({index, active, domain, backend}));
    await cockpit.file(domainmap, {superuser: 'require'}).modify(content => `${content}${active ? "" : "# "}${domain} ${backend}\n`);
    if (active) {
      if (devMode) {
        console.log(["sh", "-c", `echo "set add ${domainmap} ${domain} ${backend}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
      } else {
        await cockpit.spawn(["sh", "-c", `echo "set add ${domainmap} ${domain} ${backend}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
      }
    }
    setActive(prev => true);
    setDomain(prev => "");
    setBackend(prev => backends[0]);
    handleModalToggle();
  }

  return (
    <React.Fragment>
      <Button variant="primary" onClick={handleModalToggle}>
        Add
      </Button>
      <Modal
        variant={ModalVariant.small}
        title="Confirm application"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={confirmAdding}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        Are you sure you want to add "{domain}"?
      </Modal>
    </React.Fragment>
  );
};