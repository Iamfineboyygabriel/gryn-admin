import { useEffect, useState } from "react";
import { button } from "../../../../../../../../../shared/buttons/Button";
import ApplicationSummary from "../../../../../../../../../shared/modal/applicationSummaryModal/ApplicationSummary";
import Modal from "../../../../../../../../../shared/modal/Modal";
import { useApplicationDetails } from "../../../../../../../../../shared/redux/hooks/shared/getUserProfile"
import fileImg from "../../../../../../../../../assets/svg/File.svg";
import upload from "../../../../../../../../../assets/svg/Upload.svg"
import eye from "../../../../../../../../../assets/svg/eyeImg.svg";
import DocumentPreviewModal from "../../../../../../../../../shared/modal/DocumentPreviewModal";



const SkeletonRow = () => (
  <div className="mb-4 animate-pulse space-y-4">
    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
    <div className="h-12 w-full rounded bg-gray-200"></div>
  </div>
);

const UploadedDocuments = ({ applicationId }: any) => {
  const { applicationDetails, loading: applicationLoading } =
    useApplicationDetails(applicationId);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = async () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    if (applicationDetails?.data) {
      const documentFiles = applicationDetails.data.documents.reduce(
        (acc: { [key: string]: File | null }, doc: any) => {
          acc[doc.documentType] = null;
          return acc;
        },
        {},
      );

      const documentNames = applicationDetails.data.documents.reduce(
        (acc: { [key: string]: string }, doc: any) => {
          acc[doc.documentType] = doc.name;
          return acc;
        },
        {},
      );
      setFiles(documentFiles);
      setFileNames(documentNames);
    }
  }, [applicationDetails]);

  if (applicationLoading) {
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


  return (
    <main>
        {applicationLoading && (
        <small className="mt-2 block">Please wait...</small>
      )}
        {!applicationLoading && (
        <section>
          <div className="mt-[2em] grid w-full grid-cols-2 gap-10">
            {applicationDetails?.data?.documents?.map((doc: any) => (
              <div key={doc?.id}>
                <div>
                  <label className="dark:text-white" htmlFor="documentType">
                    {doc?.documentType}
                  </label>
                </div>
                <div
                  className="mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1em] py-5"
                >
                  <label
                    htmlFor={doc?.documentType}
                    className="flex flex-grow flex-col dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex gap-2">
                        <img src={fileImg} alt="file_img" />
                        <p className="text-lg whitespace-nowrap  font-light">
                          {fileNames[doc?.documentType]}
                        </p>
                      </div>
                  
                    </div>
                  </label>
                  <div className="flex gap-[2px]">
                      <button
                      // onClick={applicationDetails?.data.documents.publicUrl}
                          className="flex items-center gap-1 rounded-full bg-purple-white px-3 py-[5px] text-center font-medium text-[#660066]"
                          >
                            <img src={eye} alt="eye" />
                            <span className="mr-3">View</span>
                          </button>
                          <button
                          className="flex items-center gap-1 rounded-full bg-purple-white px-3 py-[5px] text-center font-medium text-[#660066]"
                          >
                            <img src={eye} alt="eye" />
                            <span className="mr-3">Download</span>
                          </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
          <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={closePreviewModal}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
      <button.PrimaryButton
        className="m-auto mt-[5em] w-[18%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
        onClick={handleOpenModal}
      >
        Submit Response
      </button.PrimaryButton>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <ApplicationSummary onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default UploadedDocuments;
