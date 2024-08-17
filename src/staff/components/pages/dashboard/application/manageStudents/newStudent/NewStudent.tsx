import { useState } from "react";
import { useNavigate } from "react-router";
import { button } from "../../../../../../../shared/buttons/Button";
import Modal from "../../../../../../../shared/modal/Modal";
import Success from "../modal/Success";

const NewStudent = () => {
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = async () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleBackClick = async () => {
    navigate(-1);
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Manage Application /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  New Student
                </span>
              </h1>
            </div>
            <button.PrimaryButton
              onClick={handleBackClick}
              className="gap-2 rounded-lg bg-purple-pink p-[12px] font-medium text-primary-700"
            >
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <header className="mt-[2.3em]">
          <h2 className="text-xl font-semibold">Personal Details</h2>
        </header>
        <form className="mt-[1em] w-[77%]">
          <div className="flex flex-row gap-[3em]">
            <div className="w-full">
              <label
                htmlFor="firstName"
                className="flex-start flex font-medium"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>

            <div className="w-full">
              <label htmlFor="lastName" className="flex-start flex font-medium">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-[1em] flex flex-row gap-[3em]">
            <div className="w-full">
              <label
                htmlFor="middleName"
                className="flex-start flex font-medium"
              >
                Middle Name
                <span className="ml-2 font-normal text-grey">(Optional)</span>
              </label>
              <input
                id="middleName"
                name="middleName"
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none dark:text-white"
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="flex-start flex font-medium">
                Phone Number
              </label>
              <input
                id="email"
                name="email"
                type="text"
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>
          <button.PrimaryButton
            className="m-auto mt-[5em] w-[45%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
            type="button"
            onClick={handleOpenModal}
          >
            Generate Password Link
          </button.PrimaryButton>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <Success onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default NewStudent;
