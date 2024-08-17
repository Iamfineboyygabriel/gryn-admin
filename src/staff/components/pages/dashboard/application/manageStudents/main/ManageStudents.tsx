import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import AllStudents from "../allStudents/AllStudents";
import { useState } from "react";
import Modal from "../../../../../../../shared/modal/Modal";
import StudentEmail from "../modal/StudentEmail";
import { Link } from "react-router-dom";

const ManageStudents = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = async () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <main className="font-outfit">
      <header className="flex justify-between">
        <h1 className="font-medium text-lg">All Students</h1>
        <div className="flex gap-2">
          <button.PrimaryButton
            onClick={handleOpenModal}
            className="mt-[1em] flex gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white"
          >
            <img src={plus} alt="plus" />
            Update Student
          </button.PrimaryButton>
          <Link to="/staff/dashboard/application/manage_student/new_student">
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="plus" />
              New Student
            </button.PrimaryButton>
          </Link>
        </div>
      </header>
      <AllStudents />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <StudentEmail onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default ManageStudents;
