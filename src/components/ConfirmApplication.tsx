import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { ProxyData, domainmap } from './DomainTable';
import cockpit from 'cockpit';

interface DeleteProps {
  proxyData: ProxyData[]
}

export const ConfirmApplication: React.FunctionComponent<DeleteProps> = ({ proxyData }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const confirmApplication = (_: any) => {
    let output = "";
    for (const date of proxyData) {
      output += `${((date.active ? "" : "# ") + date.domain).padEnd(30, " ")} ${date.backend}\n`;
    }
    cockpit.file(domainmap).replace(output);
    handleModalToggle();
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
        Are you sure you want to apply your changes? This action cannot be reversed!
      </Modal>
    </React.Fragment>
  );
};