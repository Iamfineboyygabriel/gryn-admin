import React from "react";
import Modal from "react-modal";
import "./modal.css"; 

interface ConfirmDiscardProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: () => void;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmDiscard: React.FC<ConfirmDiscardProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title = "Are you sure?",
  confirmLabel = "Yes",
  cancelLabel = "No",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Dialog"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-[5em] shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      ariaHideApp={false}
    >
      <div className="flex flex-col items-center">
        <h2 className="mb-7 text-lg font-semibold">{title}</h2>
        <div className="flex gap-[4em]">
          <button onClick={onConfirm} className="btn-yes">
            {confirmLabel}
          </button>
          <button onClick={onRequestClose} className="btn-no">
            {cancelLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDiscard;
