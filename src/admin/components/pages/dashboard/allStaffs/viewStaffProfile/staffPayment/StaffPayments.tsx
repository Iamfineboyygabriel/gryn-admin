import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAllStaffPayment } from "../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { useStaffDetails } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import dayjs from "dayjs";
import StaffPaymentDetailModal from "../../../../../../../shared/modal/StaffPaymentDetailModal";
import CustomPagination from "../../../../../../../shared/utils/customPagination";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const StaffPayments = ({ staffEmail }: any) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { staffDetail } = useStaffDetails(staffEmail);
  const staffId = staffDetail?.data?.profile.userId;
  const {
    allStaffInvoicePayment,
    loading,
    fetchStaffPayments,
    clearPayments,
    currentPage,
  } = useAllStaffPayment();
  console.log("all", allStaffInvoicePayment);
  useEffect(() => {
    return () => {
      setSelectedPayment(null);
      setIsModalOpen(false);
    };
  }, [staffEmail]);

  useEffect(() => {
    if (!staffEmail) {
      clearPayments();
    }
    return () => {
      clearPayments();
    };
  }, [staffEmail, clearPayments]);

  useEffect(() => {
    if (staffId) {
      fetchStaffPayments(staffId, currentPage, itemsPerPage);
    } else {
      clearPayments();
    }
  }, [staffId, currentPage, fetchStaffPayments, clearPayments, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      if (staffId) {
        fetchStaffPayments(staffId, value, itemsPerPage);
      }
    },
    [fetchStaffPayments, staffId, itemsPerPage],
  );

  const formatAmount = (amount: number) => {
    if (!amount && amount !== 0) return "-";
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateTotalAmount = (items: any[]) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const amount = Number(item.amount) || 0;
      // We'll maintain discount calculation but ensure consistent decimal places
      const discount = Number(item.discount) || 0;
      const itemTotal = amount - (amount * discount) / 100;
      return total + itemTotal;
    }, 0);
  };

  const filteredInvoicePayment = useMemo(
    () =>
      Array.isArray(allStaffInvoicePayment?.payment)
        ? allStaffInvoicePayment?.payment
        : [],
    [allStaffInvoicePayment?.payment],
  );
  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const handleViewDetails = useCallback((payment: any) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  }, []);

  const renderTableBody = useCallback(() => {
    if (!staffId) {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No payments found.
              </p>
            </div>
          </td>
        </tr>
      );
    }

    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredInvoicePayment?.length > 0) {
      return filteredInvoicePayment?.map((staff: any, index: number) => (
        <tr
          key={`${staff.id}-${staffId}`}
          className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td className="py-[16px] px-[24px]">
            {formatData(staff?.invoiceNumber)}
          </td>
          <td className="py-[16px] px-[24px]">
            NGN {formatData(formatAmount(calculateTotalAmount(staff?.item)))}
          </td>
          <td className="py-[16px] px-[24px]">
            {staff?.createdAt
              ? dayjs(staff?.createdAt).format("YYYY-MM-DD")
              : "-"}
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
    }

    return (
      <tr>
        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
          <div className="mt-[2em] flex flex-col items-center justify-center">
            <img src={transaction} alt="No applications" />
            <p className="mt-2 text-sm text-gray-50">No invoices found.</p>
          </div>
        </td>
      </tr>
    );
  }, [
    loading,
    filteredInvoicePayment,
    formatData,
    handleViewDetails,
    staffId,
    currentPage,
    itemsPerPage,
  ]);

  return (
    <main className="font-outfit">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">All Payments</h1>
        </header>

        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse min-w-full">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm whitespace-nowrap font-normal">
                  S/N
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal whitespace-nowrap">
                  Invoice No
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal whitespace-nowrap">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal whitespace-nowrap">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal whitespace-nowrap">
                  View Details
                </th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>

        {!loading &&
          filteredInvoicePayment &&
          filteredInvoicePayment?.length > 0 && (
            <div className="mt-6 flex justify-center">
              <CustomPagination
                currentPage={currentPage}
                onPageChange={handlePageChange}
                hasMore={filteredInvoicePayment?.length === itemsPerPage}
              />
            </div>
          )}
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
