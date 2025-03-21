import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { ProxyData, domainmap, devMode } from './DomainTable';
import cockpit from 'cockpit';
import { createBackup } from './createBackup';
import { treeRow } from '@patternfly/react-table';

interface AddProps {
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>],
  domainState: [string, React.Dispatch<React.SetStateAction<string>>],
  activeState: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
  backendState: [string, React.Dispatch<React.SetStateAction<string>>],
  setInvalidDomain: React.Dispatch<React.SetStateAction<boolean>>,
  setInvalidBackend: React.Dispatch<React.SetStateAction<boolean>>
}

export const ConfirmAdding: React.FunctionComponent<AddProps> = ({ proxyDataState: [proxyData, setProxyData], domainState: [domain, setDomain], activeState: [active, setActive], backendState: [backend, setBackend], setInvalidDomain, setInvalidBackend }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openModal = () => {
    if (domain === "" || backend === "Select Backend") {
      if (domain === "") setInvalidDomain(true);
      if (backend === "Select Backend") setInvalidBackend(true);
      return;
    }
    handleModalToggle();
  }

  const confirmAdding = async (_: any) => {
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
    handleModalToggle();
  }

  return (
    <React.Fragment>
      <Button variant="primary" onClick={openModal}>
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