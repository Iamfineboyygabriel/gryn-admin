// import { useEffect, useState } from "react";
// import { uploadApplication } from "../../../../../../../shared/redux/student/services/application.services";
// import FileUpload from "../../../payment/fileUpload/FileUpload";
// import { button } from "../../../../../../../shared/buttons/Button";
// import { DocumentType } from "../../../../../../../data/data";
// import { toast } from "react-toastify";
// import ReactLoading from "react-loading";

// const Masters = ({ onNext, applicationId }: any) => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const [resume, setResume] = useState<File | null>(null);
//   const [international_Passport, setInternational_Passport] =
//     useState<File | null>(null);
//   const [old_Level, setOld_Level] = useState<File | null>(null);
//   const [bachelor_Degree_Certificate, setBachelor_Degree_Certificate] =
//     useState<File | null>(null);
//   const [bachelor_Degree_Transcript, setBachelor_Degree_Transcript] =
//     useState<File | null>(null);
//   const [personal_Statement, setPersonal_Statement] = useState<File | null>(
//     null,
//   );
//   const [refrence_Letter1, setRefrence_Letter1] = useState<File | null>(null);
//   const [refrence_Letter2, setRefrence_Letter2] = useState<File | null>(null);

//   const [loading, setLoading] = useState(false);

//   const handleBrowseFileClick = async (inputId: string): Promise<void> => {
//     const inputElement = document.getElementById(inputId) as HTMLInputElement;
//     if (inputElement) {
//       inputElement.click();
//     }
//   };

//   const submitDocument = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setLoading(true);

//     try {
//       const endpoint = `/media/application/upload-doc/${applicationId}`;

//       const uploadDocument = async (
//         file: File | null,
//         documentType: string,
//       ) => {
//         if (file) {
//           const form = new FormData();
//           form.append("file", file);
//           form.append("documentType", documentType);
//           const response = await uploadApplication(endpoint, form);
//           return response;
//         }
//         return null;
//       };

//       const responses = [
//         resume
//           ? {
//               type: DocumentType.RESUME,
//               response: await uploadDocument(resume, DocumentType.RESUME),
//             }
//           : null,
//         international_Passport
//           ? {
//               type: DocumentType.INTERNATIONAL_PASSPORT,
//               response: await uploadDocument(
//                 international_Passport,
//                 DocumentType.INTERNATIONAL_PASSPORT,
//               ),
//             }
//           : null,
//         old_Level
//           ? {
//               type: DocumentType.OLD_LEVEL,
//               response: await uploadDocument(old_Level, DocumentType.OLD_LEVEL),
//             }
//           : null,
//         bachelor_Degree_Certificate
//           ? {
//               type: DocumentType.BACHELOR_DEGREE_CERTIFICATE,
//               response: await uploadDocument(
//                 bachelor_Degree_Certificate,
//                 DocumentType.BACHELOR_DEGREE_CERTIFICATE,
//               ),
//             }
//           : null,
//         bachelor_Degree_Transcript
//           ? {
//               type: DocumentType.BACHELOR_DEGREE_TRANSCRIPT,
//               response: await uploadDocument(
//                 bachelor_Degree_Transcript,
//                 DocumentType.BACHELOR_DEGREE_TRANSCRIPT,
//               ),
//             }
//           : null,
//         personal_Statement
//           ? {
//               type: DocumentType.PERSONAL_STATEMENT,
//               response: await uploadDocument(
//                 personal_Statement,
//                 DocumentType.PERSONAL_STATEMENT,
//               ),
//             }
//           : null,
//         refrence_Letter1
//           ? {
//               type: DocumentType.REFERENCE_LETTER1,
//               response: await uploadDocument(
//                 refrence_Letter1,
//                 DocumentType.REFERENCE_LETTER1,
//               ),
//             }
//           : null,
//         refrence_Letter2
//           ? {
//               type: DocumentType.REFERENCE_LETTER2,
//               response: await uploadDocument(
//                 refrence_Letter2,
//                 DocumentType.REFERENCE_LETTER2,
//               ),
//             }
//           : null,
//       ].filter(Boolean);

