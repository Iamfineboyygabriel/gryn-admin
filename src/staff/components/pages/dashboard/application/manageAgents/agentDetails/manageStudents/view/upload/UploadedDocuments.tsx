import { useState } from "react";
import { button } from "../../../../../../../../../../shared/buttons/Button";
import Modal from "../../../../../../../../../../shared/modal/Modal";
import ApplicationSummary from "../../../../../../../../../../shared/modal/applicationSummaryModal/ApplicationSummary";

const UploadedDocuments = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = async () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <main>
      <button.PrimaryButton
        className="m-auto mt-[5em] w-[18%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
        onClick={handleOpenModal}
      >
        Submit Response
      </button.PrimaryButton>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          {/* <ApplicationSummary onClose={handleCloseModal} /> */}
        </Modal>
      )}
    </main>
  );
};

export default UploadedDocuments;
