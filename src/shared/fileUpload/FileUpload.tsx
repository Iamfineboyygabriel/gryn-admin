// import React, { useState, useRef } from "react";
// import { button } from "../buttons/Button";
// import upload from "../../assets/svg/Upload.svg";
// import fileImg from "../../assets/svg/File.svg";
// import { CgAsterisk } from "react-icons/cg";
// import { AiOutlineEye } from "react-icons/ai";
// import { RxCrossCircled } from "react-icons/rx";
// import "react-toastify/dist/ReactToastify.css";
// import Modal from "react-modal";

// interface FileUploadProps {
//   label: string;
//   inputId: string;
//   file?: File | null; 
//   files?: File[];     
//   setFile?: React.Dispatch<React.SetStateAction<File | null>>;  
//   setFiles?: React.Dispatch<React.SetStateAction<File[]>>;      
//   onFileChange?: (
//     file: File | null,
//     setFile: React.Dispatch<React.SetStateAction<File | null>>,
//   ) => void;
//   onFilesChange?: (files: FileList) => void;  
//   onBrowseClick: (inputId: string) => Promise<void>;
//   multiple?: boolean; 
//   asterisk?: boolean;
//   labelClassName?: string;
//   error?: string;
//   success?: boolean;
// }

// const FileUpload: React.FC<FileUploadProps> = ({
//   label,
//   inputId,
//   file,
//   files = [],
//   setFile,
//   setFiles,
//   onFileChange,
//   onFilesChange,
//   onBrowseClick,
//   multiple = false,
//   asterisk = false,
//   labelClassName,
//   error,
//   success,
// }) => {
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [previewFile, setPreviewFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = event.target.files;
//     if (!selectedFiles || selectedFiles.length === 0) return;

//     if (multiple) {
//       if (onFilesChange) {
//         onFilesChange(selectedFiles);
//       } else if (setFiles) {
//         const newFiles = Array.from(selectedFiles);
//         setFiles(prevFiles => [...prevFiles, ...newFiles]);
//       }
//     } else {
//       const selectedFile = selectedFiles[0];
//       if (onFileChange && setFile) {
//         onFileChange(selectedFile, setFile);
//       } else if (setFile) {
//         setFile(selectedFile);
//       }
//     }
//   };

//   const handleFileUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handlePreview = (fileToPreview: File) => {
//     setPreviewFile(fileToPreview);
//     setIsPreviewOpen(true);
//   };

//   const renderFileContent = () => {
//     if (multiple && (files.length > 0)) {
//       return (
//         <div className="flex flex-col gap-2">
//           {files.map((f, index) => (
//             <div key={index} className="flex items-center gap-2">
//               <img src={fileImg} alt="file_image" className="w-[18px]" />
//               <div className="flex flex-grow flex-col">
//                 <p className="text-lg font-light truncate max-w-[170px]">{f.name}</p>
//                 <p className="text-xs text-gray-500 dark:text-white">
//                   {(f.size / 1024).toFixed(2)} KB
//                 </p>
//               </div>
//               <button type="button" onClick={() => handlePreview(f)} className="mr-2">
//                 <AiOutlineEye />
//               </button>
//               {setFiles && (
//                 <button 
//                   type="button" 
//                   onClick={() => setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))}
//                   className="mr-2"
//                 >
//                   <RxCrossCircled />
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       );
//     } else if (!multiple && file) {
//       return (
//         <div className="flex items-center gap-2">
//           <img src={fileImg} alt="file_image" className="w-[18px]" />
//           <div className="flex flex-grow flex-col">
//             <p className="text-lg font-light truncate max-w-[170px]">{file.name}</p>
//             <p className="text-xs text-gray-500 dark:text-white">
//               {(file.size / 1024).toFixed(2)} KB
//             </p>
//           </div>
//           <button type="button" onClick={() => handlePreview(file)} className="mr-4">
//             <AiOutlineEye />
//           </button>
//         </div>
//       );
//     } else {
//       return (
//         <>
//           <img src={fileImg} alt="file" className="mb-3 w-[18px]" />
//           <p className="text-sm font-normal">Max file size: 25MB</p>
//         </>
//       );
//     }
//   };

