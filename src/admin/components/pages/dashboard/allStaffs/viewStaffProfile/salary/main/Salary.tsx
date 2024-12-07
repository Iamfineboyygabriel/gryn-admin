import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import transaction from "../../../../../../../../assets/svg/Transaction.svg";
import plus from "../../../../../../../../assets/svg/plus.svg";

import { useStaffDetails } from "../../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { useStaffSalary } from "../../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { clearPaymentData } from "../../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { button } from "../../../../../../../../shared/buttons/Button";
import StaffSalaryDetailModal from "../../../../../../../../shared/modal/StaffSalaryDetailModal";
import CustomPagination from "../../../../../../../../shared/utils/customPagination";

const ITEMS_PER_PAGE = 10;

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

interface SalaryItem {
  id: number;
  paymentNo: string;
  description: string;
  amount: number;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const StaffSalary = ({ staffEmail }: { staffEmail: any | null }) => {
  const dispatch = useDispatch();
  const [selectedPayment, setSelectedPayment] = useState<SalaryItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { staffDetail, loading: staffLoading } = useStaffDetails(staffEmail);
  const staffId = staffDetail?.data?.profile?.userId;

  const { staffSalary, loading, error, fetchStaffPayments } = useStaffSalary();

  const formatAmount = (amount: number) =>
    amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  useEffect(() => {
    dispatch(clearPaymentData());
  }, [dispatch]);

  useEffect(() => {
    if (staffId) {
      fetchStaffPayments(staffId, currentPage);
    }
  }, [staffId, currentPage, fetchStaffPayments]);

  const filteredSalary =
    staffSalary && staffSalary[0]?.salary ? staffSalary[0]?.salary : [];
  const shouldShowPagination =
    !loading && (currentPage > 1 || (filteredSalary?.length ?? 0) > 0);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      if (newPage >= 1) {
        setCurrentPage(newPage);
      }
    },
    []
  );

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const handleViewDetails = (payment: SalaryItem) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const renderTableBody = useCallback(() => {
    if (loading || staffLoading) {
      return Array.from({ length: 6 }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredSalary.length > 0) {
      return filteredSalary.map((salary: SalaryItem, index: number) => (
        <tr
          key={salary.id}
          className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">{index + 1}</td>
          <td className="py-[16px] px-[24px]">
            {formatData(salary.paymentNo)}
          </td>
          <td className="py-[16px] px-[24px]">
            {formatData(salary.description)}
          </td>
          <td className="py-[16px] px-[24px]">{formatAmount(salary.amount)}</td>
          <td className="py-[16px] px-[24px]">
            {salary.createdAt
              ? dayjs(salary.createdAt).format("YYYY-MM-DD")
              : "-"}
          </td>
          <td className="py-[16px] px-[24px]">{formatData(salary.status)}</td>
          <td className="flex items-center whitespace-nowrap px-6 py-4">
            <button
              className="cursor-pointer font-semibold text-primary-700"
              onClick={() => handleViewDetails(salary)}
            >
              View details
            </button>
          </td>
        </tr>
      ));
    }

    return (
      <tr>
        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
          <div className="mt-[2em] flex flex-col items-center justify-center">
            <img src={transaction} alt="No applications" />
            <p className="mt-2 text-sm text-gray-500 dark:text-white">
              No salary records found.
            </p>
          </div>
        </td>
      </tr>
    );
  }, [loading, staffLoading, filteredSalary, formatData, handleViewDetails]);

  return (
    <main className="font-outfit">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">All Payments</h1>
          <Link
            to={`/admin/dashboard/all_staffs/new-salary`}
            state={{ staffEmail }}
          >
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
              <img src={plus} alt="plus" />
              New Salary / Loan
            </button.PrimaryButton>
          </Link>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Payment No.
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>

        {shouldShowPagination && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={filteredSalary.length === ITEMS_PER_PAGE}
            />
          </div>
        )}
      </div>

      {isModalOpen && selectedPayment && (
        <StaffSalaryDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payment={selectedPayment}
        />
      )}
    </main>
  );
};

export default StaffSalary;
