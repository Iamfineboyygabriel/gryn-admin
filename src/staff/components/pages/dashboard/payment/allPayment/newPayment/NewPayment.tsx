import { useEffect, useState } from "react";
import { useNavigate,useLocation } from "react-router";
import { uploadPayment } from "../../../../../../../shared/redux/shared/services/shareApplication.services";
import { DocumentType } from "../../../../../../../data/data";
import { button } from "../../../../../../../shared/buttons/Button";
import Modal from "../../../../../../../shared/modal/Modal";
import Processing from "../../../../../../../shared/modal/Processing";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import FileUpload from "../../../../../../../shared/fileUpload/FileUpload";

interface StudentData {
  id: number;
  degree:{
    university: string,
    degreeType: string,
    applicationId: number,
  }
}

const NewPayment = () => {
  const [service_Charge, setService_Charge] = useState<File | null>(null);
  const [application_Fee, setApplication_Fee] = useState<File | null>(null);
  const [tution_Fee, setTution_Fee] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, boolean>>({});

  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const studentData: StudentData = location.state?.studentData;
  const handleBrowseFileClick = async (inputId: string): Promise<void> => {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const submitPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const id = studentData.degree.applicationId;

    try {
      const endpoint = `/media/payment/upload-doc/${id}`;
      const uploadDocument = async (
        file: File | null,
        documentType: string,
      ) => {
        if (file && !successes[documentType]) {
          const form = new FormData();
          form.append("file", file);
          form.append("documentType", documentType);
          const response = await uploadPayment(endpoint, form);
          return { type: documentType, response };
        }
        return null;
      };

      const responses = await Promise.all([
        uploadDocument(service_Charge, DocumentType.SERVICE_CHARGE),
        uploadDocument(application_Fee, DocumentType.APPLICATION_FEE),
        uploadDocument(tution_Fee, DocumentType.TUTION_FEE),
      ]);

      const results = responses.filter((result) => result !== null);

      let successfulUploads = results.filter(
        (result) => result?.response?.status === 201,
      );
      let failedUploads = results.filter(
        (result) => result?.response?.status !== 201,
      );

      successfulUploads.forEach((result) => {
        setSuccesses((prev) => ({ ...prev, [result!.type]: true }));
      });

      failedUploads.forEach((result) => {
        setErrors((prev) => ({
          ...prev,
          [result!.type]: "Upload failed, please try again",
        }));
      });

      if (successfulUploads.length > 0) {
        setTimeout(() => {
          setModalOpen(true);

          if (successes[DocumentType.SERVICE_CHARGE]) setService_Charge(null);
          if (successes[DocumentType.APPLICATION_FEE]) setApplication_Fee(null);
          if (successes[DocumentType.TUTION_FEE]) setTution_Fee(null);
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white p-3 pb-[10em]">
        <div className="flex items-center justify-between">
          <p className="font-medium">
            Payments / <span className="text-primary-700">Upload Payments</span>
          </p>
          <button.PrimaryButton className="btn-2" onClick={() => navigate(-1)}>
            Back
          </button.PrimaryButton>
        </div>
        <div className="mt-[2em]">
          <div className="grid w-[75%] grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="university"
                className="text-sm font-medium text-grey-primary"
              >
                University
              </label>
              <input
                name="university"
                id="university"
                type="text"
                readOnly
                value={studentData?.degree?.university}
                className="mt-[11px] w-full cursor-not-allowed rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="degree"
                className="text-sm font-medium text-grey-primary"
              >
                Degree
              </label>
              <input
                name="degree"
                id="degree"
                type="text"
                readOnly
                value={studentData?.degree?.degreeType}
                className="mt-[11px] w-full cursor-not-allowed rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none"
              />
            </div>
          </div>

          <form onSubmit={submitPayment}>
            <div className="mt-[1.5em] grid w-[80%] grid-cols-2 gap-4">
              <FileUpload
                label="Service Charge"
                inputId="service_Charge"
                file={service_Charge}
                setFile={setService_Charge}
                onFileChange={(file) => setService_Charge(file)}
                onBrowseClick={handleBrowseFileClick}
                error={errors[DocumentType.SERVICE_CHARGE]}
                success={successes[DocumentType.SERVICE_CHARGE]}
              />
              <FileUpload
                label="Application Fee"
                inputId="application_Fee"
                file={application_Fee}
                setFile={setApplication_Fee}
                onFileChange={(file) => setApplication_Fee(file)}
                onBrowseClick={handleBrowseFileClick}
                error={errors[DocumentType.APPLICATION_FEE]}
                success={successes[DocumentType.APPLICATION_FEE]}
              />
              <FileUpload
                label="Tuition Fee"
                inputId="tuition_Fee"
                file={tution_Fee}
                setFile={setTution_Fee}
                onFileChange={(file) => setTution_Fee(file)}
                onBrowseClick={handleBrowseFileClick}
                error={errors[DocumentType.TUTION_FEE]}
                success={successes[DocumentType.TUTION_FEE]}
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
                "Save & Continue"
              )}
            </button.PrimaryButton>
          </form>
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <Processing isOpen={isModalOpen} onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default NewPayment;