//   return (
//     <div className="w-full">
//       <label
//         htmlFor={inputId}
//         className={`flex-start text-l flex font-medium dark:text-white ${labelClassName}`}
//       >
//         {label}
//         {asterisk && <CgAsterisk className="ml-1 text-red-500" />}
//       </label>
//       <div className="dark:border-border mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[2em] py-2 dark:bg-gray-700">
//         <input
//           type="file"
//           accept=".png,.jpeg,.jpg,.doc,.docx,.pdf"
//           multiple={multiple}
//           className="hidden"
//           id={inputId}
//           ref={fileInputRef}
//           onChange={handleFileChange}
//         />
//         <div className="flex flex-grow flex-col dark:text-white">
//           {renderFileContent()}
//         </div>
//         <button.PrimaryButton
//           className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary-700 p-[10px] text-white dark:bg-gray-800"
//           onClick={handleFileUploadClick}
//         >
//           <img src={upload} alt="upload icon" />
//           Upload
//         </button.PrimaryButton>
//       </div>
//       {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//       {success && (
//         <p className="mt-1 text-sm text-green-500">Successfully uploaded</p>
//       )}
//       <Modal
//         isOpen={isPreviewOpen}
//         onRequestClose={() => setIsPreviewOpen(false)}
//         contentLabel="Document Preview"
//         className="absolute left-1/2 top-1/2 flex h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 transform flex-col justify-center rounded-lg bg-white p-4 shadow-lg"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//       >
//         <div className="flex flex-col items-center">
//           {previewFile && (
//             <iframe
//               src={URL.createObjectURL(previewFile)}
//               style={{ width: "80vw", height: "80vh" }}
//               title="Document Preview"
//             />
//           )}
//           <button
//             onClick={() => setIsPreviewOpen(false)}
//             className="mt-4 rounded-lg bg-gray-200 px-4 py-2"
//           >
//             Close
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default FileUpload;



import React, { useState, useRef } from "react";
import { button } from "../buttons/Button";
import upload from "../../assets/svg/Upload.svg";
import fileImg from "../../assets/svg/File.svg";
import { CgAsterisk } from "react-icons/cg";
import { AiOutlineEye } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

interface UploadedFile {
  name: string;
  publicURL: string;
  size?: number;
}

interface FileUploadProps {
  label: string;
  inputId: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  onFileChange: (file: File | null) => void;
  onBrowseClick: (inputId: string) => Promise<void>;
  asterisk?: boolean;
  labelClassName?: string;
  error?: string;
  success?: boolean;
  uploadedFile?: UploadedFile | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  inputId,
  file,
  setFile,
  onFileChange,
  onBrowseClick,
  asterisk = false,
  labelClassName,
  error,
  success,
  uploadedFile,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    onFileChange(selectedFile);
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePreview = () => {
    if (uploadedFile) {
      setPreviewUrl(uploadedFile.publicURL);
      setIsPreviewOpen(true);
    } else if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsPreviewOpen(true);
    }
  };

  const renderFileContent = () => {
    const displayFile = uploadedFile || (file ? { name: file.name, size: file.size } : null);

    if (displayFile) {
      return (
        <div className="flex items-center gap-2">
          <img src={fileImg} alt="file_image" className="w-[18px]" />
          <div className="flex flex-grow flex-col">
            <p className="text-lg font-light truncate max-w-[170px]">{displayFile.name}</p>
            {displayFile.size && (
              <p className="text-xs text-gray-500 dark:text-white">
                {(displayFile.size / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
          <button 
            type="button" 
            onClick={handlePreview}
            className="mr-2"
          >
            <AiOutlineEye />
          </button>
          {/* {!uploadedFile && (
            <button 
              type="button" 
              onClick={() => { setFile(null); onFileChange(null); }}
              className="mr-2"
            >
              <RxCrossCircled />
            </button>
          )} */}
        </div>
      );
    } else {
      return (
        <>
          <img src={fileImg} alt="file" className="mb-3 w-[18px]" />
          <p className="text-sm font-normal">Max file size: 25MB</p>
        </>
      );
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className={`flex-start text-l flex font-medium dark:text-white ${labelClassName}`}
      >
        {label}
        {asterisk && <CgAsterisk className="ml-1 text-red-500" />}
      </label>
      <div className="dark:border-border mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[2em] py-2 dark:bg-gray-700">
        <input
          type="file"
          accept=".png,.jpeg,.jpg,.doc,.docx,.pdf"
          className="hidden"
          id={inputId}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="flex flex-grow flex-col dark:text-white">
          {renderFileContent()}
        </div>
        <button.PrimaryButton
          className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary-700 p-[10px] text-white dark:bg-gray-800"
          onClick={handleFileUploadClick}
        >
          <img src={upload} alt="upload icon" />
          Upload
        </button.PrimaryButton>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {success && (
        <p className="mt-1 text-sm text-green-500">Successfully uploaded</p>
      )}
      <Modal
        isOpen={isPreviewOpen}
        onRequestClose={() => setIsPreviewOpen(false)}
        contentLabel="Document Preview"
        className="absolute left-1/2 top-1/2 flex h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 transform flex-col justify-center rounded-lg bg-white p-4 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="flex flex-col items-center">
          {previewUrl && (
            <iframe
              src={previewUrl}
              style={{ width: "80vw", height: "80vh" }}
              title="Document Preview"
            />
          )}
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="mt-4 rounded-lg bg-gray-200 px-4 py-2"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default FileUpload;