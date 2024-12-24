import { useEffect, useState } from "react";
import { uploadVisaApplicationDocument } from "../../../../../../../shared/redux/shared/services/shareApplication.services";
import FileUpload from "../../../../../../../shared/fileUpload/FileUpload";
import { button } from "../../../../../../../shared/buttons/Button";
import { DocumentType } from "../../../../../../../data/data";
import VisaApplicationCreated from "../../../../../../../shared/modal/VisaApplicationCreated";

import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import Modal from "../../../../../../../shared/modal/Modal";

const StepThree = ({ applicationId }: any) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [service_Charge, setService_Charge] = useState<File | null>(null);
  const [ihs, setIhs] = useState<File | null>(null);
  const [visa_Fee, setVisa_Fee] = useState<File | null>(null);
  const [other_Payment, setOther_Payment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, boolean>>({});
  const [isModalOpen, setModalOpen] = useState(false);

  const handleBrowseFileClick = (inputId: string): void => {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  };

  const submitDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const endpoint = `/media/visa/upload-doc/${applicationId}`;
      const documents = [
        { type: DocumentType.SERVICE_CHARGE, file: service_Charge },
        { type: DocumentType.IHS, file: ihs },
        { type: DocumentType.VISA_FEE, file: visa_Fee },
        { type: DocumentType.OTHER_PAYMENT, file: other_Payment },
      ];

      const documentsToUpload = documents.filter(
        ({ type, file }) => file && !successes[type]
      );

      const results = await Promise.all(
        documentsToUpload.map(async ({ type, file }) => {
          try {
            const form = new FormData();
            form.append("file", file!);
            form.append("documentType", type);
            const response = await uploadVisaApplicationDocument(
              endpoint,
              form
            );
            if (response.status === 201) {
              setSuccesses((prev) => ({ ...prev, [type]: true }));
              return { type, success: true };
            } else {
              throw new Error("Upload failed, please try again");
            }
          } catch (error) {
            setErrors((prev) => ({
              ...prev,
              [type]: "Upload failed, please try again",
            }));
            return { type, success: false };
          }
        })
      );

      const allSuccessful = documents.every(
        ({ type }) =>
          successes[type] || results.some((r) => r.type === type && r.success)
      );

      if (allSuccessful) {
        setModalOpen(true);
      }
    } catch (error) {
      toast.error(
        "An error occurred while uploading documents. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <form onSubmit={submitDocument}>
        <div className="mt-[1.5em] w-full md:w-[90%] lg:w-[80%] grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          <FileUpload
            label="Service Charge"
            inputId="resumeFile"
            file={service_Charge}
            setFile={setService_Charge}
            onFileChange={(file) => setService_Charge(file)}
            onBrowseClick={async () => handleBrowseFileClick("service_Charge")}
            error={errors[DocumentType.SERVICE_CHARGE]}
            success={successes[DocumentType.SERVICE_CHARGE]}
          />

          <FileUpload
            label="IHS Payment"
            inputId="ihs"
            file={ihs}
            setFile={setIhs}
            onFileChange={(file) => setIhs(file)}
            onBrowseClick={async () => handleBrowseFileClick("ihs")}
            error={errors[DocumentType.IHS]}
            success={successes[DocumentType.IHS]}
          />

          <FileUpload
            label="Visa Fee Payment"
            inputId="visa_Fee"
            file={visa_Fee}
            setFile={setVisa_Fee}
            onFileChange={(file) => setVisa_Fee(file)}
            onBrowseClick={async () => handleBrowseFileClick("visa_Fee")}
            error={errors[DocumentType.VISA_FEE]}
            success={successes[DocumentType.VISA_FEE]}
          />

          <FileUpload
            label="Other Payment"
            inputId="other_Payment"
            file={other_Payment}
            setFile={setOther_Payment}
            onFileChange={(file) => setOther_Payment(file)}
            onBrowseClick={async () => handleBrowseFileClick("other_Payment")}
            error={errors[DocumentType.OTHER_PAYMENT]}
            success={successes[DocumentType.OTHER_PAYMENT]}
          />
        </div>
        <button.PrimaryButton
          className="mt-[5em] flex w-[30%] justify-center gap-2 rounded-full bg-linear-gradient py-[12px] text-center font-medium text-white"
          type="submit"
          disabled={loading}
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
            "Create Application"
          )}
        </button.PrimaryButton>
      </form>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          data-aos="zoom-in"
        >
          <VisaApplicationCreated
            onClose={() => setModalOpen(false)}
            to="/admin/dashboard/visa"
          />
        </Modal>
      )}
    </main>
  );
};

export default StepThree;
