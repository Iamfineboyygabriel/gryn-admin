// import { useState } from "react";
// import { button } from "../../../../../../../../../shared/buttons/Button";
// import Modal from "../../../../../../../../../shared/modal/Modal";
// import ApplicationSummary from "../../../../../../../../../shared/modal/applicationSummaryModal/ApplicationSummary";

// const UploadedDocuments = () => {
//   const [isModalOpen, setModalOpen] = useState(false);

//   const handleOpenModal = async () => setModalOpen(true);
//   const handleCloseModal = () => setModalOpen(false);

//   return (
//     <main>
//       <button.PrimaryButton
//         className="m-auto mt-[5em] w-[18%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
//         onClick={handleOpenModal}
//       >
//         Submit Response
//       </button.PrimaryButton>
//       {isModalOpen && (
//         <Modal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           data-aos="zoom-in"
//         >
//           <ApplicationSummary onClose={handleCloseModal} />
//         </Modal>
//       )}
//     </main>
//   );
// };

// export default UploadedDocuments;

import { useState, useEffect } from "react";
// import { button } from "../../../../../../../../../shared/buttons/Button";
import { useApplicationDetails } from "../../../../../../../../../shared/redux/hooks/shared/getUserProfile";
import Modal from "react-modal";
// import ReactLoading from "react-loading";
import { AiOutlineEye } from "react-icons/ai";
import DocumentPreviewModal from "../../../../../../../../../shared/modal/DocumentPreviewModal";
import fileImg from "../../../../../../../../../assets/svg/File.svg";

Modal.setAppElement("#root");
const UploadedDocument = ({ applicationId }: any) => {
  const { applicationDetails, loading: applicationLoading } =
    useApplicationDetails(applicationId);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  // const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");

  useEffect(() => {
    if (applicationDetails?.data) {
      const documentFiles = applicationDetails.data.documents.reduce(
        (acc: { [key: string]: File | null }, doc: any) => {
          acc[doc.documentType] = null;
          return acc;
        },
        {}
      );

      const documentNames = applicationDetails.data.documents.reduce(
        (acc: { [key: string]: string }, doc: any) => {
          acc[doc.documentType] = doc.name;
          return acc;
        },
        {}
      );
      setFiles(documentFiles);
      setFileNames(documentNames);
    }
  }, [applicationDetails]);

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
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">
          Uploaded Documents
        </h2>
      </header>
      {applicationLoading && (
        <small className="mt-2 block">Please wait...</small>
      )}
      {!applicationLoading && (
        <form>
          <div className="mt-[2em] grid w-[85%] grid-cols-2 gap-10">
            {applicationDetails?.data?.documents?.map((doc: any) => (
              <div key={doc?.id}>
                <div>
                  <label className="dark:text-white" htmlFor="documentType">
                    {doc?.documentType}
                  </label>
                </div>
                <div className="dark:border-border mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1.5em] py-2 dark:bg-gray-700">
                  <input
                    type="file"
                    id={doc?.documentType}
                    accept=".png,.jpeg,.jpg,.doc,.docx,.pdf"
                    className="hidden"
                  />
                  <label
                    htmlFor={doc?.documentType}
                    className="flex flex-grow flex-col dark:text-white"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex gap-2">
                        <img src={fileImg} alt="file_img" />
                        <p className="text-lg font-light">
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
                </div>
              </div>
            ))}
          </div>
        </form>
      )}

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={closePreviewModal}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
    </main>
  );
};

export default UploadedDocument;
