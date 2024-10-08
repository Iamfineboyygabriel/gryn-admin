import React, { useCallback, useState, useMemo } from "react";
import transaction from "../../../../../../../assets/svg/Transaction.svg";
import { Link } from "react-router-dom";
import { button } from "../../../../../../../shared/buttons/Button";
import plus from "../../../../../../../assets/svg/plus.svg";
import { useStaffDetails, useStaffInvoices } from '../../../../../../../shared/redux/hooks/admin/getAdminProfile';
import dayjs from "dayjs";
import Modal from "../../../../../../../shared/modal/Modal";
import ApproveInvoiceAdmin from "../../../../../../../shared/modal/ApproveInvoiceAdmin";

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 6 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

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
  status: "SUBMITTED" | "APPROVED";
}

const Invoices: React.FC<AssignedAgentsProps> = ({ staffEmail }) => {
  const { staffDetail } = useStaffDetails(staffEmail);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const handleOpenModal = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedInvoiceId(null);
    setModalOpen(false);
  };

  const staffId = staffDetail?.data?.profile?.userId;
  const { staffInvoices, loading } = useStaffInvoices(staffId || '');
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const itemsPerPage = 10;

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const filteredInvoices = useMemo(() => {
    if (!staffInvoices || !Array.isArray(staffInvoices.data)) return [];
    return staffInvoices.data.filter((staff: StaffData) =>
      staff.invoiceNumber?.toLowerCase().includes(localSearchTerm.toLowerCase())
    );
  }, [staffInvoices, localSearchTerm]);

  const getStatusStyle = (status: string) => {
    return status === "APPROVED"
      ? "bg-green-500 text-white"
      : "bg-yellow-500 text-white";
  };

  const getStatusText = (status: string) => {
    return status === "APPROVED" ? "Completed" : "In Progress";
  };

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array.from({ length: itemsPerPage }).map((_, index) => (
        <SkeletonRow key={index} />
      ));
    }

    if (filteredInvoices.length > 0) {
      return filteredInvoices.map((staff: StaffData, index: number) => (
        <tr key={staff.id} className="text-[14px] border-b border-gray-200 leading-[20px] text-grey-primary font-medium">
          <td className="py-[16px] px-[24px]">{index + 1}</td>
          <td className="py-[16px] px-[24px]">{formatData(staff.invoiceNumber)}</td>
          <td className="py-[16px] px-[24px]">{formatData(staff.amount)}</td>
          <td className="py-[16px] px-[24px]">{formatData(dayjs(staff.invoiceDate).format("YYYY-MM-DD"))}</td>
          <td className="py-[16px] px-[24px]">{formatData(dayjs(staff.dueDate).format("YYYY-MM-DD"))}</td>
          <td className="flex items-center whitespace-nowrap px-6 py-4">
            <button className={`mr-2 rounded-full px-3 py-2 ${getStatusStyle(staff.status)}`}>
              {getStatusText(staff.status)}
            </button>
            <p onClick={() => handleOpenModal(staff.id)} className="cursor-pointer font-semibold text-primary-700">
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
  }, [loading, filteredInvoices, formatData]);

  return (
    <main className="font-outfit">
      <div className="relative">
        <header className="flex items-center justify-between">
          <h1 className="font-semibold text-xl">All Invoices</h1>
          <Link to={`/admin/dashboard/all_staffs/view_profile/${staffEmail}/new_invoice`}>
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-primary-700 px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300">
              <img src={plus} alt="plus" />
              New Invoice
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
            {renderTableBody()}
          </tbody>
        </table>
      </div>
      {isModalOpen && selectedInvoiceId && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} data-aos="zoom-in">
          <ApproveInvoiceAdmin
            invoiceId={selectedInvoiceId}
            onClose={handleCloseModal}
            staffInvoices={staffInvoices}
          />
        </Modal>
      )}
    </main>
  );
};

export default Invoices;