import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { ProxyData, domainmap, devMode } from './DomainTable';
import cockpit from 'cockpit';
import { createBackup } from './createBackup';

interface DeleteProps {
  domain: string;
  index: number;
  active: boolean;
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>]
}

export const ConfirmDeletion: React.FunctionComponent<DeleteProps> = ({ domain, index, active, proxyDataState: [ proxyData, setProxyData ] }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const confirmDeletion = async (_: any) => {
    setProxyData(prevData => prevData.filter(date => date.index !== index));
    let output = "";
    for (const date of proxyData) {
      if (date.index !== index) {
        output += `${date.active ? "" : "# "}${date.domain} ${date.backend}\n`;
      }
    }
    await createBackup()
          .then(() => cockpit.file(domainmap, {superuser: 'require'}).replace(output));
    handleModalToggle();
    if (active) {
      if (devMode) {
        console.log(["sh", "-c", `echo "set del ${domainmap} ${domain}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
      } else {
        await cockpit.spawn(["sh", "-c", `echo "set del ${domainmap} ${domain}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
      }
    }
  }

  return (
    <React.Fragment>
      <Button variant="danger" onClick={handleModalToggle}>
        Delete
      </Button>
      <Modal
        variant={ModalVariant.small}
        title="Confirm deletion"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="danger" onClick={confirmDeletion}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        Are you sure you want to delete the entry for "{domain}"? This action cannot be reversed!
      </Modal>
    </React.Fragment>
  );
};
