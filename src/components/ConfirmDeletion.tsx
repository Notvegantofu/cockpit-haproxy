import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

interface DeleteProps {
  removeProxyData: (index: number) => void;
  domain: string;
  index: number;
}

export const ConfirmDeletion: React.FunctionComponent<DeleteProps> = ({ removeProxyData, domain, index }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  const confirmDeletion = (_event: KeyboardEvent | React.MouseEvent) => {
    removeProxyData(index);
    handleModalToggle(_event);
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
