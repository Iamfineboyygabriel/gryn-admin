import { useState } from "react";
import Upload from "../payment/modal/Upload";
import { button } from "../../../../../shared/buttons/Button";
import Modal from "../../../../../shared/modal/Modal";
import { FiSearch } from "react-icons/fi";
import plus from "../../../../../assets/svg/plus.svg";

const Sort = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = async () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <main className="mt-[1em]">
      <div className="flex justify-between">
        <div className="flex items-center gap-[1em]">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
              placeholder="search"
            />
            <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
          </div>
        </div>
        <button.PrimaryButton
          onClick={handleOpenModal}
          className="mt-[1em] flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white"
        >
          <img src={plus} alt="cross" />
          Upload Payments
        </button.PrimaryButton>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <Upload onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default Sort;
