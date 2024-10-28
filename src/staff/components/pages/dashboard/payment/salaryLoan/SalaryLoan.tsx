import React, { useCallback, useEffect, useState } from 'react';
import transaction from "../../../../../../assets/svg/Transaction.svg";
import dayjs from "dayjs";
import { Link } from 'react-router-dom';
import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/plus.svg";
import { useStaffDetails } from '../../../../../../shared/redux/hooks/admin/getAdminProfile';
import useUserProfile, { useStaffSalary } from '../../../../../../shared/redux/hooks/shared/getUserProfile';
import StaffPaymentDetailModal from '../../../../../../shared/modal/StaffPaymentDetailModal';

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

const SalaryLoan = () => {
    const { userProfile } = useUserProfile();
  const [selectedPayment, setSelectedPayment] = useState<SalaryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const staffId = userProfile?.userId;
  const { staffSalary, loading, error, fetchStaffPayments } = useStaffSalary();

  useEffect(() => {
    if (staffId) {
      fetchStaffPayments(staffId);
    }
  }, [staffId, fetchStaffPayments]);

  const filteredSalary = staffSalary && staffSalary[0]?.salary ? staffSalary[0].salary : [];

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const handleViewDetails = (payment: SalaryItem) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={index} />);
    }

    if (filteredSalary.length > 0) {
      return filteredSalary.map((salary: SalaryItem, index: number) => (
        <tr key={salary.id} className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium">
          <td className="py-[16px] px-[24px]">{index + 1}</td>
          <td className="py-[16px] px-[24px]">{formatData(salary.paymentNo)}</td>
          <td className="py-[16px] px-[24px]">{formatData(salary.description)}</td>
          <td className="py-[16px] px-[24px]">{formatData(salary.amount)}</td>
          <td className="py-[16px] px-[24px]">
            {salary.createdAt ? dayjs(salary.createdAt).format("YYYY-MM-DD") : "-"}
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
    } else {
      return (
        <tr>
          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">No salary records found.</p>
            </div>
          </td>
        </tr>
      );
    }
  }, [loading, filteredSalary, formatData, handleViewDetails]);

  return (
    <main className="font-outfit">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">Salary/Loan</h1>
        </header>
        <table className="w-full mt-4 border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Payment No.</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Description</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Date</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Status</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
      {isModalOpen && selectedPayment && (
        <StaffPaymentDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payment={selectedPayment}
        />
      )}
    </main>
  );
};

export default SalaryLoan;