import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { ProxyData } from './DomainTable';

interface DeleteProps {
  domain: string;
  index: number;
  proxyDataState: [ProxyData[], React.Dispatch<React.SetStateAction<ProxyData[]>>]
}

export const ConfirmDeletion: React.FunctionComponent<DeleteProps> = ({ domain, index, proxyDataState: [ proxyData, setProxyData ] }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const confirmDeletion = (_: any) => {
    setProxyData(proxyData.filter(date => date.index !== index));
    handleModalToggle();
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
        Are you sure you want to delete the entry for "{domain}"? If you don't apply your changes, this will be reversed.
      </Modal>
    </React.Fragment>
  );
};
