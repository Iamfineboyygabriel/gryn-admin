import React from "react";
import { button } from "../../../../../../shared/buttons/Button";
import upload from "../../../../../../assets/svg/Upload.svg";
import fileImg from "../../../../../../assets/svg/File.svg";
import { CgAsterisk } from "react-icons/cg";

interface FileUploadProps {
  label: string;
  inputId: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  onFileChange: (
    file: File | null,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
  ) => void;
  onBrowseClick: (inputId: string) => Promise<void>;
  asterisk?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  inputId,
  file,
  setFile,
  onFileChange,
  onBrowseClick,
  asterisk = false,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileChange(files[0], setFile);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="flex-start text-l flex font-medium">
        {label}
        {asterisk && <CgAsterisk className="ml-1 text-red-500" />}
      </label>
      <div className="mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[2em] py-2">
        <input
          type="file"
          accept=".png,.jpeg,.jpg,.doc,.docx,.pdf"
          multiple
          className="hidden"
          id={inputId}
          onChange={handleFileChange}
        />
        <label
          htmlFor={inputId}
          className="flex flex-grow cursor-pointer flex-col"
        >
          {file ? (
            <div className="flex gap-2">
              <img src={fileImg} alt="file_image" />
              <div className="flex flex-col gap-2">
                <p className="text-lg font-light">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : (
            <>
              <img src={fileImg} alt="file" className="mb-3 w-[18px]" />
              <p className="text-sm font-normal">Max file size: 25MB</p>
            </>
          )}
        </label>
        <button.PrimaryButton
          className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary-700 p-[10px] text-white"
          onClick={() => onBrowseClick(inputId)}
        >
          <img src={upload} alt="upload icon" />
          Browse file
        </button.PrimaryButton>
      </div>
    </div>
  );
};

export default FileUpload;
