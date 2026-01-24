import React, { useCallback, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import transaction from "../../../../../../../assets/svg/Transaction.svg";
import plus from "../../../../../../../assets/svg/plus.svg";

import { button } from "../../../../../../../shared/buttons/Button";
import {
  useStaffDetails,
  useStaffInvoices,
} from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";

import Modal from "../../../../../../../shared/modal/Modal";
import ApproveInvoiceModal from "../../../../../../../shared/modal/ApproveInvoiceModal";
import ApproveInvoiceAdmin from "../../../../../../../shared/modal/ApproveInvoiceAdmin";
import PaymentReceiptResponse from "../../../../../../../shared/modal/PaymentReceiptResponse";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import useUserProfile from "../../../../../../../shared/redux/hooks/shared/getUserProfile";

interface AssignedAgentsProps {
  staffEmail: any;
}

interface StaffData {
  id: string;
  invoiceNumber: string;
  amount: number;
  email: string;
  dueDate: string;
  invoiceDate: string;
  status: "SUBMITTED" | "APPROVED" | "COMPLETED";
  item: {
    amount: number;
  }[];
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const Invoices: React.FC<AssignedAgentsProps> = ({ staffEmail }) => {
  const { staffDetail } = useStaffDetails(staffEmail);
  const { userProfile } = useUserProfile();
  const isSuperAdmin = useMemo(
    () => userProfile?.user?.role === "SUPER_ADMIN",
    [userProfile],
  );
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatAmount = (amount: number) => {
    if (!amount && amount !== 0) return "-";
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const staffId = staffDetail?.data?.profile?.userId;
  const { staffInvoices, loading } = useStaffInvoices(
    staffId || "",
    currentPage,
    itemsPerPage,
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value);
  };

  const handleOpenModal = (invoiceId: string, status: string) => {
    setSelectedInvoiceId(invoiceId);
    if (status === "COMPLETED" && isSuperAdmin) {
      setReceiptModalOpen(true);
    } else {
      setApproveModalOpen(true);
    }
  };

  const handleCloseApproveModal = () => {
    setSelectedInvoiceId(null);
    setApproveModalOpen(false);
  };

  const handleCloseReceiptModal = () => {
    setSelectedInvoiceId(null);
    setReceiptModalOpen(false);
  };

  const handleApproved = (invoiceId: string) => {
    if (isSuperAdmin) {
      setApproveModalOpen(false);
      setReceiptModalOpen(true);
    } else {
      handleCloseApproveModal();
    }
  };

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const calculateInvoiceTotal = (items: any[]) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const amount = Number(item.amount) || 0;
      const discount = Number(item.discount) || 0;
      const itemTotal = amount - (amount * discount) / 100;
      return total + itemTotal;
    }, 0);
  };

  const filteredInvoices = useMemo(() => {
    if (!staffInvoices || !Array.isArray(staffInvoices?.data?.invoices))
      return [];
    return staffInvoices?.data?.invoices.filter((staff: StaffData) =>
      staff.invoiceNumber
        ?.toLowerCase()
        .includes(localSearchTerm?.toLowerCase()),
    );
  }, [staffInvoices, localSearchTerm]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-pink-500 text-white";
      case "SUBMITTED":
        return "bg-yellow-500 text-white";
      case "COMPLETED":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Approved";
      case "SUBMITTED":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array?.from({ length: itemsPerPage })?.map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredInvoices?.length > 0) {
      return filteredInvoices?.map((staff: StaffData, index: number) => (
        <tr
          key={staff.id}
          className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium"
        >
          <td className="py-[16px] px-[24px]">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          <td className="py-[16px] px-[24px]">
            {formatData(staff?.invoiceNumber)}
          </td>
          <td className="py-[16px] px-[24px]">
            NGN {formatAmount(calculateInvoiceTotal(staff?.item))}
          </td>
          <td className="py-[16px] px-[24px]">
            {formatData(dayjs(staff?.invoiceDate)?.format("YYYY-MM-DD"))}
          </td>
          <td className="py-[16px] px-[24px]">
            {formatData(dayjs(staff?.dueDate)?.format("YYYY-MM-DD"))}
          </td>
          <td className="flex items-center whitespace-nowrap px-6 py-4">
            <button
              className={`mr-2 rounded-full px-3 py-2 ${getStatusStyle(
                staff?.status,
              )}`}
            >
              {getStatusText(staff?.status)}
            </button>
            <p
              onClick={() => handleOpenModal(staff?.id, staff?.status)}
              className="cursor-pointer font-semibold text-primary-700"
            >
              View details
            </p>
          </td>
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No invoices found.
              </p>
            </div>
          </td>
        </tr>
      );
    }
  }, [loading, filteredInvoices, formatData, currentPage, itemsPerPage]);

  return (
    <main className="font-outfit">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">All Invoices</h1>
          <Link
            to={`/admin/dashboard/all_staffs/view_profile/${staffEmail}/new_invoice`}
          >
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
              <img src={plus} alt="plus" />
              New Invoice
            </button.PrimaryButton>
          </Link>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full mt-4 border-collapse">
            <thead className="text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left whitespace-nowrap text-sm font-normal">
                  S/N
                </th>
                <th className="px-6 py-3 text-left text-sm whitespace-nowrap font-normal">
                  Invoice No.
                </th>
                <th className="px-6 py-3 text-left text-sm whitespace-nowrap font-normal">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm whitespace-nowrap font-normal">
                  Invoice Date
                </th>
                <th className="px-6 py-3 text-left text-sm whitespace-nowrap font-normal">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-sm whitespace-nowrap font-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>

        {!loading && filteredInvoices && filteredInvoices?.length > 0 && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={filteredInvoices?.length === itemsPerPage}
            />
          </div>
        )}
      </div>

      {isApproveModalOpen && selectedInvoiceId && (
        <ApproveInvoiceModal
          isOpen={isApproveModalOpen}
          onClose={handleCloseApproveModal}
          data-aos="zoom-in"
        >
          <ApproveInvoiceAdmin
            invoiceId={selectedInvoiceId}
            onClose={handleCloseApproveModal}
            staffInvoices={staffInvoices}
            onApproved={handleApproved}
            isSuperAdmin={isSuperAdmin}
          />
        </ApproveInvoiceModal>
      )}
      {isReceiptModalOpen && selectedInvoiceId && isSuperAdmin && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={handleCloseReceiptModal}
          data-aos="zoom-in"
        >
          <PaymentReceiptResponse invoiceId={selectedInvoiceId} />
        </Modal>
      )}
    </main>
  );
};

export default Invoices;
