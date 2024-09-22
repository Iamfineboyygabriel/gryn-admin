import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { button } from '../../../../../../shared/buttons/Button';
import { CgAsterisk } from 'react-icons/cg';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import Modal from '../../../../../../shared/modal/Modal';
import AddNewSchoolM from '../../../../../../shared/modal/AddNewSchoolM';
import { useAppDispatch } from '../../../../../../shared/redux/hooks/shared/reduxHooks';
import { AppDispatch } from '../../../../../../shared/redux/store';
import { addNewSchool } from '../../../../../../shared/redux/admin/slices/application.slices';

const AddNewSchool = () => {
  const [country, setCountry] = useState('');
  const [university, setUniversity] = useState('');
  const [otherName, setOtherName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };

 

//   const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       const body = {
//         country,
//         university,
//         otherName,
//         email,
//       };
//       await dispatch(addNewSchool(body)).unwrap();
//       handleOpenModal();
//     } catch (error: any) {
//         console.log("error",error)
//       toast.error(
//         error.message || 'An error occurred while creating the application'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                All Application /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  Add New School
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <header>
          <h1 className="text-2xl mt-[1.5em] font-medium">School Details</h1>
          </header>
        <form
          className="mt-[1.5em] w-[77%] dark:text-white"
        >
          <div className="flex flex-row gap-[3em]">
            <div className="w-full">
              <label
                htmlFor="country"
                className="flex-start flex font-medium"
              >
                Country
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="country"
                name="country"
                required
                disabled={loading}
                onChange={(e) => setCountry(e.target.value)}
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
                onChange={(e) => setUniversity(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-[1em] flex flex-row gap-[3em]">
            <div className="w-full">
              <label htmlFor="email" className="flex-start flex font-medium">
                Link
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="otherName"
                name="otherName"
                onChange={(e) => setOtherName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:text-white"
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="flex-start flex font-medium">
                Link
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="link"
                name="link"
                type="link"
                required
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="mr-auto mt-4">
            <button.PrimaryButton
              className="m-auto mt-[3.5em] w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
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
                'Save & Continue'
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </div>
     
    </main>
  );
};

export default AddNewSchool;


