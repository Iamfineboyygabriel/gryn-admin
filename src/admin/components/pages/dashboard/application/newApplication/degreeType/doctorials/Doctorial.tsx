import { useEffect, useState } from "react";
import { button } from "../../../../../../../../shared/buttons/Button";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { DocumentType } from "../../../../../../../../data/data";
import { uploadApplication } from "../../../../../../../../shared/redux/shared/services/shareApplication.services";
import FileUpload from "../../../../../../../../shared/fileUpload/FileUpload";
import Modal from "../../../../../../../../shared/modal/Modal";
import ApplicationSuccessfull from "../../../../../../../../shared/modal/ApplicationSuccessfull";

const Doctorial = ({ onNext, applicationId }: any) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [resume, setResume] = useState<File | null>(null);
  const [international_Passport, setInternational_Passport] =
    useState<File | null>(null);
  const [old_Level, setOld_Level] = useState<File | null>(null);
  const [bachelor_Degree_Certificate, setBachelor_Degree_Certificate] =
    useState<File | null>(null);
  const [bachelor_Degree_Transcript, setBachelor_Degree_Transcript] =
    useState<File | null>(null);
  const [personal_Statement, setPersonal_Statement] = useState<File | null>(
    null
  );
  const [refrence_Letter1, setRefrence_Letter1] = useState<File | null>(null);
  const [refrence_Letter2, setRefrence_Letter2] = useState<File | null>(null);
  const [research_Thesis, setResearch_Thesis] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, boolean>>({});

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleBrowseFileClick = async (inputId: string): Promise<void> => {
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
      const endpoint = `/media/application/upload-doc/${applicationId}`;
      const documents = [
        { type: DocumentType.RESUME, file: resume },
        {
          type: DocumentType.INTERNATIONAL_PASSPORT,
          file: international_Passport,
        },
        { type: DocumentType.OLD_LEVEL, file: old_Level },
        {
          type: DocumentType.BACHELOR_DEGREE_CERTIFICATE,
          file: bachelor_Degree_Certificate,
        },
        {
          type: DocumentType.BACHELOR_DEGREE_TRANSCRIPT,
          file: bachelor_Degree_Transcript,
        },
        { type: DocumentType.PERSONAL_STATEMENT, file: personal_Statement },
        { type: DocumentType.REFERENCE_LETTER1, file: refrence_Letter1 },
        { type: DocumentType.REFERENCE_LETTER2, file: refrence_Letter2 },
        { type: DocumentType.RESEARCH_THESIS, file: research_Thesis },
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
            const response = await uploadApplication(endpoint, form);
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
        setTimeout(() => {
          handleOpenModal();
        }, 2000);
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
            label="C/V"
            inputId="serviceChargeFile"
            file={resume}
            setFile={setResume}
            onFileChange={(file) => setResume(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.RESUME]}
            success={successes[DocumentType.RESUME]}
          />
          <FileUpload
            label="International Passport"
            inputId="internationalPassportFile"
            file={international_Passport}
            setFile={setInternational_Passport}
            onFileChange={(file) => setInternational_Passport(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.INTERNATIONAL_PASSPORT]}
            success={successes[DocumentType.INTERNATIONAL_PASSPORT]}
          />
          <FileUpload
            label="WAEC/NECO Certificate"
            inputId="oLevelFile"
            file={old_Level}
            setFile={setOld_Level}
            onFileChange={(file) => setOld_Level(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.OLD_LEVEL]}
            success={successes[DocumentType.OLD_LEVEL]}
          />
          <FileUpload
            label="Bachelor's Degree Certificate"
            inputId="bachelorsCertificateFile"
            file={bachelor_Degree_Certificate}
            setFile={setBachelor_Degree_Certificate}
            onFileChange={(file) => setBachelor_Degree_Certificate(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.BACHELOR_DEGREE_CERTIFICATE]}
            success={successes[DocumentType.BACHELOR_DEGREE_CERTIFICATE]}
          />
          <FileUpload
            label="Bachelor's Degree Transcript"
            inputId="bachelorsTranscriptFile"
            file={bachelor_Degree_Transcript}
            setFile={setBachelor_Degree_Transcript}
            onFileChange={(file) => setBachelor_Degree_Transcript(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.BACHELOR_DEGREE_TRANSCRIPT]}
            success={successes[DocumentType.BACHELOR_DEGREE_TRANSCRIPT]}
          />
          <FileUpload
            label="Personal Statement File"
            inputId="personalStatementFile"
            file={personal_Statement}
            setFile={setPersonal_Statement}
            onFileChange={(file) => setPersonal_Statement(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.PERSONAL_STATEMENT]}
            success={successes[DocumentType.PERSONAL_STATEMENT]}
          />
          <FileUpload
            label="Refrence Letter 1"
            inputId="refrenceLetterOneFile"
            file={refrence_Letter1}
            setFile={setRefrence_Letter1}
            onFileChange={(file) => setRefrence_Letter1(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.REFERENCE_LETTER1]}
            success={successes[DocumentType.REFERENCE_LETTER1]}
          />
          <FileUpload
            label="Refrence Letter 2"
            inputId="refrenceLetterTwoFile"
            file={refrence_Letter2}
            setFile={setRefrence_Letter2}
            onFileChange={(file) => setRefrence_Letter2(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.REFERENCE_LETTER2]}
            success={successes[DocumentType.REFERENCE_LETTER2]}
          />
          <FileUpload
            label="Research Thesis"
            inputId="research_Thesis"
            file={research_Thesis}
            setFile={setResearch_Thesis}
            onFileChange={(file) => setResearch_Thesis(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.RESEARCH_THESIS]}
            success={successes[DocumentType.RESEARCH_THESIS]}
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
            "Submit Application"
          )}
        </button.PrimaryButton>
      </form>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <ApplicationSuccessfull onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default Doctorial;
