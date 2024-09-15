// import React, { useState } from 'react';
// import { button } from "../../buttons/Button";
// import AgentApproved from "../AgentApproved";
// import MessageSent from "../applicationSummaryModal/Success";
// import SendMessage from "../applicationSummaryModal/SendMessage";
// import approve from "../../../assets/svg/Approved.svg";
// import reject from "../../../assets/svg/Rejected.svg";
// import { LuEye } from "react-icons/lu";
// import ReactLoading from "react-loading";

// interface Document {
//   id: string;
//   name: string;
//   documentType: string;
//   status?: 'APPROVED' | 'REJECTED' | 'PENDING';
// }

// interface ApplicationSummaryProps {
//   onClose: () => void;
//   documents: Document[];
//   onApprove: () => Promise<void>;
//   onReject: () => Promise<void>;
// }

// const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
//   onClose,
//   documents,
//   onApprove,
//   onReject
// }) => {
//   const [expandedDocuments, setExpandedDocuments] = useState<string[]>([]);
//   const [approveLoading, setApproveLoading] = useState(false);
//   const [declineLoading, setDeclineLoading] = useState(false);
//   const [showAgentApproved, setShowAgentApproved] = useState(false);
//   const [showSendMessage, setShowSendMessage] = useState(false);
//   const [showMessageSent, setShowMessageSent] = useState(false);

//   const toggleDocumentExpansion = (docId: string) => {
//     setExpandedDocuments((prev) =>
//       prev.includes(docId)
//         ? prev.filter((id) => id !== docId)
//         : [...prev, docId]
//     );
//   };

//   const handleApprove = async () => {
//     setApproveLoading(true);
//     try {
//       await onApprove();
//       setShowAgentApproved(true);
//     } catch (error) {
//       console.error('Approval failed:', error);
//     } finally {
//       setApproveLoading(false);
//     }
//   };

//   const handleDecline = async () => {
//     setDeclineLoading(true);
//     try {
//       await onReject();
//       setShowSendMessage(true);
//     } catch (error) {
//       console.error('Decline failed:', error);
//     } finally {
//       setDeclineLoading(false);
//     }
//   };

//   const handleSendMessageSubmit = () => {
//     setShowSendMessage(false);
//     setShowMessageSent(true);
//   };

//   if (showAgentApproved) {
//     return <AgentApproved onClose={onClose} />;
//   }

//   if (showSendMessage) {
//     return <SendMessage onClose={() => setShowSendMessage(false)} onSubmit={handleSendMessageSubmit} />;
//   }

//   if (showMessageSent) {
//     return <MessageSent onClose={onClose} />;
//   }

//   return (
//     <main className="px-[4em] font-outfit">
//       <div className="m-auto w-[26em]">
//         <header className="flex flex-col">
//           <h1 className="m-auto text-2xl font-semibold">Application Summary</h1>
//           <div className="mt-[1em] text-center font-light text-grey">
//             <p>Kindly Preview The Application Response</p>
//             <p>Before Proceeding.</p>
//           </div>
//         </header>
//         <div className="mt-[1em] flex flex-col gap-[1em]">
//           <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
//             <p>Personal Details</p>
//           </button>
//           <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
//             <p>Degree</p>
//           </button>
//           <div className="h-auto w-full gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
//             <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
//               <p>Uploaded Documents</p>
//               <LuEye className="text-primary-700" size={20} />
//             </button>
//             <div className="mt-[1em] flex flex-col gap-[1em]">
//               {documents.map((doc: Document, index: number) => (
//                 <div key={index} className="flex w-full items-center justify-between rounded-lg border-2 bg-white px-4 py-3 text-sm">
//                   <div className="flex items-center gap-3">
//                     <p>{doc.documentType}</p>
//                   </div>
//                   <img 
//                     src={doc.status === 'APPROVED' ? approve : reject} 
//                     alt={doc.status?.toLowerCase() || 'pending'} 
//                   />
//                   {expandedDocuments.includes(doc.id) && (
//                     <p className="mt-2">{doc.name}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="flex justify-between gap-4">
//             <button.PrimaryButton
//               className="rounded-full cursor-pointer bg-error px-[3em] py-[8px] text-center font-medium text-white"
//               onClick={handleDecline}
//               disabled={declineLoading || approveLoading}
//             >
//               {declineLoading ? (
//                 <ReactLoading
//                   color="#FFFFFF"
//                   width={25}
//                   height={25}
//                   type="spin"
//                 />
//               ) : (
//                 "Decline"
//               )}
//             </button.PrimaryButton>
//             <button.PrimaryButton
//               onClick={handleApprove}
//               className="rounded-full cursor-pointer bg-linear-gradient px-[4em] py-[8px] text-center font-medium text-white"
//               disabled={approveLoading || declineLoading}
//             >
//               {approveLoading ? (
//                 <ReactLoading
//                   color="#FFFFFF"
//                   width={25}
//                   height={25}
//                   type="spin"
//                 />
//               ) : (
//                 "Approve"
//               )}
//             </button.PrimaryButton>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ApplicationSummary;


import React, { useState } from 'react';
import { button } from "../../buttons/Button";
import ApprovalSuccess from "../ApprovalSuccess";
import MessageSent from "../applicationSummaryModal/Success";
import SendMessage from "./SendMessage";
import approve from "../../../assets/svg/Approved.svg";
import reject from "../../../assets/svg/Rejected.svg";
import { LuEye } from "react-icons/lu";
import ReactLoading from "react-loading";

interface Document {
  id: string;
  name: string;
  documentType: string;
  status?: 'APPROVED' | 'REJECTED' | 'PENDING';
}

interface ApplicationSummaryProps {
  onClose: () => void;
  documents: Document[];
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  approvalType: 'agent' | 'student';
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  onClose,
  documents,
  onApprove,
  onReject,
  approvalType
}) => {
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([]);
  const [approveLoading, setApproveLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [showMessageSent, setShowMessageSent] = useState(false);

  const toggleDocumentExpansion = (docId: string) => {
    setExpandedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleApprove = async () => {
    setApproveLoading(true);
    try {
      await onApprove();
      setShowApprovalSuccess(true);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setApproveLoading(false);
    }
  };

  const handleDecline = async () => {
    setDeclineLoading(true);
    try {
      await onReject();
      setShowSendMessage(true);
    } catch (error) {
      console.error('Decline failed:', error);
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

  if (showSendMessage) {
    return <SendMessage onClose={() => setShowSendMessage(false)} onSubmit={handleSendMessageSubmit} />;
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
            <p>Personal Details</p>
          </button>
          <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <p>Degree</p>
          </button>
          <div className="h-auto w-full gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
            <button className="flex w-full items-center justify-between gap-3 rounded-lg border-2 bg-grey-light px-4 py-3 font-medium">
              <p>Uploaded Documents</p>
              <LuEye className="text-primary-700" size={20} />
            </button>
            <div className="mt-[1em] flex flex-col gap-[1em]">
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
          </div>
          <div className="flex justify-between gap-4">
            <button.PrimaryButton
              className="rounded-full cursor-pointer bg-error px-[3em] py-[8px] text-center font-medium text-white"
              onClick={handleDecline}
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
                "Decline"
              )}
            </button.PrimaryButton>
            <button.PrimaryButton
              onClick={handleApprove}
              className="rounded-full cursor-pointer bg-linear-gradient px-[4em] py-[8px] text-center font-medium text-white"
              disabled={approveLoading || declineLoading}
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default ApplicationSummary;