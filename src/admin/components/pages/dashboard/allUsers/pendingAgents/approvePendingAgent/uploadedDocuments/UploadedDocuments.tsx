import React, { useState } from "react";
import { button } from "../../../../../../../../shared/buttons/Button";
import fileImg from "../../../../../../../../assets/svg/File.svg";
import eye from "../../../../../../../../assets/svg/eyeImg.svg";
import download from "../../../../../../../../assets/svg/download.svg";
import approve from "../../../../../../../../assets/svg/Approved.svg";
import reject from "../../../../../../../../assets/svg/Rejected.svg";
import DocumentPreviewModal from "../../../../../../../../shared/modal/DocumentPreviewModal";
import Modal from "../../../../../../../../shared/modal/Modal";
import ApplicationSummary from "../../../../../../../../shared/modal/applicationSummaryModal/ApplicationSummary";

interface Document {
  id: number;
  name: string;
  publicURL: string;
  documentType: string;
  remark: string;
}

interface UploadedDocumentsProps {
  agentData: {
    agentRegistrationDoc: Document[];
  } | null;
  loading: boolean;
}

const SkeletonRow = () => (
  <div className="mb-4 animate-pulse space-y-4">
    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
    <div className="h-12 w-full rounded bg-gray-200"></div>
  </div>
);

const UploadedDocuments: React.FC<UploadedDocumentsProps> = ({ agentData, loading }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = async () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const getFileTypeFromUrl = (url: string) => {
    const segments = url.split("/");
    const fileExtension = segments[segments.length - 1].split(".").pop()?.toLowerCase();
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
    setPreviewUrl(url);
    setPreviewFileType(fileType);
    setIsPreviewOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewFileType("");
  };

  const handleDownload = (url: string, fileName: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.error('Download failed:', error));
  };

  if (loading) {
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

  if (!agentData || !agentData.agentRegistrationDoc) {
    return <div>No documents found.</div>;
  }

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">
          Uploaded Documents
        </h2>
      </header>
      <section>
        <div className="mt-[2em] grid w-full grid-cols-2 gap-10">
          {agentData.agentRegistrationDoc.map((doc) => (
            <div key={doc.id}>
              <div>
                <label className="dark:text-white" htmlFor={doc.documentType}>
                  {doc.documentType}
                </label>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1em] py-5">
                <label
                  htmlFor={doc.documentType}
                  className="flex flex-grow flex-col dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex gap-2">
                      <img src={fileImg} alt="file_img" />
                      <p className="text-lg whitespace-nowrap font-light">
                        {doc.name}
                      </p>
                    </div>
                  </div>
                </label>
                <div className="flex gap-[2px]">
                  <button
                    onClick={() => handlePreview(doc.publicURL)}
                    className="flex items-center gap-1 rounded-full bg-purple-white px-3 py-[5px] text-center font-medium text-[#660066]"
                  >
                    <img src={eye} alt="eye" />
                    <span className="mr-3">View</span>
                  </button>
                  <button
                    onClick={() => handleDownload(doc.publicURL, doc.name)}
                    className="flex items-center gap-1 rounded-full bg-purple-white px-3 py-[5px] text-center font-medium text-[#660066]"
                  >
                    <img src={download} alt="download" />
                    <span className="mr-3">Download</span>
                  </button>
                </div>
              </div>
              <div className="flex mt-[1em] gap-2 items-center">
                <button className="flex px-[1em] rounded-md font-medium bg-[#F3FBF5] text-approve py-[8px] items-center border border-approve gap-2">
                  <img src={approve} alt="approve_icon" />
                  <small>Approve</small>
                </button>
                <button className="flex items-center border rounded-md font-medium text-[#FC0E0E] px-[1em] py-[8px] border-[#FC0E0E] bg-[#FFF0F0] gap-2">
                  <img src={reject} alt="reject_icon" />
                  <small>Reject</small>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
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
        <ApplicationSummary
          onClose={handleCloseModal}
          personalDetails={agentData}
          degree={agentData}
          documents={agentData.agentRegistrationDoc}
        />
      </Modal>
    )}
        </main>
      );
    };

export default UploadedDocuments;