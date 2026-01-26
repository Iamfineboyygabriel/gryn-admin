import React, { useState } from "react";
import { button } from "../../buttons/Button";
import ApprovalSuccess from "../ApprovalSuccess";
import approve from "../../../assets/svg/Approved.svg";
import { LuEye } from "react-icons/lu";
import ReactLoading from "react-loading";
import { PrivateElement } from "../../redux/hooks/admin/PrivateElement";

interface Document {
  id: string;
  name: string;
  documentType: string;
  status?: "APPROVED" | "REJECTED" | "PENDING";
}

interface ApplicationSummaryProps {
  onClose: () => void;
  documents: Document[];
  onApprove: () => Promise<{ status: number }>;
  onReject: () => Promise<{ status: number }>;
  approvalType: "agent" | "student";
  approvalError: string | null;
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  onClose,
  documents,
  onApprove,
  approvalType,
  approvalError,
}) => {
  const [approveLoading, setApproveLoading] = useState(false);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
  const [isDocumentsVisible, setIsDocumentsVisible] = useState(false);
  const [error, setError] = useState<string | null>(approvalError);

  const toggleDocumentsVisibility = () =>
    setIsDocumentsVisible((prev) => !prev);

  const handleApprove = async () => {
    setError(null);
    setApproveLoading(true);

    try {
      const response = await onApprove();

      if (response.status === 200) {
        setShowApprovalSuccess(true);
      } else {
        throw new Error("Approval failed");
      }
    } catch (err) {
      console.error("Approval failed:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setApproveLoading(false);
    }
  };

  if (showApprovalSuccess) {
    return <ApprovalSuccess onClose={onClose} approvalType={approvalType} />;
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
          <button className="flex w-full items-center justify-between rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            Personal Details
          </button>

          <button className="flex w-full items-center justify-between rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            Bank Details
          </button>

          {/* Documents */}
          <div className="w-full rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <button
              className="flex w-full items-center justify-between"
              onClick={toggleDocumentsVisibility}
            >
              <p>Uploaded Documents</p>
              <LuEye className="text-primary-700" size={20} />
            </button>

            {isDocumentsVisible && (
              <div
                style={{ maxHeight: "200px" }}
                className="mt-4 flex flex-col gap-3 overflow-y-auto"
              >
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border-2 bg-white px-4 py-3 text-sm"
                  >
                    <p>{doc.documentType}</p>
                    {doc.status === "APPROVED" && (
                      <img src={approve} alt="approved" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between gap-4">
            <button.PrimaryButton
              className="rounded-full bg-error px-[3em] py-[8px] text-white"
              onClick={onClose}
              disabled={approveLoading}
            >
              Back
            </button.PrimaryButton>

            <PrivateElement feature="ALL_USERS" page="Approve/Reject Agents">
              <button.PrimaryButton
                onClick={handleApprove}
                className="rounded-full bg-linear-gradient px-[4em] py-[8px] text-white"
                disabled={approveLoading}
              >
                {approveLoading ? (
                  <ReactLoading
                    color="#FFFFFF"
                    width={25}
                    height={25}
                    type="spin"
                  />
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
