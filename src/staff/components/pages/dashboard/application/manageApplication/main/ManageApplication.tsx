import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import AllApplication from "../allApplication/AllApplication";
import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "../../../../../../../shared/modal/Modal";
import ApplicationDetails from "../update/modal/ApplicationDetails";
import DirectApplication from "../../../../../../../shared/modal/DirectApplication";
import FindStudentByAll from "../../../../../../../admin/components/pages/dashboard/application/modal/FindStudentByAll";

const ManageApplication = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFindByModalOpen, setIsFindByModalOpen] = useState(false);


  const handleOpenModal = async () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleFindByAllOpen = async () => setIsFindByModalOpen(true);
  const handleFindByAllClose = () => setIsFindByModalOpen(false);

  return (
    <main className="font-outfit">
      <header className="flex items-center justify-between">
        <h1 className="font-medium text-xl">All Application</h1>
        <div className="flex gap-2">
          <button.PrimaryButton
            onClick={handleOpenModal}
            className="mt-[1em] flex gap-2 rounded-full bg-approve px-[1.5em] py-[8px] font-medium text-white"
          >
            <img src={plus} alt="plus" />
            Direct Application
          </button.PrimaryButton>
          <Link to="">
            <button.PrimaryButton onClick={handleFindByAllOpen} className="mt-[1em] flex gap-2 rounded-full bg-pink-primary  px-[1.5em] py-[8px] font-medium text-white">
              <img src={plus} alt="plus" />
              Update Application
            </button.PrimaryButton>
          </Link>
          <Link to="/staff/dashboard/application/manage_application/new_application">
          <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white">
            <img src={plus} alt="plus" />
            New Application
          </button.PrimaryButton>
          </Link>
        </div>
      </header>
      <AllApplication />
      {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            data-aos="zoom-in"
          >
            <DirectApplication/>
          </Modal>
        )}
         {isFindByModalOpen && (
          <Modal
            isOpen={isFindByModalOpen}
            onClose={handleFindByAllClose}
            data-aos="zoom-in"
          >
            <FindStudentByAll redirectTo="/staff/dashboard/application/manage_application/update_application"/>
          </Modal>
        )}
    </main>
  );
};

export default ManageApplication;
