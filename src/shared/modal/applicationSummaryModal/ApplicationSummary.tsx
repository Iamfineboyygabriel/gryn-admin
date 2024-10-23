import React, { useState, useEffect } from 'react';
import { button } from "../../buttons/Button";
import ApprovalSuccess from "../ApprovalSuccess";
import MessageSent from "../applicationSummaryModal/Success";
import SendMessage from "./SendMessage";
import approve from "../../../assets/svg/Approved.svg";
import reject from "../../../assets/svg/Rejected.svg";
import { LuEye } from "react-icons/lu";
import ReactLoading from "react-loading";
import { PrivateElement } from '../../redux/hooks/admin/PrivateElement';

interface Document {
  id: string;
  name: string;
  documentType: string;
  status?: 'APPROVED' | 'REJECTED' | 'PENDING';
}

interface ApplicationSummaryProps {
  onClose: () => void;
  documents: Document[];
  onApprove: () => Promise<{ status: number }>;
  onReject: () => Promise<{ status: number }>;
  approvalType: 'agent' | 'student';
  approvalError: string | null;
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  onClose,
  documents,
  onApprove,
  onReject,
  approvalType,
  approvalError
}) => {
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([]);
  const [approveLoading, setApproveLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [showMessageSent, setShowMessageSent] = useState(false);
  const [isDocumentsVisible, setIsDocumentsVisible] = useState(false);
  const [error, setError] = useState<string | null>(approvalError);
  const [actionTaken, setActionTaken] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    setError(approvalError);
  }, [approvalError]);

  const toggleDocumentsVisibility = () => {
    setIsDocumentsVisible(!isDocumentsVisible);
  };

  const resetState = () => {
    setShowApprovalSuccess(false);
    setShowSendMessage(false);
    setShowMessageSent(false);
    setError(null);
    setActionTaken(null);
  };

  const handleApprove = async () => {
    resetState();
    setApproveLoading(true);
    setActionTaken('approve');
    try {
      const response = await onApprove();
      if (response.status === 200) {
        setShowApprovalSuccess(true);
      } else {
        throw new Error('Approval failed');
      }
    } catch (error) {
      console.error('Approval failed:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setApproveLoading(false);
    }
  };

  const handleDecline = async () => {
    resetState();
    setDeclineLoading(true);
    setActionTaken('reject');
    try {
      const response = await onReject();
      if (response.status === 200) {
        setShowSendMessage(true);
      } else {
        throw new Error('Decline failed');
      }
    } catch (error) {
      console.error('Decline failed:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setDeclineLoading(false);
    }
  };

  const handleSendMessageSubmit = () => {
    setShowSendMessage(false);
    setShowMessageSent(true);
  };

  if (showApprovalSuccess) {
    return <ApprovalSuccess onClose={onClose} approvalType={approvalType} />;
  }

  // if (showSendMessage) {
  //   return <SendMessage onClose={() => setShowSendMessage(false)} onSubmit={handleSendMessageSubmit} />;
  // }

  if (showMessageSent) {
    return <MessageSent onClose={onClose} />;
  }

  return (
    <main className="px-[4em] font-outfit">
      <div className="m-auto w-[26em]">
        <header className="flex flex-col">
          <h1 className="m-auto text-2xl font-semibold">Application Summary</h1>
          <div className="mt-[1em] text-center font-light text-grey">
            <p>Kindly Preview The Application Response</p>
            <p>Before Proceeding.</p>
          </div>
        </header>
        <div className="mt-[1em] flex flex-col gap-[1em]">
          <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <p>Personal Details</p>
          </button>
          <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <p>Bank Details</p>
          </button>
          <div className="h-auto w-full gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <button
              className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium"
              onClick={toggleDocumentsVisibility}
            >
              <p>Uploaded Documents</p>
              <LuEye className="text-primary-700" size={20} />
            </button>

            {isDocumentsVisible && (
              <div
                style={{ maxHeight: '200px' }}
                className="mt-[1em] flex overflow-y-auto flex-col gap-[1em]"
              >
                {documents.map((doc: Document, index: number) => (
                  <div key={index} className="flex w-full items-center justify-between rounded-lg border-2 bg-white px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <p>{doc.documentType}</p>
                    </div>
                    <img
                      src={doc.status === 'APPROVED' ? approve : reject}
                      alt={doc.status?.toLowerCase() || 'pending'}
                    />
                    {expandedDocuments.includes(doc.id) && (
                      <p className="mt-2">{doc.name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="flex justify-between gap-4">
            <button.PrimaryButton
              className="rounded-full cursor-pointer bg-error px-[3em] py-[8px] text-center font-medium text-white"
              onClick={onClose}
              disabled={declineLoading || approveLoading}
            >
              {declineLoading ? (
                <ReactLoading
                  color="#FFFFFF"
                  width={25}
                  height={25}
                  type="spin"
                />
              ) : (
                "Back"
              )}
            </button.PrimaryButton>
            
            <PrivateElement feature="ALL_USERS" page="Approve/Reject Agents">
            <button.PrimaryButton
              onClick={handleApprove}
              className="rounded-full cursor-pointer bg-linear-gradient px-[4em] py-[8px] text-center font-medium text-white"
              disabled={approveLoading || declineLoading}
            >
              {approveLoading ? (
                <div className='flex flex-start text-start justify-start mr-auto'>
                  <ReactLoading
                    color="#FFFFFF"
                    width={25}
                    height={25}
                    type="spin"
                  />
                </div>
              ) : (
                "Approve"
              )}
            </button.PrimaryButton>
             </PrivateElement>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ApplicationSummary;