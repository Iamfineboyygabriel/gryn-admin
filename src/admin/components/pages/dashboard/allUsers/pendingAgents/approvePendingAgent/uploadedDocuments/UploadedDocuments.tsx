import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactLoading from "react-loading";
import { button } from "../../../../../../../../shared/buttons/Button";
import fileImg from "../../../../../../../../assets/svg/File.svg";
import eye from "../../../../../../../../assets/svg/eyeImg.svg";
import download from "../../../../../../../../assets/svg/download.svg";
import approve from "../../../../../../../../assets/svg/Approved.svg";
import reject from "../../../../../../../../assets/svg/Rejected.svg";
import DocumentPreviewModal from "../../../../../../../../shared/modal/DocumentPreviewModal";
import Modal from "../../../../../../../../shared/modal/Modal";
import { AppDispatch, RootState } from "../../../../../../../../shared/redux/store";
import { useAppDispatch } from "../../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { updateDocumentStatus } from "../../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { approveAgent, rejectAgent } from "../../../../../../../../shared/redux/shared/services/shareApplication.services";
import ApplicationSummary from "../../../../../../../../shared/modal/applicationSummaryModal/ApplicationSummary";

interface Document {
  id: string;
  name: string;
  publicURL: string;
  documentType: string;
  remark: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface UpdateDocStatus {
  id: string;
  remark: 'APPROVED' | 'REJECTED' | 'PENDING';
}

interface AgentData {
  agentRegistrationDoc: Document[];
  id: string;
}

interface UploadedDocumentsProps {
  agentData: AgentData | null;
}

type ActionType = 'approve' | 'reject';

interface LoadingStatus {
  [key: string]: {
    [key in ActionType]: boolean;
  };
}

const UploadedDocuments: React.FC<UploadedDocumentsProps> = ({ agentData }) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { updateDocStatus, error } = useSelector((state: RootState) => state.shareApplication) as { 
    updateDocStatus: UpdateDocStatus | null; 
    error: string | null;
  };  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>(agentData?.agentRegistrationDoc || []);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (updateDocStatus) {
      setDocuments(prevDocs =>
        prevDocs.map(doc =>
          doc.id === updateDocStatus.id ? { ...doc, status: updateDocStatus.remark, remark: updateDocStatus.remark } : doc
        )
      );
    }
  }, [updateDocStatus]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const getFileTypeFromUrl = (url: string): string => {
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

  const handleStatusUpdate = async (id: string, remark: 'APPROVED' | 'REJECTED') => {
    const action: ActionType = remark.toLowerCase() as ActionType;
    setLoadingStatus((prev) => ({
      ...prev,
      [id]: { ...prev[id], [action]: true }
    }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  
    try {
      const response = await dispatch(updateDocumentStatus({ id, remark }));
      
      if (response.meta.requestStatus === 'fulfilled' && response.payload?.status === 200) {
        setDocuments((prevDocs) =>
          prevDocs.map((doc) =>
            doc.id === id ? { ...doc, status: remark, remark: remark } : doc
          )
        );
      } else {
        throw new Error('Failed to update document status');
      }
    } catch (error) {
      console.error('Failed to update document status:', error);
      setErrors((prev) => ({ ...prev, [id]: 'Failed to update status. Please try again.' }));
    } finally {
      setLoadingStatus((prev) => ({
        ...prev,
        [id]: { ...prev[id], [action]: false }
      }));
    }
  };

  const handleAgentApproval = async (approve: boolean) => {
    if (!agentData?.id) {
      console.error('Agent ID is missing');
      return;
    }

    try {
      if (approve) {
        await approveAgent(agentData.id);
      } else {
        await rejectAgent(agentData.id);
      }
      // handleCloseModal();
      // // You might want to add some feedback to the user here
    } catch (error) {
      console.error('Failed to approve/reject agent:', error);
      // Handle error (e.g., show error message)
    }
  };

  const renderActionButton = (doc: Document, action: 'APPROVED' | 'REJECTED') => {
    const actionType: ActionType = action.toLowerCase() as ActionType;
    const isLoading = loadingStatus[doc.id]?.[actionType] || false;
    const isCurrentStatus = doc.status === action;
    const isPending = doc.status === 'PENDING';

    let buttonClass = "flex px-[1em] rounded-md font-medium py-[8px] items-center border gap-2 ";
    let buttonContent;

    if (action === 'APPROVED') {
      buttonClass += isCurrentStatus
        ? "bg-[#F3FBF5] text-approve border-approve"
        : isPending
        ? "bg-[#F3FBF5] text-approve border-approve"
        : "bg-gray-200 text-gray-600 border-gray-300";
      buttonContent = (
        <>
          {(isCurrentStatus || isPending) && <img src={approve} alt="approve_icon" />}
          <small>{isCurrentStatus ? 'Approved' : 'Approve'}</small>
        </>
      );
    } else {
      buttonClass += isCurrentStatus
        ? "bg-[#FEEEEE] text-red-500 border-reject"
        : isPending
        ? "bg-[#FEEEEE] text-reject border-reject"
        : "bg-gray-200 text-gray-600 border-gray-300";
      buttonContent = (
        <>
          {(isCurrentStatus || isPending) && <img src={reject} alt="reject_icon" />}
          <small>{isCurrentStatus ? 'Rejected' : 'Reject'}</small>
        </>
      );
    }

    return (
      <div className="flex flex-col items-start">
        {errors[doc.id] && (
          <small className="text-red-500 mb-1">{errors[doc.id]}</small>
        )}
        <button
          className={buttonClass}
          onClick={() => handleStatusUpdate(doc.id, action)}
          disabled={isLoading || isCurrentStatus}
        >
          {isLoading ? (
            <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
          ) : (
            buttonContent
          )}
        </button>
      </div>
    );
  };

  if (!documents.length) {
    return <div>No documents found.</div>;
  }

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold dark:text-white">Uploaded Documents</h2>
      </header>
      <section>
        <div className="mt-[2em] grid w-full grid-cols-2 gap-10">
          {documents.map((doc) => (
            <div key={doc.id}>
              <div>
                <label className="dark:text-white" htmlFor={doc.documentType}>
                  {doc.documentType}
                </label>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1em] py-5">
                <label htmlFor={doc.documentType} className="flex flex-grow flex-col dark:text-white cursor-pointer">
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
                {renderActionButton(doc, 'APPROVED')}
                {renderActionButton(doc, 'REJECTED')}
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
            documents={documents}
            onApprove={() => handleAgentApproval(true)}
            onReject={() => handleAgentApproval(false)}
          />
        </Modal>
      )}
    </main>
  );
};

export default UploadedDocuments;