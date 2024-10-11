import React from "react";
import { Link } from "react-router-dom";
import { button } from "../../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../../assets/svg/plus.svg";

interface StaffSalaryProps {
  staffEmail: any;
}

const Salary: React.FC<StaffSalaryProps> = ({ staffEmail }) => {
  return (
    <main className="font-outfit">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">Salary/Loan</h1>
          <Link
            to="/admin/dashboard/all_staffs/new-salary"
            state={{ staffEmail }}
          >
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
              <img src={plus} alt="plus" />
              New Salary
            </button.PrimaryButton>
          </Link>
        </header>
        <table className="w-full mt-4 border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Invoice No.</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Invoice Date</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Due Date</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Table body content will go here */}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Salary;