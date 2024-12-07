import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { useAppDispatch } from "../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { createBudget } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { AppDispatch } from "../../../../../../../shared/redux/store";
import { Dropdown, DropdownItem } from "../../../../../../../shared/dropDown/DropDown";
import { button } from "../../../../../../../shared/buttons/Button";
import Modal from "../../../../../../../shared/modal/Modal";
import InvoiceSent from "../../../../../../../shared/modal/InvoiceSent";
import addItemSvg from "../../../../../../../assets/svg/addItem.svg";

interface BudgetItem {
  productName: string;
  quantity: number | '';
  rate: number | '';
  amount: number | '';
  discount: number | '';
}

interface BudgetFormData {
  paymentType: string;
  location: string;
  BudgetItem: BudgetItem[];
}

const initialBudgetItem: BudgetItem = {
  productName: "",
  quantity: '',
  rate: '',
  amount: '',
  discount: ''
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

  const paymentTypes: DropdownItem[] = [{ name: "MONEY_OUT" }];
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

  const handleBudgetItemChange = (index: number, field: keyof BudgetItem, value: string) => {
    const updatedBudgetItems = formData.BudgetItem.map((item, i) => {
      if (i === index) {
        if (field === 'productName') {
          return { ...item, [field]: value };
        } else {
          // Only convert to number for numeric fields
          const numValue = value === '' ? '' : Number(value);
          return { ...item, [field]: numValue };
        }
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
    return formData.BudgetItem.reduce((sum, item) => 
      sum + (typeof item.rate === 'number' ? item.rate : 0), 0);
  };

  const calculateTotalAmount = (): number => {
    return formData.BudgetItem.reduce((sum, item) => 
      sum + (typeof item.amount === 'number' ? item.amount : 0), 0);
  };

  const submitBudget = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBudgetLoading(true);

    try {
      await dispatch(createBudget(formData)).unwrap();
      setModalOpen(true);
    } catch (error: any) {
      toast.error(error?.message || "An error occurred while creating the budget.");
    } finally {
      setBudgetLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Reports</h1>
      <form onSubmit={submitBudget} className="mt-4 flex flex-col gap-5 h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-10">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            Budget / <span className="mx-1 font-medium">All Budgets</span> /{" "}
            <span className="ml-1 font-medium text-primary-700">New Budget</span>
          </h2>
          <button type="button" className="btn-2" onClick={handleBackClick}>
            Back
          </button>
        </div>
        
        <header>
          <h1 className="font-semibold text-xl">Generate Payment</h1>
        </header>
        
        <div className="w-[42%] flex flex-col gap-5">
          <Dropdown
            label="Payment Type"
            labelClassName="text-grey-primary"
            items={paymentTypes}
            selectedItem={paymentTypes.find(item => item.name === formData.paymentType) || null}
            onSelectItem={handleDropdownChange('paymentType')}
            placeholder="Type:"
          />
          <Dropdown
            label="Location"
            labelClassName="text-grey-primary"
            items={branches}
            selectedItem={branches.find(item => item.name === formData.location) || null}
            onSelectItem={handleDropdownChange('location')}
            placeholder="Location:"
          />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-gray-500 font-medium">Budget Items</h3>
          {formData.BudgetItem.map((item, index) => (
            <div key={index} className="flex justify-between items-start gap-4">
              <div className="w-1/4">
                <label htmlFor={`productName-${index}`} className="block font-medium">
                  Product Name
                </label>
                <input
                  id={`productName-${index}`}
                  type="text"
                  value={item.productName}
                  onChange={(e) => handleBudgetItemChange(index, 'productName', e.target.value)}
                  className="mt-2 w-full rounded-lg border-2 p-3 focus:outline-none"
                />
              </div>
              <div className="flex w-3/4 gap-4">
                {['quantity', 'rate', 'amount', 'discount'].map((field) => (
                  <div key={field} className="w-1/4">
                    <label htmlFor={`${field}-${index}`} className="block font-medium capitalize">
                      {field}
                    </label>
                    <input
                      id={`${field}-${index}`}
                      type="number"
                      value={item[field as keyof BudgetItem]}
                      onChange={(e) => handleBudgetItemChange(index, field as keyof BudgetItem, e.target.value)}
                      className="mt-2 w-full rounded-lg border-2 p-3 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addNewBudgetItem} 
            className="flex items-center gap-2 mt-6"
          >
            <img src={addItemSvg} alt="Add item" />
            <span className="font-medium text-primary-700">Add New Item</span>
          </button>

          <div className="w-40">
            <label htmlFor="totalRate" className="block font-medium">Total Rate</label>
            <input
              id="totalRate"
              type="number"
              value={calculateTotalRate()}
              readOnly
              className="mt-2 w-full rounded-lg border-2 p-3 bg-gray-100 cursor-not-allowed focus:outline-none"
            />
          </div>

          <div className="w-40">
            <label htmlFor="totalAmount" className="block font-medium">Total Amount</label>
            <input
              id="totalAmount"
              type="number"
              value={calculateTotalAmount()}
              readOnly
              className="mt-2 w-full rounded-lg border-2 p-3 bg-gray-100 cursor-not-allowed focus:outline-none"
            />
          </div>

          <button.PrimaryButton
            type="submit"
            className="bg-linear-gradient rounded-full mt-8 w-[30%] py-3 text-lg font-semibold text-white"
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
          <InvoiceSent to="/admin/dashboard/reports/budgets" onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </main>
  );
};

export default NewBudgets;