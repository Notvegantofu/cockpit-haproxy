import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

interface DeleteProps {
  applyChanges: () => void;
}

export const ConfirmApplication: React.FunctionComponent<DeleteProps> = ({ applyChanges }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleModalToggle = (_event: KeyboardEvent | React.MouseEvent) => {
    setIsModalOpen(!isModalOpen);
  };

  const confirmApplication = (_event: KeyboardEvent | React.MouseEvent) => {
    applyChanges();
    handleModalToggle(_event);
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