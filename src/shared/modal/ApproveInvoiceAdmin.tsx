import React, { useState, useEffect } from 'react';
import { approveInvoiceAdmin, approveInvoiceSuperAdmin } from '../redux/shared/services/shareApplication.services';
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { button } from "../buttons/Button";
import { StaffInvoices } from '../../shared/redux/hooks/admin/getAdminProfile';

interface ApproveInvoiceAdminProps {
  invoiceId: any;
  onClose: () => void;
  staffInvoices: StaffInvoices | null;
  onApproved: (invoiceId: string) => void;
  isSuperAdmin: boolean;
}

const ApproveInvoiceAdmin: React.FC<ApproveInvoiceAdminProps> = ({ 
  invoiceId, 
  onClose, 
  staffInvoices, 
  onApproved,
  isSuperAdmin
}) => {
  const [approveLoading, setApproveLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  
  useEffect(() => {
    if (staffInvoices?.data && invoiceId) {
      if (Array.isArray(staffInvoices?.data.invoices)) {
        const foundInvoice = staffInvoices?.data.invoices.find(inv => inv?.id === invoiceId);
        if (foundInvoice) {
          setInvoice(foundInvoice);
        }
      } else if (staffInvoices?.data?.invoices.id === invoiceId) {
        setInvoice(staffInvoices?.data);
      }
    }
  }, [invoiceId, staffInvoices]);

  const handleApprove = async () => {
    if (invoiceId) {
      try {
        setApproveLoading(true);
        if (isSuperAdmin) {
          await approveInvoiceSuperAdmin(invoiceId);
          onApproved(invoiceId);
        } else {
          await approveInvoiceAdmin(invoiceId);
          setInvoice({ ...invoice, status: 'APPROVED' });
        }
        toast.success('Invoice approved successfully!');
      } catch (error: any) {
        toast.error(error.message || "An error occurred");
      } finally {
        setApproveLoading(false);
      }
    }
  };

  const isSubmitted = invoice?.status === 'SUBMITTED';
  const isApproved = invoice?.status === 'APPROVED';
  const isCompleted = invoice?.status === 'COMPLETED';

  const renderButton = () => {
    if (approveLoading) {
      return <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />;
    }
    if (isSubmitted) {
      return "Approve Payment";
    }

    if (isApproved) {
      return isSuperAdmin ? "Proceed" : "Admin Approved";
    }

    if (isCompleted) {
      return "Completed";
    }

    return "Unknown Status";
  };

  const handleButtonClick = () => {
    if (isSubmitted || (isSuperAdmin && isApproved)) {
      handleApprove();
    }
  };

  const isButtonDisabled = isCompleted || (!isSuperAdmin && isApproved);

  return (
    <main className="font-outfit py-[2em]">
      <div className="m-auto w-[24em] py-[em] text-center">
        <div className="mt-[2em] flex justify-between">
          <button.PrimaryButton
            onClick={onClose}
            className="bg-purple-white rounded-full w-[45%] py-[10px] text-center text-lg font-semibold text-primary-700"
          >
            Cancel
          </button.PrimaryButton>
          <button.PrimaryButton
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
            className={`rounded-full w-[45%] text-center font-semibold ${
              isButtonDisabled
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-primary-700 text-white hover:bg-primary-800"
            }`}
          >
            {renderButton()}
          </button.PrimaryButton>
        </div>
      </div>
    </main>
  );
};

export default ApproveInvoiceAdmin;