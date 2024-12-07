import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  previewUrl: string | null;
  previewFileType: string;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onRequestClose,
  previewUrl,
  previewFileType,
}) => {
  const renderPreviewContent = () => {
    if (!previewUrl) return null;

    switch (previewFileType) {
      case "application/pdf":
        return (
          <iframe
            src={`${previewUrl}#toolbar=0&navpanes=0&view=fitH`}
            title="PDF Preview"
            width="100%"
            height="100%"
            className="border-none"
          />
        );
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return (
          <img
            src={previewUrl}
            alt="Document Preview"
            className="h-full w-full object-contain"
          />
        );
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return (
          <div className="flex h-full w-full items-center justify-center">
            <p>
              Preview not available for Word documents
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download file
              </a>
            </p>
          </div>
        );
      default:
        return (
          <div className="flex h-full w-full items-center justify-center">
            <p>
              Preview not available for this file type.
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download file
              </a>
            </p>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Document Preview"
      className="absolute left-1/2 top-1/2 flex h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 transform flex-col justify-center rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      ariaHideApp={false}
      role="dialog"
      aria-label="Document Preview Modal"
    >
      <div className="flex h-full flex-col">
        <div className="flex-grow overflow-auto">{renderPreviewContent()}</div>
        <button
          onClick={onRequestClose}
          className="mt-4 flex items-center gap-2 self-center rounded-lg bg-gray-200 px-4 py-2"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default DocumentPreviewModal;
