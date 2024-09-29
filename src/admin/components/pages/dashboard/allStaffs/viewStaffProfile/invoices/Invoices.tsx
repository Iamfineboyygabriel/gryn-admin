import React from 'react'
import { FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";


const Invoices: React.FC<{ staffEmail: any }> = ({
    staffEmail,
    }) => {
  return (
    <main className="font-outfit">
    <div className="relative">
      <header className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">All Invoices</h1>
        <div className="flex gap-2">
          <Link to="/admin/dashboard/all_staffs/view_profile/new_invoice">
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
              <img src={plus} alt="plus" />
              New Invoices
            </button.PrimaryButton>
          </Link>
        </div>
      </header>
      <div className="flex items-center mt-3 w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
        <input
          type="text"
          className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
          placeholder="Search"
        //   value={localSearchTerm}
        //   onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
        <FiSearch className="mr-3 text-lg text-gray-500" />
      </div>
      </div>
      </main>
  )
}

export default Invoices