import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { ProxyData, domainmap, devMode } from './DomainTable';
import cockpit from 'cockpit';

interface ApplyProps {
  proxyData: ProxyData[],
  index: number,
  domain: string,
  active: boolean,
  backend: string
  updater: React.Dispatch<React.SetStateAction<string[]>>
}

export const ConfirmApplication: React.FunctionComponent<ApplyProps> = ({ proxyData, index, domain, active, backend, updater }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const confirmApplication = async (_: any) => {
    let output = "";
    let prevActive;
    for (const date of proxyData) {
      if (date.index === index) {
        prevActive = date.active;
        date.active = active;
        date.backend = backend;
      }
      output += `${date.active ? "" : "# "}${date.domain} ${date.backend}\n`;
    }
    await cockpit.file(domainmap).replace(output);
    if (active && prevActive) {
      if (devMode) {
        console.log(["sh", "-c", `echo "set map ${domainmap} ${domain} ${backend}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
      } else {
        await cockpit.spawn(["sh", "-c", `echo "set map ${domainmap} ${domain} ${backend}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
      }
    } else if (active) {
      if (devMode) {
        console.log(["sh", "-c", `echo "set add ${domainmap} ${domain} ${backend}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
      } else {
        await cockpit.spawn(["sh", "-c", `echo "set add ${domainmap} ${domain} ${backend}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
      }
    } else {
      if (devMode) {
        console.log(["sh", "-c", `echo "set del ${domainmap} ${domain}" | sudo socat stdio /run/haproy/admin.sock`].reduce((prev, curr) => `${prev} ${curr}`));
      } else {
        await cockpit.spawn(["sh", "-c", `echo "set del ${domainmap} ${domain}" | sudo socat stdio /run/haproy/admin.sock`], {superuser: 'require'});
      }
    }
    handleModalToggle();
    updater(["update"]);
  }

  return (
    <React.Fragment>
      <Button variant="primary" onClick={handleModalToggle}>
        Apply
      </Button>
      <Modal
        variant={ModalVariant.small}
        title="Confirm application"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={confirmApplication}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        Are you sure you want to apply your changes to "{domain}"? This action cannot be reversed!
      </Modal>
    </React.Fragment>
  );
};