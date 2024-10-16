import React, { useEffect, useState } from "react";
import Success from "../../assets/svg/Success-Icon.svg";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { approveBudgetAdmin, approveBudgetSuperAdmin } from "../redux/shared/services/shareApplication.services";
import ReactLoading from "react-loading";
import { button } from "../buttons/Button";
import background from "../../assets/svg/budget-icon.svg"
// import background from "../../assets/svg/ActiveHome.svg"



interface BudgetPaymentDetailProps {
  budgetId: string;
  onClose: () => void;
  budgets: any | null;
  onApproved: (budgetId: string) => void;
  isSuperAdmin: boolean;
}

const BudgetPaymentDetail: React.FC<BudgetPaymentDetailProps> = ({ 
  budgetId, 
  onClose, 
  budgets, 
  onApproved,
  isSuperAdmin
}) => {
  const [approveLoading, setApproveLoading] = useState(false);
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    if (budgets?.data && budgetId) {
      const foundBudget = budgets.data.find((b: any) => b.id === budgetId);
      if (foundBudget) {
        setBudget(foundBudget);
      }
    }
  }, [budgetId, budgets]);

  const handleApprove = async () => {
    if (budgetId) {
      try {
        setApproveLoading(true);
        if (isSuperAdmin) {
          await approveBudgetSuperAdmin(budgetId);
          onApproved(budgetId);
        } else {
          await approveBudgetAdmin(budgetId);
          setBudget({ ...budget, status: 'APPROVED' });
        }
        toast.success('Budget approved successfully!');
      } catch (error: any) {
        toast.error(error.message || "An error occurred");
      } finally {
        setApproveLoading(false);
      }
    }
  };

  const isPending = budget?.status === 'PENDING';
  const isApproved = budget?.status === 'APPROVED';
  const isPaid = budget?.status === 'PAID';

  const renderButton = () => {
    if (approveLoading) {
      return <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />;
    }
    if (isSuperAdmin) {
      return "Proceed";
    }
    if (isPending) {
      return "Approve Budget";
    }
    if (isApproved) {
      return "Admin Approved";
    }
    return "";
  };

  const isButtonDisabled = !isSuperAdmin && isApproved;

  return (
    <main className="fixed font-outfit inset-y-0 overflow-auto px-4 py-4 right-0 w-[500px] bg-white shadow-lg">
      <div className="h-full flex flex-col">
        <button onClick={onClose} className="text-gray-500 text-lg hover:text-gray-700 absolute top-4 right-4">
          &times;
        </button>
        
        {!isPaid ? (
          <>
            <img src={background} alt="Budget background" className="w-full" />
            <div className="mt-4 p-[1.5em]">
              <button.PrimaryButton
                onClick={handleApprove}
                disabled={isButtonDisabled}
                className={`rounded-full w-[15em]flex ml-auto justify-center flex py-3 text-center font-semibold ${
                  isButtonDisabled
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-primary-700 text-white hover:bg-primary-800"
                }`}
              >
                {renderButton()}
              </button.PrimaryButton>
            </div>
          </>
        ) : (
          <div className="flex-grow overflow-y-auto px-[1.5em]">
            <div className="flex border-b py-[1em] flex-col justify-center text-center">
              <div className="flex justify-center">
                <img src={Success} alt="success" className="w-[5em]" />
              </div>
              <p className="font-semibold">Payment Success!</p>
              <div className="bg-purple-white mt-[1em] py-[6px]">
                <p className="font-semibold text-sm text-red-500">
                  {budget?.paymentType || '-'}
                </p>
                <div>
                  <p className="font-semibold text-primary-700 text-2xl">
                    NGN {budget?.BudgetItem[0]?.amount || '-'}
                  </p>
                </div>
              </div>

              <div className="space-y-6 flex flex-col gap-[3px] mt-4">
                {budget?.BudgetItem.map((item: any) => (
                  <div key={item.id} className="flex justify-between py-2">
                    <p className="text-sm text-gray-500">{item.name}</p>
                    <p className="font-medium">NGN {item.amount}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">{dayjs(budget?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{budget?.status || '-'}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default BudgetPaymentDetail;