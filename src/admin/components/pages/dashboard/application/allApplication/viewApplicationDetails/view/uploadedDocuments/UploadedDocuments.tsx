import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppDispatch } from "../../../../../../../../../shared/redux/store";
import { useApplicationDetails } from "../../../../../../../../../shared/redux/hooks/shared/getUserProfile";
import { updateDocumentStatus } from "../../../../../../../../../shared/redux/shared/slices/shareApplication.slices";
import { useAppDispatch } from "../../../../../../../../../shared/redux/hooks/shared/reduxHooks";
import Modal from "../../../../../../../../../shared/modal/Modal";
import DocumentPreviewModal from "../../../../../../../../../shared/modal/DocumentPreviewModal";
import { button } from "../../../../../../../../../shared/buttons/Button";
import eye from "../../../../../../../../../assets/svg/eyeImg.svg";
import fileImg from "../../../../../../../../../assets/svg/File.svg";
import download from "../../../../../../../../../assets/svg/download.svg";
import approve from "../../../../../../../../../assets/svg/Approved.svg";
import reject from "../../../../../../../../../assets/svg/Rejected.svg";
import ReactLoading from "react-loading";
import StudentApplicationSummary from "../../../../../../../../../shared/modal/applicationSummaryModal/StudentApplicationSummary";
import AssignApplication from "../../../../../../../../../shared/modal/AssignApplication";
import {
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { updateApplicationToCompleted } from "../../../../../../../../../shared/redux/admin/slices/application.slices";
import { PrivateElement } from "../../../../../../../../../shared/redux/hooks/admin/PrivateElement";

interface Document {
  id: string;
  name: string;
  publicURL: string;
  documentType: string;
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

const UploadedDocuments = ({ applicationId }: { applicationId: any }) => {
  const dispatch: AppDispatch = useAppDispatch();
  const { applicationDetails, loading: applicationLoading } =
    useApplicationDetails(applicationId);

  const { updateDocStatus } = useSelector(
    (state: any) => state.shareApplication
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newApplicationStatus, setNewApplicationStatus] = useState<
    "COMPLETED" | "DECLINED" | null
  >(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAssignModal, setIsAssignModal] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [alertState, setAlertState] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (applicationDetails?.data?.documents) {
      setDocuments(applicationDetails?.data?.documents);
    }
  }, [applicationDetails]);

  useEffect(() => {
    if (updateDocStatus) {
      setDocuments((prevDocs) =>
        prevDocs?.map((doc) =>
          doc?.id === updateDocStatus?.id
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

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleAssignOpenModal = () => setIsAssignModal(true);
  const handleAssignCloseModal = () => setIsAssignModal(false);

  const formatDocumentType = (type: string) => {
    if (type === "OLD_LEVEL") return "O Level";
    return type
      .split("_")
      .map((word) => word?.charAt(0) + word?.slice(1)?.toLowerCase())
      .join(" ");
  };

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
    const action: "approve" | "reject" = remark.toLowerCase() as
      | "approve"
      | "reject";
    setLoadingStatus((prev) => ({
      ...prev,
      [id]: { ...prev[id], [action]: true },
    }));
    setErrors((prev) => ({ ...prev, [id]: "" }));

    try {
      const response = await dispatch(updateDocumentStatus({ id, remark }));

      if (
        response.meta.requestStatus === "fulfilled" &&
        response.payload?.status === 200
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

  const handleUpdateApplicationStatus = async () => {
    if (!newApplicationStatus) return;

    setIsUpdatingStatus(true);
    try {
      const response = await dispatch(
        updateApplicationToCompleted({
          body: { status: newApplicationStatus },
          applicationId,
        })
      );

      if (
        response.meta.requestStatus === "fulfilled" &&
        response.payload?.status === 200
      ) {
        setAlertState({
          open: true,
          message: `Application successfully marked as ${newApplicationStatus.toLowerCase()}`,
          severity: "success",
        });
      } else {
        throw new Error(
          `Failed to update application status to ${newApplicationStatus}`
        );
      }
    } catch (error) {
      setAlertState({
        open: true,
        message: "Failed to update application status. Please try again.",
        severity: "error",
      });
    } finally {
      setIsUpdatingStatus(false);
      setNewApplicationStatus(null);
    }
  };

  const handleCloseAlert = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
  };

  const renderActionButton = (
    doc: Document,
    action: "APPROVED" | "REJECTED"
  ) => {
    const actionType: "approve" | "reject" = action.toLowerCase() as
      | "approve"
      | "reject";
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

    const buttonContent = (
      <>
        {isCurrentStatus && (
          <img
            src={action === "APPROVED" ? approve : reject}
            alt={`${action.toLowerCase()}_icon`}
          />
        )}
        <small>{buttonText}</small>
      </>
    );

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
            buttonContent
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

  if (!documents.length) {
    return (
      <main className="font-outfit">
        <header>
          <h2 className="text-xl font-semibold dark:text-white">
            Uploaded Documents
          </h2>
        </header>
        <div className="text-red-500">No documents found 📜.</div>

        <div className="w-full mt-8">
          {alertState.open && (
            <Alert
              severity={alertState.severity}
              onClose={handleCloseAlert}
              className="w-1/2"
              sx={{
                "& .MuiAlert-message": {
                  width: "100%",
                  textAlign: "center",
                },
              }}
            >
              {alertState.message}
            </Alert>
          )}
        </div>

        <div className="flex flex-wrap w-full gap-4 mt-[5em]">
          <button.PrimaryButton
            className="w-auto rounded-full px-3 bg-linear-gradient py-[9px] text-center text-lg font-medium text-white"
            onClick={handleOpenModal}
          >
            Submit Response
          </button.PrimaryButton>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <FormControl className="flex-grow md:w-48">
              <InputLabel id="application-status-select-label">
                Application Status
              </InputLabel>
              <Select
                labelId="application-status-select-label"
                value={newApplicationStatus || ""}
                onChange={(e) =>
                  setNewApplicationStatus(
                    e.target.value as "COMPLETED" | "DECLINED"
                  )
                }
              >
                <MenuItem value="">Select an action</MenuItem>
                <MenuItem value="COMPLETED">Mark as Completed</MenuItem>
                <MenuItem value="DECLINED">Mark as Declined</MenuItem>
              </Select>
            </FormControl>

            <button.PrimaryButton
              className="w-[8em] rounded-full bg-linear-gradient py-[9px] px-3 text-center text-lg font-medium text-white"
              onClick={handleUpdateApplicationStatus}
              disabled={!newApplicationStatus || isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <div className="flex items-center">
                  <ReactLoading
                    color="#FFFFFF"
                    width={25}
                    height={25}
                    type="spin"
                  />
                </div>
              ) : (
                "Update Status"
              )}
            </button.PrimaryButton>
          </div>
        </div>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            data-aos="zoom-in"
          >
            <StudentApplicationSummary
              onClose={handleCloseModal}
              documents={documents}
              userData={{
                firstName: applicationDetails?.data?.firstName,
                lastName: applicationDetails?.data?.lastName,
                userId: applicationDetails?.data?.userId,
              }}
            />
          </Modal>
        )}
      </main>
    );
  }

  return (
    <main className="font-outfit px-4 md:px-6 lg:px-8">
      <header className="mb-8">
        <h2 className="text-xl md:text-2xl font-semibold">
          Uploaded Documents
        </h2>
      </header>

      <section>
        <div className="grid grid-cols-2">
          <div className="">
            <label
              htmlFor="applicationStatus"
              className="block mb-2 font-medium"
            >
              Application Status
            </label>
            <input
              id="applicationStatus"
              name="applicationStatus"
              value={applicationDetails?.data?.applicationStatus}
              readOnly
              className="border-border focus:border-border w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-6 md:mt-8 grid w-full grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="flex flex-col">
              <label
                htmlFor={doc.documentType}
                className="block mb-2 font-medium"
              >
                {formatDocumentType(doc?.documentType)}
              </label>
              <div className="flex items-center justify-between rounded-lg border border-gray-300 p-3">
                <div className="flex items-center gap-3">
                  <img src={fileImg} alt="file_img" className="w-5 h-5" />
                  <p className="text-base truncate max-w-[120px] md:max-w-[150px] font-light">
                    {doc.name}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(doc.publicURL)}
                    className="flex items-center gap-1 rounded-full bg-purple-white px-2 py-1 text-sm font-medium text-[#660066]"
                  >
                    <img src={eye} alt="eye" className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownload(doc.publicURL, doc.name)}
                    className="flex items-center gap-1 rounded-full bg-purple-white px-2 py-1 text-sm font-medium text-[#660066]"
                  >
                    <img src={download} alt="download" className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              <p className="text-sm mt-2 font-medium">
                current status:{" "}
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
              <div className="flex mt-2 gap-2">
                {renderActionButton(doc, "APPROVED")}
                {renderActionButton(doc, "REJECTED")}
              </div>
            </div>
          ))}
        </div>
      </section>

      {alertState.open && (
        <div className="mb-6 mt-6">
          <Alert
            severity={alertState.severity}
            onClose={handleCloseAlert}
            className="w-full md:w-1/2"
            sx={{
              "& .MuiAlert-message": {
                width: "100%",
                textAlign: "center",
              },
            }}
          >
            {alertState.message}
          </Alert>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mt-8">
        <button.PrimaryButton
          className="w-auto rounded-full px-4 bg-purple-white py-2 text-base font-medium text-primary-700"
          onClick={handleAssignOpenModal}
        >
          Assign Application
        </button.PrimaryButton>

        <PrivateElement feature="APPLICATION" page="Submit Response">
          <button.PrimaryButton
            className="w-auto rounded-full px-4 bg-linear-gradient py-2 text-base font-medium text-white"
            onClick={handleOpenModal}
          >
            Submit Response
          </button.PrimaryButton>
        </PrivateElement>

        <div className="flex items-center gap-3">
          <FormControl className="w-48">
            <InputLabel id="application-status-select-label">
              Application Status
            </InputLabel>
            <Select
              labelId="application-status-select-label"
              value={newApplicationStatus || ""}
              onChange={(e) =>
                setNewApplicationStatus(
                  e.target.value as "COMPLETED" | "DECLINED"
                )
              }
            >
              <MenuItem value="">Select an action</MenuItem>
              <MenuItem value="SUBMITTED">Mark as Submitted</MenuItem>
              <MenuItem value="COMPLETED">Mark as Completed</MenuItem>
              <MenuItem value="DECLINED">Mark as Declined</MenuItem>
            </Select>
          </FormControl>

          <button.PrimaryButton
            className="w-32 rounded-full bg-linear-gradient py-2 text-base font-medium text-white"
            onClick={handleUpdateApplicationStatus}
            disabled={!newApplicationStatus || isUpdatingStatus}
          >
            {isUpdatingStatus ? (
              <div className="flex justify-center">
                <ReactLoading
                  color="#FFFFFF"
                  width={20}
                  height={20}
                  type="spin"
                />
              </div>
            ) : (
              "Update Status"
            )}
          </button.PrimaryButton>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <StudentApplicationSummary
            onClose={handleCloseModal}
            documents={documents}
            userData={{
              firstName: applicationDetails?.data?.firstName,
              lastName: applicationDetails?.data?.lastName,
              userId: applicationDetails?.data?.userId,
            }}
          />
        </Modal>
      )}
      {isAssignModal && (
        <Modal
          isOpen={isAssignModal}
          onClose={handleAssignCloseModal}
          data-aos="zoom-in"
        >
          <AssignApplication
            applicationId={applicationId}
            staffEmail={applicationDetails?.data?.staff?.email}
            onClose={handleAssignCloseModal}
          />
        </Modal>
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

export default UploadedDocuments;
