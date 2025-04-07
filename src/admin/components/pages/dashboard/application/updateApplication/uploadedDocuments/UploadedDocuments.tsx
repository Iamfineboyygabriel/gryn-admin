import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { button } from "../../../../../../../shared/buttons/Button";
import upload from "../../../../../../../assets/svg/Upload.svg";
import fileImg from "../../../../../../../assets/svg/File.svg";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { AiOutlineEye } from "react-icons/ai";
import { updateApplicationDocument } from "../../../../../../../shared/redux/shared/services/shareApplication.services";
import DocumentPreviewModal from "../../../../../../../shared/modal/DocumentPreviewModal";
import Modal from "../../../../../../../shared/modal/Modal";
import ApplicationUpdated from "../../../../../../../shared/modal/ApplicationUpdated";
import {
  Dropdown,
  DropdownItem,
} from "../../../../../../../shared/dropDown/DropDown";
import { updateApplicationStatus } from "../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { AppDispatch } from "../../../../../../../shared/redux/store";

const SkeletonRow = () => (
  <div className="mb-4 animate-pulse space-y-4">
    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
    <div className="h-12 w-full rounded bg-gray-200"></div>
  </div>
);

interface Status {
  name: string;
}

const UploadedDocument = ({ studentData }: any) => {
  const dispatch: AppDispatch = useDispatch();
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(
    studentData?.applicationStatus || null
  );

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    if (studentData?.documents) {
      const documentFiles = studentData.documents?.reduce(
        (acc: { [key: string]: File | null }, doc: any) => {
          acc[doc.documentType] = null;
          return acc;
        },
        {}
      );

      const documentNames = studentData.documents?.reduce(
        (acc: { [key: string]: string }, doc: any) => {
          acc[doc.documentType] = doc.name;
          return acc;
        },
        {}
      );
      setFiles(documentFiles);
      setFileNames(documentNames);
      setLoading(false);

      // Set initial application status from studentData
      if (studentData?.applicationStatus) {
        setApplicationStatus(studentData.applicationStatus);
      }
    }
  }, [studentData]);

  const handleFileChange =
    (documentType: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event?.target?.files?.[0];
      if (selectedFile) {
        setFiles((prevFiles) => ({
          ...prevFiles,
          [documentType]: selectedFile,
        }));
        setFileNames((prevNames) => ({
          ...prevNames,
          [documentType]: selectedFile?.name,
        }));
      }
    };

  const handleUploadClick = (documentType: string) => () => {
    document.getElementById(documentType)?.click();
  };

  const updateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploading(true);

    const successfulUploads: string[] = [];
    const failedUploads: string[] = [];

    try {
      await Promise.all(
        Object?.entries(files)?.map(async ([documentType, file]) => {
          const doc = studentData.documents?.find(
            (d: any) => d?.documentType === documentType
          );
          if (file && doc) {
            try {
              const form = new FormData();
              form?.append("file", file);
              const endpoint = `/media/application/upload-doc/${doc?.id}`;
              const response = await updateApplicationDocument(endpoint, form);
              if (response?.status === 201) {
                successfulUploads.push(documentType);
              } else {
                failedUploads?.push(documentType);
              }
            } catch (error) {
              failedUploads.push(documentType);
            }
          }
        })
      );

      if (successfulUploads?.length > 0) {
        toast.success(
          `Successfully uploaded: ${successfulUploads?.join(", ")}`
        );
        handleOpenModal();
      }
      if (failedUploads.length > 0) {
        toast.error(`Failed to upload: ${failedUploads?.join(", ")}`);
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setUploading(false);
    }
  };

  const handleSelectStatus = useCallback((item: DropdownItem) => {
    setApplicationStatus(item?.name || null);
  }, []);

  const handleUpdateStatus = async () => {
    if (!applicationStatus || !studentData?.id) {
      toast.error("Please select an application status");
      return;
    }

    setUpdatingStatus(true);
    try {
      const body = { applicationStatus };
      const resultAction = await dispatch(
        updateApplicationStatus({
          body,
          applicationId: studentData.id,
        })
      );

      if (updateApplicationStatus.fulfilled.match(resultAction)) {
        handleOpenModal();
      } else if (updateApplicationStatus.rejected.match(resultAction)) {
        toast.error(
          (resultAction.payload as string) ||
            "Failed to update application status"
        );
      }
    } catch (error) {
      toast.error("Failed to update application status");
      console.error("Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getFileTypeFromUrl = (url: any) => {
    const segments = url.split("/");
    const fileExtension = segments.pop().split(".").pop();
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

  const handlePreview = (url: any) => {
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

  if (loading) {
    return (
      <main className="font-outfit">
        <header>
          <h2 className="text-xl font-semibold">Uploaded Documents</h2>
        </header>
        <div className="mt-[2em] grid w-[85%] grid-cols-2 gap-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </div>
      </main>
    );
  }

  const type: Status[] = [
    { name: "CONDITIONAL_OFFER" },
    { name: "UNCONDITIONAL_OFFER" },
    { name: "PAID_DEPOSIT" },
    { name: "CAS" },
    { name: "VISA_APPROVED" },
    { name: "STUDENT_ENROLLED" },
    { name: "WITHDRAWN" },
  ];

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold">Uploaded Documents</h2>
      </header>
      <div className="bg-[#FFF0FF] mt-8 w-[550px] rounded-xl p-4">
        <div className="flex items-center gap-4">
          <Dropdown
            label="Application Status"
            items={type}
            selectedItem={
              applicationStatus ? { name: applicationStatus } : null
            }
            onSelectItem={handleSelectStatus}
            searchVisible
            placeholder="Select status"
            buttonColor="white"
            className="w-[240px]"
          />
          <button.PrimaryButton
            className="w-[240px] mt-6 justify-center rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
            disabled={updatingStatus || !applicationStatus}
            type="button"
            onClick={handleUpdateStatus}
          >
            {updatingStatus ? (
              <ReactLoading
                color="#FFFFFF"
                type="spin"
                width={24}
                height={24}
              />
            ) : (
              "Update Status"
            )}
          </button.PrimaryButton>
        </div>
      </div>
      <form onSubmit={updateDetails}>
        <div className="mt-[1.5em] w-full md:w-[90%] lg:w-[80%] grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {studentData?.documents?.map((doc: any) => (
            <div key={doc?.id}>
              <div>
                <label htmlFor="documentType">{doc?.documentType}</label>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1.5em] py-2">
                <input
                  type="file"
                  id={doc?.documentType}
                  accept=".png,.jpeg,.jpg,.doc,.docx,.pdf"
                  className="hidden"
                  onChange={handleFileChange(doc?.documentType)}
                />
                <label
                  htmlFor={doc?.documentType}
                  className="flex flex-grow flex-col cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex gap-2">
                      <img src={fileImg} alt="file_img" />
                      <p className="text-lg truncate max-w-[180px] font-light">
                        {fileNames[doc?.documentType]}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePreview(doc?.publicURL)}
                    >
                      <AiOutlineEye />
                    </button>
                  </div>
                </label>
                <button.PrimaryButton
                  className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary-700 p-[10px] text-white"
                  onClick={handleUploadClick(doc.documentType)}
                >
                  <img src={upload} alt="upload icon" />
                  Upload
                </button.PrimaryButton>
              </div>
            </div>
          ))}
        </div>
        <button.PrimaryButton
          className="m-auto mt-[5em] w-[30%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] text-center font-medium text-white"
          disabled={uploading}
          type="submit"
        >
          {uploading ? (
            <ReactLoading color="#FFFFFF" type="spin" width={24} height={24} />
          ) : (
            "Save Changes"
          )}
        </button.PrimaryButton>
      </form>
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={closePreviewModal}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          data-aos="zoom-in"
          onClose={handleCloseModal}
        >
          <ApplicationUpdated
            to="/admin/dashboard/application"
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </main>
  );
};

export default UploadedDocument;
