import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { button } from "../../../../../../../shared/buttons/Button";
import { Dropdown, DropdownItem } from "../../../../../../../shared/dropDown/DropDown";
import addItem from "../../../../../../../assets/svg/addItem.svg";


type Status = DropdownItem;

const NewBudgets: React.FC = () => {
    const [paymentType, setPaymentType] = useState<DropdownItem | null>(null);  
    const [location, setLocation] = useState<DropdownItem | null>(null);        
    const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1);
  };

  const type: Status[] = [{ name: "Bank Transfer" }];
  const branch: Status[] = [{ name: "Ikeja Branch, Lagos Nigeria" }, {name: "Ipaja Branch, Lagos Nigeria"} , { name:"Enugu Branch, Nigeria "}, { name:"Porthacourt Branch, Nigeria "} , { name:"Accra Branch, Ghana "}, { name:"Oshogbo Hub, Osun State Nigeria "}];

  const handleSelectPayment = (item: DropdownItem | null) => { 
    if (item) {
      setPaymentType(item);  
    }
  };

  const handleSelectLocation = (item: DropdownItem | null) => { 
    if (item) {
      setLocation(item);  
    }
  };


  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="mt-[1em] flex flex-col gap-[1.2em] h-auto w-full overflow-auto rounded-lg py-4 bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            Budget /
            <span className="ml-1 mr-1 font-medium">
              All Budgets
            </span>
            /
            <span className="ml-1 font-medium text-primary-700">
              New Budget
            </span>
          </h2>
          <button type="button" className="btn-2" onClick={handleBackClick}>
            Back
          </button>
        </div>
        <header>
          <h1 className="font-semibold text-xl">Generate Payment</h1>
        </header>
          <div className="w-[42%] flex flex-col gap-[1.2em]">
          <Dropdown
            label="Payment Type"
            labelClassName="text-grey-primary"
            items={type}
            selectedItem={paymentType}  
            onSelectItem={handleSelectPayment}  
            />

            <Dropdown
            label="Location"
            labelClassName="text-grey-primary"
            items={branch}
            selectedItem={location}  
            onSelectItem={handleSelectLocation}  
            />
          </div>

          {/* Budget Item Section */}
          <div className="flex flex-col gap-[1em]">
            <h3 className="text-gray-500 font-medium">Budget Item</h3>

            <div className="flex justify-between items-start gap-[1em]">
              {/* Name Input (Same width as dropdowns) */}
              <div className="w-[42%]">
                <label htmlFor="name" className="flex-start flex font-medium">Name</label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                />
              </div>

              {/* Quantity, Rate, and Amount Inputs (sharing remaining space) */}
              <div className="flex w-[58%] gap-[1em]">
                <div className="w-1/3">
                  <label htmlFor="quantity" className="flex-start flex font-medium">Quantity</label>
                  <input
                    name="quantity"
                    id="quantity"
                    type="number"
                    className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>

                <div className="w-1/3">
                  <label htmlFor="rate" className="flex-start flex font-medium">Rate</label>
                  <input
                    name="rate"
                    id="rate"
                    type="number"
                    className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>

                <div className="w-1/3">
                  <label htmlFor="amount" className="flex-start flex font-medium">Amount</label>
                  <input
                    name="amount"
                    id="amount"
                    type="number"
                    className="mt-[11px] w-full rounded-lg border-[2px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
              </div>
              
            </div>
              <button className="flex gap-2 items-center">
                <img src={addItem} alt="" />
                <span className="font-medium text-primary-700">
                  Add New Item
                </span>
              </button>

              <button.PrimaryButton
                  className="bg-linear-gradient rounded-full w-[30%] py-[12px] text-center text-lg font-semibold text-white"
                >
             Generate Payment
            </button.PrimaryButton>
          </div>
      </div>
    </main>
  );
};

export default NewBudgets;
