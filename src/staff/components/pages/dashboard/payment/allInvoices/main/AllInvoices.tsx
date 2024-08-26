import { Link } from "react-router-dom";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import { FiSearch } from "react-icons/fi";

const AllInvoices = () => {
  return (
    <main className="font-outfit">
      <header>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[1.5em]">
            <h1 className="font-semibold text-lg">All Invoices</h1>
            <div className="flex items-center w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
              <input
                type="text"
                className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
                placeholder="Search"
              />
              <FiSearch className="mr-3 text-lg text-gray-500" />
            </div>
          </div>
          <Link to="/staff/dashboard/payments/generate_invoice">
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="cross" />
              Generate Invoice
            </button.PrimaryButton>
          </Link>
        </div>
      </header>
    </main>
  );
};

export default AllInvoices;
