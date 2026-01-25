import React, { useState } from "react";
import { button } from "../../buttons/Button";
import MessageSent from "../applicationSummaryModal/Success";
import SendMessage from "./SendMessage";
import approve from "../../../assets/svg/Approved.svg";
import reject from "../../../assets/svg/Rejected.svg";
import { LuEye } from "react-icons/lu";

interface Document {
  id: string;
  name: string;
  documentType: string;
  remark?: "APPROVED" | "REJECTED" | "PENDING";
}

interface VisaApplicationSummaryProps {
  onClose: () => void;
  documents: any;
  userData: {
    firstName: any;
    lastName: any;
    userId: any;
  };
}

const VisaApplicationSummary: React.FC<VisaApplicationSummaryProps> = ({
  onClose,
  documents,
  userData,
}) => {
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([]);
  console.log(setExpandedDocuments);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [showMessageSent, setShowMessageSent] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);

  const handleSendMessageSubmit = () => {
    setShowSendMessage(false);
    setShowMessageSent(true);
  };

  const allDocumentsApproved = documents.every(
    (doc: any) => doc.remark === "APPROVED",
  );

  if (showSendMessage) {
    return (
      <SendMessage
        onClose={() => setShowSendMessage(false)}
        onSubmit={handleSendMessageSubmit}
        userData={userData}
      />
    );
  }

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
            <p>Personal Deatils</p>
          </button>
          <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <p>Deestination Details</p>
          </button>
          <div className="h-auto w-full gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <button
              className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium"
              onClick={() => setShowDocuments(!showDocuments)}
            >
              <p>Uploaded Documents</p>
              <LuEye className="text-primary-700" size={20} />
            </button>
            {showDocuments && (
              <div
                className="mt-[1em] flex flex-col gap-[1em] overflow-y-auto"
                style={{ maxHeight: "200px" }}
              >
                {documents.map((doc: Document, index: number) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-between rounded-lg border-2 bg-white px-4 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <p>{doc.documentType}</p>
                    </div>
                    <img
                      src={doc.remark === "APPROVED" ? approve : reject}
                      alt={doc.remark?.toLowerCase() || "pending"}
                    />
                    {expandedDocuments.includes(doc?.id) && (
                      <p className="mt-2">{doc?.name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between gap-4">
            <button.PrimaryButton
              onClick={onClose}
              className="rounded-full cursor-pointer bg-error px-[3em] py-[8px] text-center font-medium text-white"
            >
              Cancel
            </button.PrimaryButton>
            <button.PrimaryButton
              onClick={() => setShowSendMessage(true)}
              className="rounded-full cursor-pointer bg-linear-gradient px-[4em] py-[8px] text-center font-medium text-white"
            >
              {allDocumentsApproved ? "Submit Response" : "Continue"}
            </button.PrimaryButton>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VisaApplicationSummary;
