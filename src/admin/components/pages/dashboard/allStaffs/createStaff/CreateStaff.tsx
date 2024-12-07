import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppDispatch } from '../../../../../../shared/redux/store';
import { useAppDispatch } from '../../../../../../shared/redux/hooks/shared/reduxHooks';
import Modal from '../../../../../../shared/modal/Modal';
import StaffCreated from '../../../../../../shared/modal/StaffCreated';
import { button } from '../../../../../../shared/buttons/Button';
import { CgAsterisk } from 'react-icons/cg';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import { createStaff } from '../../../../../../shared/redux/shared/slices/shareApplication.slices';
import { Dropdown, DropdownItem } from '../../../../../../shared/dropDown/DropDown';

interface Gender {
  name: string;
}

const CreateStaff = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const type: Gender[] = [{ name: "MALE" }, {name:"FEMALE"}];

  const handleSelectGender = useCallback((item: DropdownItem) => {
    setGender(item?.name || null);
  }, []);

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
        gender,
      };
      await dispatch(createStaff(body)).unwrap();
      handleOpenModal();
    } catch (error: any) {
      toast.error(
        error.message || 'An error occurred while creating staff'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Staff Management</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium">
                staff management /{' '}
                <span className="ml-1 font-medium text-primary-700">
                  New staff
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
          className="mt-[1.5em] w-full max-w-4xl"
          onSubmit={submitApplication}
        >
          <div className="flex flex-wrap gap-[2em]">
            <div className="w-full md:w-[48%]">
              <label
                htmlFor="firstName"
                className="flex items-center font-medium"
              >
                First Name <CgAsterisk className="text-red-500 ml-1" />
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
            <div className="w-full md:w-[48%]">
              <label
                htmlFor="lastName"
                className="flex items-center font-medium"
              >
                Last Name <CgAsterisk className="text-red-500 ml-1" />
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

          <div className="flex flex-wrap gap-[2em] mt-[1em]">
            <div className="w-full md:w-[48%]">
              <label htmlFor="middleName" className="flex items-center font-medium">
                Other Name <span className="text-gray-500 ml-1">(Optional)</span>
              </label>
              <input
                id="middleName"
                name="middleName"
                onChange={(e) => setMiddleName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-noneiojn   "
              />
            </div>
            <div className="w-full md:w-[48%]">
              <label htmlFor="email" className="flex items-center font-medium">
                Email Address <CgAsterisk className="text-red-500 ml-1" />
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

          <div className="flex flex-wrap gap-[2em] mt-[1em]">
            <div className="w-full md:w-[48%]">
            <Dropdown
            label="Gender"
            labelClassName="text-grey-primary"
            className="text-purple-deep"
            items={type}
            selectedItem={gender ? { name: gender } : null}
            onSelectItem={handleSelectGender}
            asterisk
            placeholder='Select'
          />
            </div>
          </div>

          <div className="mt-11">
            <button.PrimaryButton
              className="m-auto w-[100%] md:w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
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
                'Generate Password Link'
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} data-aos="zoom-in">
          <StaffCreated email={email} onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default CreateStaff;
