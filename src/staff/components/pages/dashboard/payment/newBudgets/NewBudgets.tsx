import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { useAppDispatch } from "../../../../../../shared/redux/hooks/shared/reduxHooks";
import { createBudget } from "../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { AppDispatch } from "../../../../../../shared/redux/store";
import { Dropdown, DropdownItem } from "../../../../../../shared/dropDown/DropDown";
import { button } from "../../../../../../shared/buttons/Button";
import Modal from "../../../../../../shared/modal/Modal";
import InvoiceSent from "../../../../../../shared/modal/InvoiceSent";
import addItemSvg from "../../../../../../assets/svg/addItem.svg";

interface BudgetItem {
  productName: string;
  quantity: number;
  rate: number;
  amount: number;
  discount: number;
}

interface BudgetFormData {
  paymentType: string;
  location: string;
  BudgetItem: BudgetItem[];
}

const initialBudgetItem: BudgetItem = {
  productName: "",
  quantity: 0,
  rate: 0,
  amount: 0,
  discount: 0,
};

const NewBudgets: React.FC = () => {
  const [formData, setFormData] = useState<BudgetFormData>({
    paymentType: "",
    location: "",
    BudgetItem: [{ ...initialBudgetItem }],
  });
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useAppDispatch();

  const paymentTypes: DropdownItem[] = [{ name: "BANK_TRANSFER" }];
  const branches: DropdownItem[] = [
    { name: "Ikeja Branch, Lagos Nigeria" },
    { name: "Ipaja Branch, Lagos Nigeria" },
    { name: "Enugu Branch, Nigeria" },
    { name: "Porthacourt Branch, Nigeria" },
    { name: "Accra Branch, Ghana" },
    { name: "Oshogbo Hub, Osun State Nigeria" },
  ];

  const handleBackClick = () => navigate(-1);

  const handleDropdownChange = (key: 'paymentType' | 'location') => (item: DropdownItem | null) => {
    setFormData(prev => ({ ...prev, [key]: item?.name || "" }));
  };

  const handleBudgetItemChange = (index: number, field: keyof BudgetItem, value: string | number) => {
    const updatedBudgetItems = formData.BudgetItem.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFormData(prev => ({ ...prev, BudgetItem: updatedBudgetItems }));
  };

  const addNewBudgetItem = () => {
    setFormData(prev => ({
      ...prev,
      BudgetItem: [...prev.BudgetItem, { ...initialBudgetItem }],
    }));
  };

  const calculateTotalRate = (): number => {
    return formData.BudgetItem.reduce((sum, item) => sum + item.rate, 0);
  };

  const calculateTotalAmount = (): number => {
    return formData.BudgetItem.reduce((sum, item) => sum + item.amount, 0);
  };

  const submitBudget = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBudgetLoading(true);

    try {
      await dispatch(createBudget(formData)).unwrap();
      setModalOpen(true);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while creating the budget.");
    } finally {
      setBudgetLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Payments</h1>
      <form onSubmit={submitBudget} className="mt-[1em] flex flex-col gap-[1.2em] h-auto w-full overflow-auto rounded-lg py-4 bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            <span className="ml-1 mr-1 font-medium">All Budgets</span> /
            <span className="ml-1 font-medium text-primary-700">New Budget</span>
          </h2>
          <button type="button" className="btn-2" onClick={handleBackClick}>
            Back
          </button>
        </div>
        <header>
          <h1 className="font-semibold text-xl">New Budget</h1>
        </header>
        <div className="w-[42%] flex flex-col gap-[1.2em]">
          <Dropdown
            label="Payment Type"
            labelClassName="text-grey-primary"
            items={paymentTypes}
            selectedItem={paymentTypes.find(item => item.name === formData.paymentType) || null}
            onSelectItem={handleDropdownChange('paymentType')}
          />
          <Dropdown
            label="Location"
            labelClassName="text-grey-primary"
            items={branches}
            selectedItem={branches.find(item => item.name === formData.location) || null}
            onSelectItem={handleDropdownChange('location')}
          />
        </div>

        <div className="flex flex-col gap-[1em]">
          <h3 className="text-gray-500 font-medium">Budget Items</h3>
          {formData.BudgetItem.map((item, index) => (
            <div key={index} className="flex justify-between items-start gap-[1em]">
              <div className="w-[25%]">
                <label htmlFor={`productName-${index}`} className="flex-start flex font-medium">Product Name</label>
                <input
                  id={`productName-${index}`}
                  type="text"
                  value={item.productName}
                  onChange={(e) => handleBudgetItemChange(index, 'productName', e.target.value)}
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                />
              </div>
              <div className="flex w-[75%] gap-[1em]">
                <div className="w-1/5">
                  <label htmlFor={`quantity-${index}`} className="flex-start flex font-medium">Quantity</label>
                  <input
                    id={`quantity-${index}`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleBudgetItemChange(index, 'quantity', Number(e.target.value))}
                    className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
                <div className="w-1/5">
                  <label htmlFor={`rate-${index}`} className="flex-start flex font-medium">Rate</label>
                  <input
                    id={`rate-${index}`}
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleBudgetItemChange(index, 'rate', Number(e.target.value))}
                    className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
                <div className="w-1/5">
                  <label htmlFor={`amount-${index}`} className="flex-start flex font-medium">Amount</label>
                  <input
                    id={`amount-${index}`}
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleBudgetItemChange(index, 'amount', Number(e.target.value))}
                    className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
                <div className="w-1/5">
                  <label htmlFor={`discount-${index}`} className="flex-start flex font-medium">Discount</label>
                  <input
                    id={`discount-${index}`}
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleBudgetItemChange(index, 'discount', Number(e.target.value))}
                    className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addNewBudgetItem} className="flex gap-2 mt-[1.5em] items-center">
            <img src={addItemSvg} alt="Add item" />
            <span className="font-medium text-primary-700">Add New Item</span>
          </button>

          <div className="w-[10em]">
            <label htmlFor="totalRate" className="flex-start flex font-medium">Total Rate</label>
            <input
              id="totalRate"
              type="number"
              value={calculateTotalRate()}
              readOnly
              className="mt-[11px] cursor-not-allowed w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>

          <div className="w-[10em]">
            <label htmlFor="totalAmount" className="flex-start flex font-medium">Total Amount</label>
            <input
              id="totalAmount"
              type="number"
              value={calculateTotalAmount()}
              readOnly
              className="mt-[11px] cursor-not-allowed bg-gray-200 w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
            />
          </div>

          <button.PrimaryButton
            type="submit"
            className="bg-linear-gradient rounded-full mt-[2em] w-[30%] py-[12px] text-center text-lg font-semibold text-white"
            disabled={budgetLoading}
          >
            {budgetLoading ? (
              <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
            ) : (
              "Generate Payment"
            )}
          </button.PrimaryButton>
        </div>
      </form>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} data-aos="zoom-in">
          <InvoiceSent to="/staff/dashboard/payments" onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </main>
  );
};

export default NewBudgets;