import PaymentData from "../../allPayment/PaymentData/PaymentData";
import plus from "../../../../../../../assets/svg/plus.svg";
import { useState } from "react";
import Upload from "../modal/Upload";
import { button } from "../../../../../../../shared/buttons/Button";
import Modal from "../../../../../../../shared/modal/Modal";

const AllPayment = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = async () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <main>
      <header>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">All Payments</h1>
          <button.PrimaryButton
            onClick={handleOpenModal}
            className="mt-[1em] flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white"
          >
            <img src={plus} alt="cross" />
            Upload Payments
          </button.PrimaryButton>
        </div>
      </header>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <PaymentData />
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <Upload onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default AllPayment;
