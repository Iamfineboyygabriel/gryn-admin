import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../shared/redux/store';
import { updateAgentBankDetails } from '../../../shared/redux/shared/slices/shareApplication.slices';
import { useAppDispatch } from '../../../shared/redux/hooks/shared/reduxHooks';
import { button } from "../../../shared/buttons/Button";
import { CgAsterisk } from "react-icons/cg";
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';

interface AgentData {
  bankAccounts: Array<{
    bankCode: string;
    accountName: string;
    accountNumber: string;
  }>;
}

interface BankDetailsProps {
  agentData: AgentData;
  onNext: () => void;
}

const BankDetails: React.FC<BankDetailsProps> = ({ onNext, agentData }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();
  const [bankCode, setBankCode] = useState(agentData?.bankAccounts[0]?.bankCode || '');
  const [accountNumber, setAccountNumber] = useState(agentData?.bankAccounts[0]?.accountNumber || '');
  const [accountName, setAccountName] = useState(agentData?.bankAccounts[0]?.accountName || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!agentData || !agentData.bankAccounts || agentData.bankAccounts.length === 0) {
      navigate('/admin/dashboard/all_users');
    }
  }, [agentData, navigate]);

  const submitApplication = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const body = {
        bankCode,
        accountNumber,
        accountName,
      };

      await dispatch(updateAgentBankDetails({ body })).unwrap();
      onNext();

    } catch (error: any) {
      toast.error(error || 'An error occurred while updating the bank details');
    } finally {
      setLoading(false);
    }
  };

  if (!agentData || !agentData.bankAccounts || agentData.bankAccounts.length === 0) {
    return null;
  }

  return (
    <main className="font-outfit">
      <div className="h-auto w-full overflow-auto rounded-lg bg-white py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <h2 className="text-xl font-semibold dark:text-white">
            Bank Details
          </h2>
        </header>
        <form
          className="mt-[1.5em] w-[77%] dark:text-white"
          onSubmit={submitApplication}
        >
          <div className="flex flex-col w-[47%] gap-[2em]">
            <div className="w-full">
              <label htmlFor="bankName" className="flex-start flex font-medium">
                Bank Name
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="bankName"
                name="bankName"
                required
                disabled={loading}
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label htmlFor="accountNumber" className="flex-start flex font-medium">
                Account Number
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                required
                disabled={loading}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
              />
            </div>
            <div className="w-full">
              <label htmlFor="accountName" className="flex-start flex font-medium">
                Account Name
                <CgAsterisk className="text-red-500" />
              </label>
              <input
                id="accountName"
                name="accountName"
                type="text"
                required
                disabled={loading}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
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
                'Update Application'
              )}
            </button.PrimaryButton>
          </div>
        </form>
      </div>
    </main>
  );
};

export default BankDetails;