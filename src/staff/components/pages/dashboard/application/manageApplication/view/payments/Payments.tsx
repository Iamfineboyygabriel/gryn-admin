import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import eye from "../../../../../../../../assets/svg/eyeImg.svg";
import fileImg from "../../../../../../../../assets/svg/File.svg";
import download from "../../../../../../../../assets/svg/download.svg";
import approve from "../../../../../../../../assets/svg/Approved.svg";
import reject from "../../../../../../../../assets/svg/Rejected.svg";
import ReactLoading from "react-loading";
import { useAppDispatch } from "../../../../../../../../shared/redux/hooks/shared/reduxHooks";
import { AppDispatch } from "../../../../../../../../shared/redux/store";
import { useApplicationDetails } from "../../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { updateDocumentStatus } from "../../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import DocumentPreviewModal from "../../../../../../../../shared/modal/DocumentPreviewModal";

export interface ApplicationDetails {
  status: number;
  message: string;
  data: {
    id: string;
    status: string;
    userId: string;
    documents: DocumentType[];
    payment: {
      id?: string;
      documents: DocumentType[];
    };
  };
}

interface DocumentType {
  id: string;
  name: string;
  publicURL: string;
  documentType: string;
  uploadType: string;
  applicationId: number;
  paymentId: null;
  agentId: null;
  createdAt: string;
  updatedAt: string;
  remark: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

type ActionType = "approve" | "reject";

interface LoadingStatus {
  [key: string]: {
    [key in ActionType]: boolean;
  };
}

const SkeletonRow = () => (
  <div className="mb-4 animate-pulse space-y-4">
    <div className="h-4 w-1/4 rounded bg-gray-200"></div>
    <div className="h-12 w-full rounded bg-gray-200"></div>
  </div>
);

const Payments = ({ applicationId }: { applicationId: any }) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { applicationDetails, loading: applicationLoading } =
    useApplicationDetails(applicationId);
  const { updateDocStatus, error } = useSelector(
    (state: any) => state.shareApplication
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (applicationDetails?.data?.payment?.documents) {
      setDocuments(applicationDetails.data.payment.documents);
    }
  }, [applicationDetails]);

  useEffect(() => {
    if (updateDocStatus) {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === updateDocStatus.id
            ? {
                ...doc,
                status: updateDocStatus.remark,
                remark: updateDocStatus.remark,
              }
            : doc
        )
      );
    }
  }, [updateDocStatus]);

  const getFileTypeFromUrl = (url: string): string => {
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
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Download failed:", error));
  };

  const handleStatusUpdate = async (
    id: string,
    remark: "APPROVED" | "REJECTED"
  ) => {
    const action: ActionType = remark.toLowerCase() as ActionType;
    setLoadingStatus((prev) => ({
      ...prev,
      [id]: { ...prev[id], [action]: true },
    }));
    setErrors((prev) => ({ ...prev, [id]: "" }));

    try {
      const response = await dispatch(updateDocumentStatus({ id, remark }));

      if (
        response.meta.requestStatus === "fulfilled" &&
        response?.payload?.status === 200
      ) {
        setDocuments((prevDocs) =>
          prevDocs.map((doc) =>
            doc.id === id ? { ...doc, status: remark, remark: remark } : doc
          )
        );
      } else {
        throw new Error("Failed to update document status");
      }
    } catch (error) {
      console.error("Failed to update document status:", error);
      setErrors((prev) => ({
        ...prev,
        [id]: "Failed to update status. Please try again.",
      }));
    } finally {
      setLoadingStatus((prev) => ({
        ...prev,
        [id]: { ...prev[id], [action]: false },
      }));
    }
  };

  const renderActionButton = (
    doc: DocumentType,
    action: "APPROVED" | "REJECTED"
  ) => {
    const actionType: ActionType = action?.toLowerCase() as ActionType;
    const isLoading = loadingStatus[doc.id]?.[actionType] || false;

    const isCurrentStatus = doc.remark === action;
    const isPending = !doc.remark || doc.remark === "PENDING";
    const isDisabled = doc.remark === "APPROVED" || doc.remark === "REJECTED";

    let buttonClass =
      "flex px-[1em] rounded-md font-medium py-[8px] items-center border gap-2 ";

    if (isPending) {
      buttonClass += "bg-gray-200 text-gray-600 border-gray-300";
    } else if (action === "APPROVED") {
      buttonClass += isCurrentStatus
        ? "bg-[#F3FBF5] text-approve border-approve cursor-not-allowed opacity-50"
        : "bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed opacity-50";
    } else {
      buttonClass += isCurrentStatus
        ? "bg-[#FEEEEE] text-red-500 border-reject cursor-not-allowed opacity-50"
        : "bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed opacity-50";
    }

    const buttonText = isPending
      ? action === "APPROVED"
        ? "Approve"
        : "Reject"
      : action === "APPROVED"
      ? "Approved"
      : "Rejected";

    return (
      <div className="flex flex-col items-start">
        {errors[doc.id] && (
          <small className="text-red-500 mb-1">{errors[doc.id]}</small>
        )}
        <button
          className={buttonClass}
          onClick={() => handleStatusUpdate(doc.id, action)}
          disabled={isLoading || isDisabled}
        >
          {isLoading ? (
            <ReactLoading color="#FFFFFF" width={25} height={25} type="spin" />
          ) : (
            <>
              {isCurrentStatus && (
                <img
                  src={action === "APPROVED" ? approve : reject}
                  alt={`${action.toLowerCase()}_icon`}
                />
              )}
              <small>{buttonText}</small>
            </>
          )}
        </button>
      </div>
    );
  };

  if (applicationLoading) {
    return (
      <main className="font-outfit">
        <header>
          <h2 className="text-xl font-semibold dark:text-white">
            Uploaded Payments
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

  if (!documents.length) {
    return (
      <main className="font-outfit">
        <header>
          <h2 className="text-xl font-semibold dark:text-white">
            Uploaded Payments
          </h2>
        </header>
        <div className="text-red-500">No documents found 📜.</div>
      </main>
    );
  }

  return (
    <main className="font-outfit">
      <header>
        <h2 className="text-xl font-semibold">Uploaded Payments</h2>
      </header>
      <section>
        <div className="mt-6 md:mt-8 grid w-full grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div key={doc.id}>
              <div>
                <label htmlFor={doc.documentType}>{doc.documentType}</label>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1em] py-5">
                <label
                  htmlFor={doc.documentType}
                  className="flex flex-grow flex-col cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex gap-2">
                      <img src={fileImg} alt="file_img" />
                      <p className="text-lg truncate max-w-[170px] whitespace-nowrap font-light">
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
              <p className="text-sm mt-[4px] font-medium">
                current status :{" "}
                <span
                  className={
                    doc.remark === "APPROVED"
                      ? "text-approve"
                      : doc.remark === "REJECTED"
                      ? "text-red-600"
                      : "text-yellow-500"
                  }
                >
                  {doc.remark || "PENDING"}
                </span>
              </p>
              {/* <div className="flex mt-[1em] gap-2 items-center">
                {renderActionButton(doc, "APPROVED")}
                {renderActionButton(doc, "REJECTED")}
              </div> */}
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
    </main>
  );
};

export default Payments;
