import { useEffect, useState } from "react";
import { Dropdown, DropdownItem } from "../../../../../../shared/dropDown/DropDown";
import { useBanks } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { getAccountName, submitBankDetails } from "../../../../../../shared/redux/admin/services/application.services";
import { toast } from "react-toastify";
import {button} from "../../../../../../shared/buttons/Button"
import ReactLoading from "react-loading";
import useUserProfile from "../../../../../../shared/redux/hooks/shared/getUserProfile";


interface Banks {
  name: string;
  code: string;
}

const BankDetails = () => {
  const { allBanks, loading: bankLoading } = useBanks();
  const { userProfile } = useUserProfile();
  const banks: Banks[] = allBanks || [];
  const [bank, setBank] = useState<Banks | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dropdownItems: DropdownItem[] = banks?.map((bank) => ({
    name: bank.name,
  }));


  const handleSelectItem = (item: DropdownItem) => {
    const selectedBank = banks.find((bank) => bank.name === item.name);
    if (selectedBank) {
      setBank(selectedBank);
      console.log("Selected Bank Name:", selectedBank.name);
    }
  };
   
  useEffect(() => {
    const findAccountName = async () => {
      if (!bank || accountNumber.length < 10) return;

      setLoading(true);

      const endpoint = `/auth/bank/accountInfo?code=${encodeURIComponent(bank.code)}&account_number=${encodeURIComponent(accountNumber)}`;

      try {
        const response: any = await getAccountName(endpoint);
        setLoading(false);

        if (response?.status === 200 && response.data.status) {
          setAccountName(response.data.data.account_name);
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
const email = userProfile.email
  
 const submitDetails = async() => {
    setLoading(true);

    if (!accountName || !bank) {
      toast.error("Please ensure account name and bank are selected.");
      setLoading(false);
      return;
    }

    const body = {
      accountNumber,
      accountName,
      bankCode: bank.code,
      bankName: bank.name,
    };

    try {
      const response = await submitBankDetails(email, body);
      if (response.status === 200) {
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
      setLoading(false);
      setAccountName("");
      setAccountNumber("");
      setBank(null);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
      setLoading(false);
    }
  };


  return (
    <main className="font-outfit">
      <div className="mt-[1em] flex flex-col gap-3 lg:w-[50%]">
          <header>
            <h1 className="text-xl font-semibold">
              Bank Details
            </h1>
          </header>
          <div className="m-auto mt-[1em] flex w-full flex-col gap-[1em]">
                <Dropdown
                  label="Bank"
                  items={dropdownItems}
                  selectedItem={bank ? { name: bank.name } : null}
                  onSelectItem={handleSelectItem}
                  asterisk
                  searchVisible
                  loading={bankLoading}
                  placeholder="Select Bank"
                />

                  <div className="w-full" key={accountName}>
                  <label
                    htmlFor="accountNumber"
                    className="flex-start flex font-medium text-purple-deep"
                  >
                    Account Number
                  </label>
                  <input
                    name="accountNumber"
                    value={accountNumber}
                    type="number"
                    id="accountNumber"
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="border-border focus:border-border mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 font-medium text-purple-deep focus:outline-none"
                  />
                </div>
                <div className="w-full" key={`accountName-${accountName}`}>
                  <label
                    htmlFor="accountName"
                    className="flex-start flex font-medium text-purple-deep"
                  >
                    Account Name
                  </label>
                  <input
                    name="accountName"
                    value={accountName}
                    id="accountName"
                    readOnly
                    className="border-border focus:border-border mt-[11px] w-full cursor-not-allowed rounded-lg border-[2px] bg-grey-light p-3 font-medium text-purple-deep focus:outline-none"
                  />
                </div>

                <div className="mt-[9px] flex w-full justify-between">
                <button.PrimaryButton
                  className="mt-[1em] w-[45%] rounded-full bg-linear-gradient py-[13px] text-lg font-semibold text-white"
                  disabled={loading || !accountNumber}
                 onClick={submitDetails}
                >
                  {loading ? (
                    <ReactLoading
                      color="#FFFFFF"
                      width={25}
                      height={25}
                      type="spin"
                    />
                  ) : (
                    "Update Bank Details"
                  )}
                </button.PrimaryButton>
              </div>
        </div>
        </div>
    </main>
  )
}

export default BankDetails