//       const allSuccessful = responses.every(
//         ({ response }: any) => response?.status === 201,
//       );

//       if (allSuccessful) {
//         onNext();
//       } else {
//         responses.forEach(({ type, response }: any) => {
//           if (response?.status !== 201) {
//             toast.error(`Failed to upload ${type}. Please try again.`);
//           }
//         });
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="font-outfit">
//       <form onSubmit={submitDocument}>
//         <div className="mt-[1.5em] grid w-[80%] grid-cols-2 gap-8">
//           <FileUpload
//             label="C/V"
//             inputId="serviceChargeFile"
//             file={resume}
//             setFile={setResume}
//             onFileChange={(file) => setResume(file)}
//             onBrowseClick={handleBrowseFileClick}
//             asterisk
//           />
//           <FileUpload
//             label="International Passport"
//             inputId="internationalPassportFile"
//             file={international_Passport}
//             setFile={setInternational_Passport}
//             onFileChange={(file) => setInternational_Passport(file)}
//             onBrowseClick={handleBrowseFileClick}
//             asterisk
//           />
//           <FileUpload
//             label="WAEC/NECO Certificate"
//             inputId="oLevelFile"
//             file={old_Level}
//             setFile={setOld_Level}
//             onFileChange={(file) => setOld_Level(file)}
//             onBrowseClick={handleBrowseFileClick}
//             asterisk
//           />
//           <FileUpload
//             label="Bachelor's Degree Certificate"
//             inputId="bachelorsCertificateFile"
//             file={bachelor_Degree_Certificate}
//             setFile={setBachelor_Degree_Certificate}
//             onFileChange={(file) => setBachelor_Degree_Certificate(file)}
//             onBrowseClick={handleBrowseFileClick}
//             asterisk
//           />
//           <FileUpload
//             label="Bachelor's Degree Transcript"
//             inputId="bachelorsTranscriptFile"
//             file={bachelor_Degree_Transcript}
//             setFile={setBachelor_Degree_Transcript}
//             onFileChange={(file) => setBachelor_Degree_Transcript(file)}
//             onBrowseClick={handleBrowseFileClick}
//             asterisk
//           />
//           <FileUpload
//             label="Personal Statement File"
//             inputId="personalStatementFile"
//             file={personal_Statement}
//             setFile={setPersonal_Statement}
//             onFileChange={(file) => setPersonal_Statement(file)}
//             onBrowseClick={handleBrowseFileClick}
//             asterisk
//           />
//           <FileUpload
//             label="Refrence Letter 1"
//             inputId="refrenceLetterOneFile"
//             file={refrence_Letter1}
//             setFile={setRefrence_Letter1}
//             onFileChange={(file) => setRefrence_Letter1(file)}
//             onBrowseClick={handleBrowseFileClick}
//             asterisk
//           />
//           <FileUpload
//             label="Refrence Letter 2"
//             inputId="refrenceLetterTwoFile"
//             file={refrence_Letter2}
//             setFile={setRefrence_Letter2}
//             onFileChange={(file) => setRefrence_Letter2(file)}
//             onBrowseClick={handleBrowseFileClick}
//             asterisk
//           />
//         </div>
//         <button.PrimaryButton
//           className="mt-[5em] flex w-[30%] justify-center gap-2 rounded-full bg-linear-gradient py-[12px] text-center font-medium text-white"
//           type="submit"
//           disabled={loading}
//         >
//           {loading ? (
//             <div className="mr-auto flex">
//               <ReactLoading
//                 color="#FFFFFF"
//                 width={25}
//                 height={25}
//                 type="spin"
//               />
//             </div>
//           ) : (
//             "Submit Application"
//           )}
//         </button.PrimaryButton>
//       </form>
//     </main>
//   );
// };

// export default Masters;

const Masters = ({ onNext, applicationId }: any) => {
  return <div>Masters</div>;
};

export default Masters;
