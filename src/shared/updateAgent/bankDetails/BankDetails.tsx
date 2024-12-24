import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useBanks } from "../../redux/hooks/admin/getAdminProfile";
import { Dropdown, DropdownItem } from "../../dropDown/DropDown";
import { getAccountName } from "../../redux/admin/services/application.services";
import { updateUserBankDetails } from "../../redux/admin/slices/application.slices";
import { button } from "../../../shared/buttons/Button";

interface Banks {
  name: string;
  code: string;
}

interface BankAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
}

const SkeletonRow = () => (
  <div className="animate-pulse w-[40%]">
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

const BankDetails: React.FC<{
  agentData: any;
  onNext: any;
}> = ({ agentData, onNext }) => {
  const agentId = agentData.id;
  const dispatch: AppDispatch = useDispatch();
  const { allBanks, loading: bankLoading } = useBanks();
  const banks: Banks[] = allBanks || [];

  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bank, setBank] = useState<Banks | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [originalBankDetails, setOriginalBankDetails] = useState({
    accountNumber: "",
    accountName: "",
    bank: null as Banks | null,
  });

  const dropdownItems: DropdownItem[] = banks?.map((bank) => ({
    name: bank.name,
  }));

  useEffect(() => {
    if (agentData?.bankAccounts) {
      let bankAccount: BankAccount;

      if (Array?.isArray(agentData.bankAccounts)) {
        bankAccount = agentData.bankAccounts[0];
      } else {
        bankAccount = agentData.bankAccounts as BankAccount;
      }

      if (bankAccount) {
        const initialDetails = {
          accountNumber: bankAccount?.accountNumber || "",
          accountName: bankAccount?.accountName || "",
          bank: { name: bankAccount?.bankName, code: bankAccount?.bankCode },
        };

        setAccountNumber(initialDetails?.accountNumber);
        setAccountName(initialDetails?.accountName);
        setBank(initialDetails?.bank);

        setOriginalBankDetails(initialDetails);
      }
    }
  }, [agentData]);

  useEffect(() => {
    const findAccountName = async () => {
      if (!bank || accountNumber.length < 10) return;

      setLoading(true);

      const endpoint = `/auth/bank/accountInfo?code=${encodeURIComponent(
        bank.code
      )}&account_number=${encodeURIComponent(accountNumber)}`;

      try {
        const response: any = await getAccountName(endpoint);
        setLoading(false);

        if (response?.status === 200 && response.data.status) {
          setAccountName(response?.data?.data?.account_name);
        } else {
          toast.error(response.data.message || "Failed to fetch data");
        }
      } catch (error) {
        setLoading(false);
        toast.error("Account doesn't exist");
      }
    };

    findAccountName();
  }, [accountNumber, bank]);

  const handleSelectItem = (item: DropdownItem) => {
    const selectedBank = banks?.find((bank) => bank.name === item.name);
    if (selectedBank) {
      setBank(selectedBank);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const editBankDetails = async () => {
    if (!agentId) {
      toast.error("Agent ID not found");
      return;
    }

    setLoading(true);

    if (!accountName || !bank) {
      toast.error("Please ensure account name and bank are selected.");
      setLoading(false);
      return;
    }

    const details: any = {
      accountNumber,
      accountName,
      bankCode: bank.code,
      bankName: bank.name,
    };

    try {
      const response = await dispatch(
        updateUserBankDetails({
          id: agentId,
          details,
        })
      ).unwrap();

      if (response.status === 200) {
        toast.success("Bank details updated successfully");
        onNext();
        setIsEditing(false);

        setOriginalBankDetails({
          accountNumber,
          accountName,
          bank,
        });
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const discardChanges = () => {
    setAccountNumber(originalBankDetails?.accountNumber);
    setAccountName(originalBankDetails?.accountName);
    setBank(originalBankDetails?.bank);
    setIsEditing(false);
  };

  const hasChanges = () => {
    return (
      accountNumber !== originalBankDetails?.accountNumber ||
      accountName !== originalBankDetails?.accountName ||
      (bank && bank?.code !== originalBankDetails?.bank?.code)
    );
  };

  if (bankLoading) {
    return (
      <main>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </main>
    );
  }

  return (
    <main>
      <header className="mt-[1em]">
        <h1 className="text-xl font-semibold">Bank Details</h1>
      </header>
      <div className="flex flex-col mt-[2em] w-full lg:w-[60%] gap-[1.5em]">
        <Dropdown
          label="Bank"
          items={dropdownItems}
          selectedItem={bank ? { name: bank.name } : null}
          onSelectItem={handleSelectItem}
          searchVisible
          loading={bankLoading}
          placeholder={bank?.name || "Select Bank"}
          disabled={!isEditing}
        />

        <div className="w-full">
          <label
            htmlFor="accountNumber"
            className="flex-start flex gap-3 font-medium text-grey-primary"
          >
            Account Number
          </label>
          <div className="relative flex text-center">
            <input
              name="accountNumber"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              readOnly={!isEditing}
              disabled={loading}
              className="focus:border-border border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="w-full">
          <label
            htmlFor="accountName"
            className="flex-start flex gap-3 font-medium text-grey-primary"
          >
            Account Name
          </label>
          <div className="relative flex text-center">
            <input
              name="accountName"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              readOnly
              disabled={loading}
              className="focus:border-border bg-gray-100 border-border mt-[1em] flex w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="mr-auto mt-4 flex gap-4">
          <button.PrimaryButton
            className="m-auto mt-[1.5em] px-[2em] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
            onClick={isEditing ? editBankDetails : handleEditToggle}
            disabled={loading}
          >
            {loading ? (
              <ReactLoading
                color="#FFFFFF"
                width={25}
                height={25}
                type="spin"
              />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Edit Bank Details"
            )}
          </button.PrimaryButton>

          {isEditing && hasChanges() && (
            <button
              onClick={discardChanges}
              className="m-auto mt-[1.5em] px-[1.5em] justify-center gap-2 rounded-full bg-gray-400 py-[11px] text-center font-medium text-white"
            >
              Discard Changes
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default BankDetails;
