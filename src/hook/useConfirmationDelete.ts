import { useState } from 'react';

type UseDeleteConfirmationHook = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  confirmDelete: () => void;
  setConfirmCallback: (callback: () => void) => void;
};

const useDeleteConfirmation = (): UseDeleteConfirmationHook => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setOnConfirm(null); // Clear the callback when the modal is closed
  };

  const confirmDelete = () => {
    if (onConfirm) {
      onConfirm(); // Call the stored callback if confirmed
      closeModal(); // Close the modal after confirming
    }
  };

  const setConfirmCallback = (callback: () => void) => {
    setOnConfirm(() => callback); // Store the callback for later use
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    confirmDelete,
    setConfirmCallback,
  };
};

export default useDeleteConfirmation;
