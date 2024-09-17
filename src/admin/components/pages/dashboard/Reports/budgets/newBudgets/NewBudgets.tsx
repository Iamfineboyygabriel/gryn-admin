import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { button } from "../../../../../../../shared/buttons/Button";
import { Dropdown, DropdownItem } from "../../../../../../../shared/dropDown/DropDown";

type Status = DropdownItem;

interface Item {
  name: string;
}

const NewBudgets: React.FC = () => {
    const [paymentType, setPaymentType] = useState();
    const [loaction, setLocation] = useState();
    const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1);
  };

  const type: Status[] = [{ name: "Bank Transfer" }];
  const branch: Status[] = [{ name: "Ikeja Branch, Lagos Nigeria" }, {name: "Ipaja Branch, Lagos Nigeria"} , { name:"Enugu Branch, Nigeria "}];

  const handleSelectPayment = (item: any) => {
    if (item) {
      setPaymentType(item);
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            Budget /
            <span className="ml-1 font-medium">
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
      <Dropdown
        label="Payment Type n"
        labelClassName="text-grey-primary"
        items={type}
        selectedItem={type}
        onSelectItem={handleSelectPayment}
        className="w-[6bn em]"
        />
      </div>
    </main>
  );
};

export default NewBudgets;
