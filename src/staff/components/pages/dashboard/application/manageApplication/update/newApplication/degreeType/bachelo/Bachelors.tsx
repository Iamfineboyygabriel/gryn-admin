// import { useEffect, useState } from "react";
// import { uploadApplication } from "../../../../../../../shared/redux/student/services/application.services";
// import FileUpload from "../../../payment/fileUpload/FileUpload";
// import { button } from "../../../../../../../shared/buttons/Button";
// import { toast } from "react-toastify";
// import { DocumentType } from "../../../../../../../data/data";
// import ReactLoading from "react-loading";

// const Bachelors = ({ onNext, applicationId }: any) => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const [resume, setResume] = useState<File | null>(null);
//   const [international_Passport, setInternational_Passport] =
//     useState<File | null>(null);
//   const [old_Level, setOld_Level] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleBrowseFileClick = (inputId: string): void => {
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
//     <main>
//       <form onSubmit={submitDocument}>
//         <div className="mt-[1.5em] grid w-[80%] grid-cols-2 gap-8">
//           <FileUpload
//             label="C/V"
//             inputId="resumeFile"
//             file={resume}
//             setFile={setResume}
//             onFileChange={(file) => setResume(file)}
//             onBrowseClick={async () => handleBrowseFileClick("resumeFile")}
//             asterisk
//           />

//           <FileUpload
//             label="International Passport"
//             inputId="internationalPassportFile"
//             file={international_Passport}
//             setFile={setInternational_Passport}
//             onFileChange={(file) => setInternational_Passport(file)}
//             onBrowseClick={async () =>
//               handleBrowseFileClick("internationalPassportFile")
//             }
//             asterisk
//           />

//           <FileUpload
//             label="WAEC/NECO Certificate"
//             inputId="oldLevelFile"
//             file={old_Level}
//             setFile={setOld_Level}
//             onFileChange={(file) => setOld_Level(file)}
//             onBrowseClick={async () => handleBrowseFileClick("oldLevelFile")}
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

// export default Bachelors;

const Bachelors = ({ onNext, applicationId }: any) => {
  return <div>Bachelors</div>;
};

export default Bachelors;
