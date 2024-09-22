import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../../../../../../shared/redux/store';
import { updateStudentCreated } from '../../../../../../../../shared/redux/shared/slices/shareApplication.slices';
import { button } from "../../../../../../../../shared/buttons/Button";
import { useAppDispatch } from '../../../../../../../../shared/redux/hooks/shared/reduxHooks';
import Modal from '../../../../../../../../shared/modal/Modal';
import StudentUpdated from '../../../../../../../../shared/modal/StudentUpdated';
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';


interface StudentData {
  id: string;
  email: string;
  profile: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    gender: string | null;
    userId: string;
    designation: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

const UpdateStudent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const studentData = location.state?.studentData as StudentData;

  const [firstName, setFirstName] = useState(studentData?.profile?.firstName || '');
  const [lastName, setLastName] = useState(studentData?.profile?.lastName || '');
  const [otherName, setOtherName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!studentData) {
      navigate('/admin/dashboard/all_users');
    }
  }, [studentData, navigate]);

  const handleBackClick = () => navigate(-1);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const body = {
        firstName,
        lastName,
        // otherName,
      };
      await dispatch(updateStudentCreated({ body, userId: studentData.profile.userId })).unwrap();
      handleOpenModal();
    } catch (error: any) {
      toast.error(error || 'An error occurred while updating the student');
    } finally {
      setLoading(false);
    }
  };

  if (!studentData) {
    return null;
  }

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Manage Students /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  Update Student
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
        <form
          className="mt-[1.5em] w-[77%] dark:text-white"
          onSubmit={submitApplication}
        >
          <div className="flex flex-row gap-[3em]">
            <div className="w-full">
              <label htmlFor="firstName" className="flex-start flex font-medium">
                First Name
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                disabled={loading}
                value={firstName}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-[1em] flex flex-row gap-[3em]">
            <div className="w-full">
              <label htmlFor="middleName" className="flex-start font-medium">
                Other Name <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                id="otherName"
                name="otherName"
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:text-white"
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
                value={studentData?.email || ""}
                readOnly
                className="border-border cursor-not-allowed focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="mr-auto mt-4">
            <button.PrimaryButton
              className="m-auto mt-[3.5em] w-[45%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
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
                'Update Details'
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} data-aos="zoom-in">
          <StudentUpdated onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default UpdateStudent;