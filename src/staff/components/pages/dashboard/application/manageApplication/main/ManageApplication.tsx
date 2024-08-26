import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import AllApplication from "../allApplication/AllApplication";
import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "../../../../../../../shared/modal/Modal";
import ApplicationDetails from "../update/modal/ApplicationDetails";

const ManageApplication = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = async () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <main className="font-outfit">
      <header className="flex items-center justify-between">
        <h1 className="font-medium text-xl">All Application</h1>
        <div className="flex gap-2">
          <button.PrimaryButton
            onClick={handleOpenModal}
            className="mt-[1em] flex gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white"
          >
            <img src={plus} alt="plus" />
            Update Application
          </button.PrimaryButton>
          <Link to="/staff/dashboard/application/manage_application/new_application">
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="plus" />
              New Application
            </button.PrimaryButton>
          </Link>
          <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
            <img src={plus} alt="plus" />
            Direct Application
          </button.PrimaryButton>
        </div>
      </header>
      <AllApplication />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <ApplicationDetails onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default ManageApplication;
