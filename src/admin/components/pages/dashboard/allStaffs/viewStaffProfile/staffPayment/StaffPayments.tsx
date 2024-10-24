import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAllStaffPayment } from '../../../../../../../shared/redux/hooks/shared/getUserProfile';
import { useStaffDetails } from '../../../../../../../shared/redux/hooks/admin/getAdminProfile';
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import dayjs from "dayjs";
import StaffPaymentDetailModal from '../../../../../../../shared/modal/StaffPaymentDetailModal';

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

interface PaymentItem {
  receiptNo: string;
  name: string;
  amount: number;
}

interface StaffPayments {
  payments: {
    id: number;
    staffPayment: {
      receiptNo: string;
      createdAt: string;
      senderName: string;
    };
    item: {
      name: string;
      amount: number;
    }[];
  };
}


const StaffPayments = ({ staffEmail }:any) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { staffDetail, loading: staffLoading } = useStaffDetails(staffEmail);
  const staffId = staffDetail?.data?.profile.userId;
  const { allStaffInvoicePayment, loading, error, fetchStaffPayments } = useAllStaffPayment();

  useEffect(() => {
    if (staffId) {
      fetchStaffPayments(staffId);
    }
  }, [staffId, fetchStaffPayments]);

  const filteredInvoicePayment = Array.isArray(allStaffInvoicePayment?.payment) ? allStaffInvoicePayment.payment : [];

  const formatData = useCallback((data:any) => (data ? data : "-"), []);

  const handleViewDetails = (payment:any) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={index} />);
    }

    if (filteredInvoicePayment.length > 0) {
      return filteredInvoicePayment.map((staff:any, index:number) => (
        <tr key={staff.id} className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium">
          <td className="py-[16px] px-[24px]">{index + 1}</td>
          <td className="py-[16px] px-[24px]">{formatData(staff?.staffPayment?.receiptNo)}</td>
          <td className="py-[16px] px-[24px]">{formatData(staff?.item?.[0]?.name)}</td>
          <td className="py-[16px] px-[24px]">{formatData(staff?.item?.[0]?.amount)}</td>
          <td className="py-[16px] px-[24px]">
            {staff?.staffPayment?.createdAt ? dayjs(staff?.staffPayment?.createdAt).format("YYYY-MM-DD") : "-"}
          </td>
          <td className="flex items-center whitespace-nowrap px-6 py-4">
            <button 
              className="cursor-pointer font-semibold text-primary-700"
              onClick={() => handleViewDetails(staff)}
            >
              View details
            </button>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">No invoices found.</p>
            </div>
          </td>
        </tr>
      );
    }
  }, [loading, filteredInvoicePayment, formatData, handleViewDetails]);

  return (
    <main className="font-outfit">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">All Payments</h1>
        </header>
        <table className="w-full mt-4 border-collapse">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Receipt No</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Item Name</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-normal">Payment Date</th>
              <th className="px-6 py-3 text-left text-sm font-normal">View Details</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
      <StaffPaymentDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        payment={selectedPayment}
      />
    </main>
  );
};

export default StaffPayments;



