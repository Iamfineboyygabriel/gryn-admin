import React, { useState } from 'react';
import { button } from "../../buttons/Button";
import { LuEye } from "react-icons/lu";
import approve from "../../../assets/svg/Approved.svg";
import reject from "../../../assets/svg/Rejected.svg";

interface Document {
  id: string;
  name: string;
  documentType: string;
}

interface ApplicationSummaryProps {
  onClose: () => void;
  documents: Document[];
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}
const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
  onClose,
  documents,
 onApprove,
  onReject
}) => {
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([]);

  const toggleDocumentExpansion = (docId: string) => {
    setExpandedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

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
              {documents.map((doc: any, index: number) => (
                <div key={index} className="flex w-full items-center justify-between rounded-lg border-2 bg-white px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <p>{doc.documentType}</p>
                  </div>
                  <img 
                    src={doc.status === 'APPROVED' ? approve : reject} 
                    alt={doc.status?.toLowerCase()} 
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
              onClick={onReject}
            >
              Decline
            </button.PrimaryButton>
            <button.PrimaryButton  onClick={onApprove} className="rounded-full cursor-pointer bg-linear-gradient px-[4em] py-[8px] text-center font-medium text-white">
            Approve
            </button.PrimaryButton>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ApplicationSummary;





// import React, { useState } from 'react';
// import { button } from "../../buttons/Button"; // Adjust import path if necessary
// import { LuEye } from "react-icons/lu";
// import approve from "../../../assets/svg/Approved.svg";
// import reject from "../../../assets/svg/Rejected.svg";

// interface Document {
//   id: string;
//   name: string;
//   documentType: string;
// }

// interface PersonalDetails {
//   name?: string;
//   email?: string;
//   // Add more fields as necessary
// }

// interface Degree {
//   name?: string;
//   university?: string;
//   // Add more fields as necessary
// }

// interface ApplicationSummaryProps {
//   onClose: () => void;
//   documents: Document[];
//   // personalDetails: PersonalDetails;
//   // degree: Degree;
//   onApprove: () => Promise<void>;
//   onReject: () => Promise<void>;
// }

// const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({
//   onClose,
//   documents,
//   // personalDetails,
//   // degree,
//   onApprove,
//   onReject
// }) => {
  // const [expandedDocuments, setExpandedDocuments] = useState<string[]>([]);

  // const toggleDocumentExpansion = (docId: string) => {
  //   setExpandedDocuments((prev) =>
  //     prev.includes(docId)
  //       ? prev.filter((id) => id !== docId)
  //       : [...prev, docId]
  //   );
  // };

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
//           <div>
//             <h3 className="text-xl font-semibold mb-2">Uploaded Documents</h3>
//             {documents.map((doc) => (
//               <div key={doc.id} className="mb-2">
//                 <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
//                   <span>{doc.documentType}</span>
//                   <button 
//                     onClick={() => toggleDocumentExpansion(doc.id)}
//                     className="flex items-center text-blue-600"
//                   >
//                     <LuEye className="mr-1" />
//                     {expandedDocuments.includes(doc.id) ? 'Hide' : 'View'}
//                   </button>
//                 </div>
//                 {expandedDocuments.includes(doc.id) && (
//                   <div className="mt-2 ml-4">
//                     <p>{doc.name}</p>
//                     {/* Add more document details here if available */}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-between mt-8">
//             <button.PrimaryButton
//               onClick={onReject}
//               className="flex items-center px-6 py-2 bg-red-100 text-red-600 rounded-full"
//             >
//               <img src={reject} alt="reject_icon" className="mr-2" />
//               Decline
//             </button.PrimaryButton>
//             <button.PrimaryButton
//               onClick={onApprove}
//               className="flex items-center px-6 py-2 bg-green-500 text-white rounded-full"
//             >
//               <img src={approve} alt="approve_icon" className="mr-2" />
//               Approve
//             </button.PrimaryButton>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ApplicationSummary;
