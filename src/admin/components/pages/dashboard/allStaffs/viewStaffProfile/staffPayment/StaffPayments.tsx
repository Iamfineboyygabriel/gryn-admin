import React from 'react'
import { FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'


const StaffPayments: React.FC<{ staffEmail: any }> = ({
    staffEmail,
    }) => {
  return (
    <main className="font-outfit">
    <div className="relative">
      <header className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">All Payments</h1>
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

export default StaffPayments