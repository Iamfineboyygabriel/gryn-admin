import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { button } from '../../../../../../../../shared/buttons/Button';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import { Dropdown, DropdownItem } from '../../../../../../../../shared/dropDown/DropDown';
import { useStaffDetails } from '../../../../../../../../shared/redux/hooks/admin/getAdminProfile';
import { AppDispatch } from '../../../../../../../../shared/redux/store';
import { useAppDispatch } from '../../../../../../../../shared/redux/hooks/shared/reduxHooks';
import { CreateSalary } from '../../../../../../../../shared/redux/shared/slices/shareApplication.slices';
import Modal from '../../../../../../../../shared/modal/Modal';
import SalaryPaymentCreated from '../../../../../../../../shared/modal/SalaryPaymentCreated';

interface CurrentStatus {
  name: string;
}

interface LocationState {
  staffEmail?: string;
}

const NewSalary = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [paymentNo, setPaymentNo] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const staffEmail = state?.staffEmail || '';

  const dispatch: AppDispatch = useAppDispatch();
  const { staffDetail } = useStaffDetails(staffEmail);

  const type: CurrentStatus[] = [{ name: "OPEN" }];

  const handleSelectType = useCallback((item: DropdownItem) => {
    setStatus(item?.name || null);
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const submitSalary = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!staffDetail) {
      toast.error('Staff details not available');
      return;
    }
    setLoading(true);

    try {
      const body = {
        status,
        paymentNo,
        amount: parseFloat(amount),
        description
      };
      const staffId = staffDetail.data.profile.userId;
      await dispatch(CreateSalary({ body, staffId })).unwrap();
      handleOpenModal();
    } catch (error: any) {
      toast.error(
        error.message || 'An error occurred while creating the application'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!staffEmail) {
      toast.error('Staff email is missing. Redirecting to previous page.');
      navigate(-1);
    }
  }, [staffEmail, navigate]);

  if (!staffEmail) {
    return null; // or return a loading indicator
  }

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                All Staffs /
                <span className="ml-1 font-medium">
                  View Details
                </span>
                /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  Salary-loan
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <header>
          <h1 className="text-2xl mt-[1.5em] font-bold">Salary/Loan</h1>
        </header>

        <form className="mt-[1.5em] w-[60%]" onSubmit={submitSalary}>
          <div className="flex items-center space-x-4">
            <div className="w-1/2">
              <Dropdown
                label="Status"
                labelClassName="text-grey-primary"
                className="text-purple-deep w-full"
                items={type}
                selectedItem={status ? { name: status } : null}
                onSelectItem={handleSelectType}
                placeholder="Payment Status"
              />
            </div>
            
            <div className="w-1/2">
              <label htmlFor="paymentNo" className="flex-start flex font-medium mb-2">
                Payment No.
              </label>
              <input
                type="text"
                id="paymentNo"
                onChange={(e) => setPaymentNo(e.target.value)}
                required
                className="border-border focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className='mt-[1em]'>
            <h1 className='font-medium text-xl text-gray-500'>Payment</h1>
          </div>

          <div className="w-1/2 mt-[1em]">
            <label htmlFor="description" className="flex-start flex font-medium mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              required
              className="border-border focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none w-full"
            />
          </div>

          <div className="w-1/2 mt-[1em]">
            <label htmlFor="amount" className="flex-start flex font-medium mb-2">
              Amount
            </label>
            <input
              type="tel"
              id="amount"
              onChange={(e) => setAmount(e.target.value)}
              required
              className="border-border focus:border-border rounded-lg border-[1px] bg-inherit p-3 focus:outline-none w-full"
            />
          </div>

          <div className="mr-auto mt-4">
            <button.PrimaryButton
              className="m-auto mt-[3.5em] w-[37%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
              type="submit"
            >
              {loading ? (
                <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
              ) : (
                'Send Payment'
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} data-aos="zoom-in">
          <SalaryPaymentCreated onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default NewSalary;