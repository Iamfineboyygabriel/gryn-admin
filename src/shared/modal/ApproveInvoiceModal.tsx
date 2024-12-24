import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import inv from "../../assets/png/inv.png";

interface ModalProps {
  children?: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  setModalType?: (modalType: string) => void;
}

const ApproveInvoiceModal: React.FC<ModalProps> = ({
  children,
  className,
  isOpen,
  onClose,
  setModalType,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscapeKeyPress(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        setModalType && setModalType("");
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
        setModalType && setModalType("");
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKeyPress, true);
      document.addEventListener("mousedown", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress, true);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isOpen, onClose, setModalType]);

  return isOpen
    ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <main
            ref={modalRef}
            data-aos="zoom-in"
            className={`relative rounded-[1em] bg-white shadow-lg dark:bg-gray-700 dark:text-white ${className}`}
          >
            <div className="flex flex-col items-center p-6">
              <img src={inv} alt="Invoice" className="w-full h-[22em]" />

              <div className="px-[1em] py-[1em] font-outfit">{children}</div>
            </div>
          </main>
        </div>,
        document.body,
      )
    : null;
};

export default ApproveInvoiceModal;
