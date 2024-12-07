import React, { useState, useEffect } from "react";
import { button } from "../../../../../../../shared/buttons/Button";
import upload from "../../../../../../../assets/svg/Upload.svg";
import fileImg from "../../../../../../../assets/svg/File.svg";
import Modal from "react-modal";
import ConfirmDiscard from "../../../../../../../shared/modal/ConfirmDiscard";
import DocumentPreviewModal from "../../../../../../../shared/modal/DocumentPreviewModal";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { AiOutlineEye } from "react-icons/ai";
import { useStaffDetails } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import { updateStaffRegistrationDocument } from "../../../../../../../shared/redux/shared/services/shareApplication.services";

Modal.setAppElement("#root");

const SkeletonRow: React.FC = () => (
  <div className="mb-4 animate-pulse space-y-4">
    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
    <div className="h-12 w-full rounded bg-gray-200"></div>
  </div>
);

interface UploadedDocumentsProps {
  staffEmail: any;
}

interface DocumentType {
  id: string;
  documentType: string;
  name: string;
  publicURL: string;
}

const UploadedDocuments: React.FC<UploadedDocumentsProps> = ({
  staffEmail,
}) => {
  const { staffDetail, loading: documentsLoading } =
    useStaffDetails(staffEmail);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");

  const MAX_FILE_NAME_LENGTH = 15;

  useEffect(() => {
    if (staffDetail?.data?.staffRegistrationDoc) {
      const documentFiles = staffDetail.data.staffRegistrationDoc.reduce(
        (acc: { [key: string]: File | null }, doc: DocumentType) => {
          acc[doc.documentType] = null;
          return acc;
        },
        {}
      );

      const documentNames = staffDetail.data.staffRegistrationDoc.reduce(
        (acc: { [key: string]: string }, doc: DocumentType) => {
          acc[doc.documentType] = doc.name;
          return acc;
        },
        {}
      );
      setFiles(documentFiles);
      setFileNames(documentNames);
    }
  }, [staffDetail?.data?.staffRegistrationDoc]);

  const handleFileChange =
    (documentType: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!editMode) return;
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        if (selectedFile.name.length > MAX_FILE_NAME_LENGTH) {
          toast.error(
            `File name too long. Maximum length is ${MAX_FILE_NAME_LENGTH} characters.`
          );
          return;
        }

        setFiles((prevFiles) => ({
          ...prevFiles,
          [documentType]: selectedFile,
        }));
        setFileNames((prevNames) => ({
          ...prevNames,
          [documentType]: selectedFile.name,
        }));
      }
    };

  const handleUploadClick = (documentType: string) => () => {
    if (!editMode) return;
    const inputElement = document.getElementById(
      documentType
    ) as HTMLInputElement;
    inputElement?.click();
  };

  const updateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const successfulUploads: string[] = [];
    const failedUploads: string[] = [];

    try {
      await Promise.all(
        Object.entries(files).map(async ([documentType, file]) => {
          const doc = staffDetail?.data?.staffRegistrationDoc?.find(
            (d) => d?.documentType === documentType
          );
          if (file && doc) {
            try {
              const form = new FormData();
              form.append("file", file);
              const endpoint = `/media/registration/upload-doc/${doc?.id}`;
              const response = await updateStaffRegistrationDocument(
                endpoint,
                form
              );
              if (response?.status === 201) {
                successfulUploads.push(documentType);
              } else {
                failedUploads.push(documentType);
              }
            } catch (error) {
              failedUploads.push(documentType);
            }
          }
        })
      );

      if (successfulUploads.length > 0) {
        toast.success(`Successfully uploaded: ${successfulUploads.join(", ")}`);
      }
      if (failedUploads.length > 0) {
        toast.error(`Failed to upload: ${failedUploads.join(", ")}`);
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleDiscardChanges = () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmDiscardChanges = () => {
    if (staffDetail?.data?.staffRegistrationDoc) {
      const documentFiles = staffDetail.data.staffRegistrationDoc.reduce(
        (acc: { [key: string]: File | null }, doc: DocumentType) => {
          acc[doc.documentType] = null;
          return acc;
        },
        {}
      );

      const documentNames = staffDetail.data.staffRegistrationDoc.reduce(
        (acc: { [key: string]: string }, doc: DocumentType) => {
          acc[doc.documentType] = doc.name;
          return acc;
        },
        {}
      );

      setFiles(documentFiles);
      setFileNames(documentNames);
    }
    setEditMode(false);
    setIsConfirmDialogOpen(false);
  };

  const getFileTypeFromUrl = (url: string) => {
    const segments = url.split("/");
    const fileExtension = segments[segments.length - 1]
      .split(".")
      .pop()
      ?.toLowerCase();
    switch (fileExtension) {
      case "pdf":
        return "application/pdf";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      default:
        return "application/octet-stream";
    }
  };

  const handlePreview = (url: string) => {
    const fileType = getFileTypeFromUrl(url);
    if (fileType === "application/pdf") {
      url += "&viewer=pdf";
    }
    setPreviewUrl(url);
    setPreviewFileType(fileType);
    setIsPreviewOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewFileType("");
  };

  if (documentsLoading) {
    return (
      <main className="font-outfit">
        <header>
          <h2 className="text-xl font-semibold dark:text-white">
            Uploaded Documents
          </h2>
        </header>
        <div className="mt-[2em] grid w-[85%] grid-cols-2 gap-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </div>
      </main>
    );
  }

  const documents = staffDetail?.data?.staffRegistrationDoc || [];

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold">Uploaded Documents</h2>
      </header>
      {documents.length === 0 ? (
        <p className="mt-4 text-red-500">No documents found.</p>
      ) : (
        <form onSubmit={updateDetails}>
          <div className="mt-6 md:mt-8 grid w-full grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc: DocumentType) => (
              <div key={doc?.id}>
                <div>
                  <label
                    className="dark:text-white"
                    htmlFor={doc?.documentType}
                  >
                    {doc?.documentType}
                  </label>
                </div>
                <div
                  className={`mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1.5em] py-2 dark:bg-gray-700 ${
                    !editMode ? "cursor-default" : ""
                  }`}
                >
                  <input
                    type="file"
                    id={doc?.documentType}
                    accept=".png,.jpeg,.jpg,.doc,.docx,.pdf"
                    className="hidden"
                    onChange={handleFileChange(doc?.documentType)}
                    disabled={!editMode}
                  />
                  <label
                    htmlFor={doc?.documentType}
                    className={`flex flex-grow flex-col dark:text-white ${
                      !editMode ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex gap-2">
                        <img src={fileImg} alt="file_img" />
                        <p className="text-lg font-light">
                          {fileNames[doc?.documentType] || doc?.name}
                        </p>
                      </div>
                      <button.PrimaryButton
                        type="button"
                        onClick={() => handlePreview(doc?.publicURL)}
                      >
                        <AiOutlineEye />
                      </button.PrimaryButton>
                    </div>
                  </label>
                  <button.PrimaryButton
                    className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary-700 p-[10px] text-white dark:bg-gray-800"
                    onClick={handleUploadClick(doc.documentType)}
                    disabled={!editMode}
                  >
                    <img src={upload} alt="upload icon" />
                    Upload
                  </button.PrimaryButton>
                </div>
              </div>
            ))}
          </div>
          {!editMode && documents.length > 0 && (
            <button.PrimaryButton
              className="m-auto mt-[4em] gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[12px] text-center text-lg font-medium text-white"
              onClick={handleEditClick}
            >
              Edit Application
            </button.PrimaryButton>
          )}

          {editMode && (
            <>
              <button.PrimaryButton
                className="m-auto mt-[5em] w-[18%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <ReactLoading
                    color="#FFFFFF"
                    width={25}
                    height={25}
                    type="spin"
                  />
                ) : (
                  "Save Changes"
                )}
              </button.PrimaryButton>

              {!loading && (
                <p
                  className="mt-[1em] cursor-pointer font-medium text-red-500"
                  onClick={handleDiscardChanges}
                >
                  Discard Changes
                </p>
              )}
            </>
          )}
        </form>
      )}

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={closePreviewModal}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
      <ConfirmDiscard
        isOpen={isConfirmDialogOpen}
        onRequestClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDiscardChanges}
        title="Are you sure you want to discard changes?"
        confirmLabel="Yes"
        cancelLabel="No"
      />
    </main>
  );
};

export default UploadedDocuments;
