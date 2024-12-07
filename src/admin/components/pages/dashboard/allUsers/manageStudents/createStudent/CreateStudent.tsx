import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import { createStudent } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
import Modal from "../../../../../../../shared/modal/Modal";
import StudentCreated from "../../../../../../../shared/modal/StudentCreated";
import { button } from "../../../../../../../shared/buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";

const CreateStudent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const dispatch: AppDispatch = useAppDispatch();

  const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const body = {
        firstName,
        lastName,
        middleName,
        email,
      };
      await dispatch(createStudent(body)).unwrap();
      handleOpenModal();
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while creating the application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Manage Students /
                <span className="ml-1 font-medium text-primary-700">
                  New Students
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <header>
          <h1 className="text-2xl mt-[1.5em] font-bold">Personal Details</h1>
        </header>
        <form className="mt-[1.5em] w-[77%]" onSubmit={submitApplication}>
          <div className="flex flex-col lg:flex-row gap-[3em]">
            <div className="w-full">
              <label
                htmlFor="firstName"
                className="flex-start flex font-medium"
              >
                First Name
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                disabled={loading}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label htmlFor="lastName" className="flex-start flex font-medium">
                Last Name
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                disabled={loading}
                onChange={(e) => setLastName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-[1em] flex flex-col lg:flex-row gap-[3em]">
            <div className="w-full">
              <label htmlFor="middleName" className="flex-start font-medium">
                Other Name <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                id="otherName"
                name="otherName"
                onChange={(e) => setMiddleName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="flex-start flex font-medium">
                Email Address
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="mr-auto mt-4">
            <button.PrimaryButton
              className="m-auto mt-[3.5em] w-[50%] lg:w-[40%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <ReactLoading
                  color="#FFFFFF"
                  width={25}
                  height={25}
                  type="spin"
                />
              ) : (
                "Generate Password Link"
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <StudentCreated email={email} onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default CreateStudent;
