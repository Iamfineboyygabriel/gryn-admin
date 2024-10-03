import React, { useEffect, useMemo, useCallback, useState } from "react";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/plus.svg";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import { useAllAdminForSuperAdmin } from "../../../../../../shared/redux/hooks/admin/getAdminProfile";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const Payment = () => {

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em]">

      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-medium text-xl">All Payments</h1>
          <div className="flex gap-2">
            <button.PrimaryButton  className="mt-[1em] flex gap-2 rounded-full bg-primary-200 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
              <img src={plus} alt="plus" />
              New Payment
            </button.PrimaryButton>
          </div>
        </header>
        <div className="flex items-center mt-3 w-64 rounded-full border-[1px] border-border bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            className="flex-grow rounded-full bg-transparent py-2 pl-4 pr-2 text-sm focus:border-grey-primary focus:outline-none"
            placeholder="Search"
            // value={localSearchTerm}
            // onChange={(e) => setLocalSearchTerm(e.target.value)}
          />
          <FiSearch className="mr-3 text-lg text-gray-500" />
        </div>

        <table className="w-full mt-4 border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Full Name</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Phone Number</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Role</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Email Address</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
            </tr>
          </thead>
          {/* <tbody>{renderTableBody()}</tbody> */}
        </table>
      </div>

      </div>
    </main>
  );
};

export default Payment

