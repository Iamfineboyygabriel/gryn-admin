import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import cancel from "../../assets/svg/Cancel.svg";

interface ModalProps {
  children?: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  setModalType?: (modalType: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  isOpen,
  onClose,
  setModalType,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscapeKeyPress(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        setModalType && setModalType("");
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKeyPress, true);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress, true);
    };
  }, [isOpen, onClose, setModalType]);

  return isOpen
    ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <main
            ref={ref}
            data-aos="zoom-in"
            className={`lg:p-15 relative rounded-[1em] bg-white shadow-lg dark:bg-gray-700 dark:text-white ${className}`}
          >
            <button>
              <img
                src={cancel}
                alt="cancel"
                className="absolute right-4 top-4 w-[2em]"
                onClick={onClose}
              />
            </button>

            <div className="px-[1em] py-[1em] font-outfit">{children}</div>
          </main>
        </div>,
        document.body,
      )
    : null;
};

export default Modal;
