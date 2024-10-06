import React, { useState, useEffect } from 'react';
import { approveInvoiceAdmin } from '../redux/shared/services/shareApplication.services';
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { button } from "../buttons/Button";
import { StaffInvoices } from '../../shared/redux/hooks/admin/getAdminProfile';

interface ApproveInvoiceAdminProps {
  invoiceId: any | null;
  onClose: () => void;
  staffInvoices: StaffInvoices | null;
}

const ApproveInvoiceAdmin: React.FC<ApproveInvoiceAdminProps> = ({ invoiceId, onClose, staffInvoices }) => {
  const [approveLoading, setApproveLoading] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  
  useEffect(() => {
    if (staffInvoices?.data && invoiceId) {
      if (Array.isArray(staffInvoices?.data)) {
        const foundInvoice = staffInvoices?.data.find(inv => inv?.id === invoiceId);
        if (foundInvoice) {
          setInvoice(foundInvoice);
        }
      } else if (staffInvoices?.data?.id === invoiceId) {
        setInvoice(staffInvoices?.data);
      }
    }
  }, [invoiceId, staffInvoices]);

  const handleApprove = async () => {
    if (invoiceId && invoice?.status === 'SUBMITTED') {
      try {
        setApproveLoading(true);
        await approveInvoiceAdmin(invoiceId);
        toast.success('Invoice approved successfully!');
        setInvoice({ ...invoice, status: 'APPROVED' });
      } catch (error: any) {
        toast.error(error.message || "An error occurred");
      } finally {
        setApproveLoading(false);
      }
    }
  };

  const isApproved = invoice?.status === 'APPROVED';

  return (
    <main className="font-outfit py-[2em]">
      <div className="m-auto w-[24em] py-[2em] text-center">
        <header>
          <h1 className="text-xl font-semibold">Invoice Details</h1>
        </header>
      
        <div className="mt-[2em] flex justify-between">
          <button.PrimaryButton
            onClick={onClose}
            className="bg-purple-white rounded-full w-[45%] py-[10px] text-center text-lg font-semibold text-primary-700"
          >
            Cancel
          </button.PrimaryButton>
          <button.PrimaryButton
            onClick={handleApprove}
            disabled={isApproved}
            className={`rounded-full w-[45%] text-center font-semibold ${
              isApproved
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-primary-700 text-white hover:bg-primary-800"
            }`}
          >
            {approveLoading ? (
              <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
            ) : isApproved ? (
              "Admin Approved"
            ) : (
              "Approve Payment"
            )}
          </button.PrimaryButton>
        </div>
      </div>
    </main>
  );
};

export default ApproveInvoiceAdmin;