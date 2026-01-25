import { SetStateAction, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { button } from "../../../../../../../shared/buttons/Button";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { updatePayment } from "../../../../../../../shared/redux/admin/services/application.services";
import FileUpload from "../../../../../../../shared/fileUpload/FileUpload";
import Modal from "../../../../../../../shared/modal/Modal";
import Processing from "../../../../../../../shared/modal/Processing";

type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

interface DocumentState {
  id: number | null;
  file: File | null;
  status: DocumentStatus;
  canUpdate: boolean;
  originalName: string;
}

interface Document {
  id: number;
  name: string;
  publicURL: string;
  documentType: DocumentType;
  remark: DocumentStatus;
  uploadType: string;
  applicationId: number | null;
  paymentId: number;
  visaId: number | null;
  agentId: number | null;
  staffId: number | null;
  invoiceId: number | null;
  budgetId: number | null;
  createdAt: string;
  updatedAt: string;
}

enum DocumentType {
  SERVICE_CHARGE = "SERVICE_CHARGE",
  APPLICATION_FEE = "APPLICATION_FEE",
  TUTION_FEE = "TUTION_FEE",
}

interface LocationState {
  selectedUniversity: string;
  selectedDegree: string;
  applicationId: number;
  paymentId: number;
  document: Document[];
}

const UpdatePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [documents, setDocuments] = useState<
    Record<DocumentType, DocumentState>
  >({
    [DocumentType.SERVICE_CHARGE]: {
      id: null,
      file: null,
      status: "PENDING",
      canUpdate: false,
      originalName: "",
    },
    [DocumentType.APPLICATION_FEE]: {
      id: null,
      file: null,
      status: "PENDING",
      canUpdate: false,
      originalName: "",
    },
    [DocumentType.TUTION_FEE]: {
      id: null,
      file: null,
      status: "PENDING",
      canUpdate: false,
      originalName: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<DocumentType, string>>(
    {} as Record<DocumentType, string>,
  );
  const [successes, setSuccesses] = useState<Record<DocumentType, boolean>>(
    {} as Record<DocumentType, boolean>,
  );

  // Remove 'documents' from the dependency array since you're using functional update
  useEffect(() => {
    if (state?.document) {
      state.document.forEach((doc) => {
        if (doc?.documentType in DocumentType) {
          const docType = doc?.documentType as DocumentType;
          const canUpdate = doc?.remark === "REJECTED";
          setDocuments((prev) => ({
            ...prev,
            [docType]: {
              id: doc.id,
              file: null,
              status: doc.remark as DocumentStatus,
              canUpdate: canUpdate,
              originalName: doc.name,
            },
          }));
        }
      });
    }
  }, [state?.document]);

  const handleFileChange = (documentType: DocumentType, file: File | null) => {
    if (documents[documentType].canUpdate) {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          file,
        },
      }));
      setErrors((prev) => ({ ...prev, [documentType]: "" }));
    }
  };

  const setFileForDocument =
    (documentType: DocumentType) => (file: SetStateAction<File | null>) => {
      if (documents[documentType].canUpdate) {
        setDocuments((prev) => ({
          ...prev,
          [documentType]: {
            ...prev[documentType],
            file: file as File | null,
          },
        }));
      }
    };

  const handleBrowseFileClick: any = (inputId: any) => {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  };

  const renderStatusLabel = (documentType: DocumentType) => {
    const { status, canUpdate } = documents[documentType];

    const statusClasses = {
      APPROVED: "text-green-500",
      REJECTED: "text-red-500",
      PENDING: "text-yellow-500",
    };

    const statusMessages = {
      PENDING: "Cannot update pending documents",
      APPROVED: "Cannot update approved documents",
      REJECTED: "Document can be updated",
    };

    return (
      <div className="mt-2 flex items-center gap-2">
        <span className={`text-sm font-medium ${statusClasses[status]}`}>
          {status}
        </span>
        <span className="text-xs text-gray-500">
          ({canUpdate ? "Document can be updated" : statusMessages[status]})
        </span>
      </div>
    );
  };

  const submitPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const uploadPromises = Object.entries(documents)
        .filter(
          ([_, docState]) => docState.canUpdate && docState.file && docState.id,
        )
        .map(async ([docType, docState]) => {
          const formData = new FormData();
          formData.append("file", docState.file as File);
          formData.append("documentType", docType);

          try {
            const endpoint = `/media/payment/upload-doc/${docState.id}`;
            const response = await updatePayment(endpoint, formData);

            if (response) {
              setSuccesses((prev) => ({ ...prev, [docType]: true }));
              return { type: docType, success: true };
            }
            return { type: docType, success: false };
          } catch (error) {
            setErrors((prev) => ({
              ...prev,
              [docType]: "Upload failed, please try again",
            }));
            return { type: docType, success: false };
          }
        });

      const results = await Promise.all(uploadPromises);
      const anySuccess = results.some((result) => result.success);

      if (anySuccess) {
        setTimeout(() => {
          setModalOpen(true);
        }, 2000);
      }
    } catch (error) {
      toast.error("An error occurred while updating documents");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => navigate(-1);

  const canSubmit = Object.values(documents).some(
    (doc) => doc.canUpdate && doc.file !== null,
  );

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Update Payment</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <p className="font-medium">
            Payments /
            <span className="ml-1 text-primary-700 dark:text-white">
              Update Payments
            </span>
          </p>
          <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
            Back
          </button.PrimaryButton>
        </div>

        <div className="w-[26em]">
          <div className="mt-[2em]">
            <h1 className="text-xl font-semibold">Application Details</h1>

            <div className="m-auto mt-[1.5em]">
              <div className="w-full">
                <label className="text-sm font-medium text-grey-primary">
                  University
                </label>
                <input
                  value={state?.selectedUniversity || ""}
                  readOnly
                  className="mt-[11px] w-full cursor-not-allowed rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="m-auto mt-[1.5em]">
              <div className="w-full">
                <label className="text-sm font-medium text-grey-primary dark:text-white">
                  Degree
                </label>
                <input
                  value={state?.selectedDegree || ""}
                  readOnly
                  className="mt-[11px] w-full cursor-not-allowed rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none dark:border-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <form onSubmit={submitPayment}>
              <div className="mt-[1.5em] grid lg:w-[230%] lg:grid-cols-2 gap-4">
                {Object.entries(documents).map(([docType, docState]) => (
                  <div key={docType}>
                    <FileUpload
                      label={docType.replace(/_/g, " ").toLowerCase()}
                      inputId={docType.toLowerCase()}
                      file={docState.file}
                      onFileChange={(file) =>
                        handleFileChange(docType as DocumentType, file)
                      }
                      onBrowseClick={() =>
                        handleBrowseFileClick(docType.toLowerCase())
                      }
                      error={errors[docType as DocumentType]}
                      success={successes[docType as DocumentType]}
                      disabled={!docState.canUpdate}
                      setFile={setFileForDocument(docType as DocumentType)}
                      originalFileName={docState.originalName}
                    />
                    {renderStatusLabel(docType as DocumentType)}
                  </div>
                ))}
              </div>

              <button.PrimaryButton
                className="m-auto mt-[5em] flex w-full justify-center gap-2 rounded-full bg-linear-gradient py-[12px] text-center font-medium text-white disabled:opacity-50"
                type="submit"
                disabled={loading || !canSubmit}
              >
                {loading ? (
                  <div className="mr-auto flex">
                    <ReactLoading
                      color="#FFFFFF"
                      width={25}
                      height={25}
                      type="spin"
                    />
                  </div>
                ) : (
                  "Save & Continue"
                )}
              </button.PrimaryButton>
            </form>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <Processing />
        </Modal>
      )}
    </main>
  );
};

export default UpdatePayment;
