import React, { useState, useRef } from "react";
import { button } from "../buttons/Button";
import upload from "../../assets/svg/Upload.svg";
import fileImg from "../../assets/svg/File.svg";
import { CgAsterisk } from "react-icons/cg";
import { AiOutlineEye } from "react-icons/ai";
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
  disabled?: boolean;
  originalFileName?: string; 
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
  disabled = false,
  originalFileName = "", 
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = event.target.files;
    if (files && files?.length > 0) {
      const selectedFile = event.target.files?.[0] || null;
      onFileChange(selectedFile);
    }
  };

  const handleFileUploadClick = () => {
    if (disabled) return;
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
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
    if (file) {
      return (
        <div className="flex items-center gap-2">
          <img src={fileImg} alt="file_image" className="w-[18px]" />
          <div className="flex flex-grow flex-col">
            <p className="text-lg font-light truncate max-w-[170px]">{file.name}</p>
            <p className="text-xs text-gray-500 dark:text-white">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <button 
            type="button" 
            onClick={handlePreview}
            className="mr-2"
          >
            <AiOutlineEye />
          </button>
        </div>
      );
    }
    else if (originalFileName) {
      return (
        <div className="flex items-center gap-2">
          <img src={fileImg} alt="file_image" className="w-[18px]" />
          <div className="flex flex-grow flex-col">
            <p className="text-lg font-light truncate max-w-[170px]">{originalFileName}</p>
          </div>
          {uploadedFile && (
            <button 
              type="button" 
              onClick={handlePreview}
              className="mr-2"
            >
              <AiOutlineEye />
            </button>
          )}
        </div>
      );
    }
    else {
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
        className={`flex-start text-l flex font-medium dark:text-white ${labelClassName} ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      >
        {label}
        {asterisk && <CgAsterisk className="ml-1 text-red-500" />}
      </label>
      <div 
        className={`mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[2em] py-2${
          disabled ? "opacity-50 py-2 cursor-not-allowed" : ""
        }`}
      >
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
          className={`flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary-700 p-[10px] text-white dark:bg-gray-800 ${
            disabled ? "cursor-not-allowed opacity-30" : ""
          }`}
          onClick={handleFileUploadClick}
          disabled={disabled}
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