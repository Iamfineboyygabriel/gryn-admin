import { useEffect, useState } from "react";
import { button } from "../../../../../../../../../shared/buttons/Button";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { DocumentType } from "../../../../../../../../../data/data";
import { uploadApplication } from "../../../../../../../../../shared/redux/shared/services/shareApplication.services";
import FileUpload from "../../../../../../../../../shared/fileUpload/FileUpload";
import Modal from "../../../../../../../../../shared/modal/Modal";
import ApplicationSuccessfull from "../../../../../../../../../shared/modal/ApplicationSuccessfull";

const PreMasters = ({ onNext, applicationId }: any) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [resume, setResume] = useState<File | null>(null);
  const [international_Passport, setInternational_Passport] =
    useState<File | null>(null);
  const [old_Level, setOld_Level] = useState<File | null>(null);
  const [ond_Certificate, setOnd_Certificate] = useState<File | null>(null);
  const [ond_Transcript, setOnd_Transcript] = useState<File | null>(null);
  const [old_Level_Scratch_Card, setOld_Level_Scratch_Card] = useState<File | null>(null);
  const [hnd_Certificate, setHnd_Certificate] = useState<File | null>(null)
  const [hnd_Transcript, setHnd_Transcript] = useState<File | null>(null); 
  const [refLetter, setRefLetter] = useState<File | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, boolean>>({});

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
        { type: DocumentType.OLD_LEVEL_SCRATCH_CARD, file: old_Level_Scratch_Card },
        { type: DocumentType.OND_CERTIFICATE, file: ond_Certificate },
        { type: DocumentType.OND_TRANSCRIPT, file: ond_Transcript },
        { type: DocumentType.HND_CERTIFICATE, file: hnd_Certificate },
        { type: DocumentType.HND_TRANSCRIPT, file: hnd_Transcript },
        { type: DocumentType.REFLETTER, file: refLetter },

        
      ];

      const documentsToUpload = documents.filter(
        ({ type, file }) => file && !successes[type],
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
        }),
      );

      const allSuccessful = documents.every(
        ({ type }) =>
          successes[type] || results.some((r) => r.type === type && r.success),
      );

      if (allSuccessful) {
        setTimeout(() => {
          handleOpenModal();
        }, 2000);
      }
    } catch (error) {
      toast.error(
        "An error occurred while uploading documents. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main>
      <form onSubmit={submitDocument}>
        <div className="mt-[1.5em] grid w-[80%] grid-cols-2 gap-8">
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
            label="OND Certificate"
            inputId="ond_Certificate"
            file={ond_Certificate}
            setFile={setOnd_Certificate}
            onFileChange={(file) => setOnd_Certificate(file)}
            onBrowseClick={async () => handleBrowseFileClick("ond_Cetificate")}
            asterisk
            error={errors[DocumentType.OND_CERTIFICATE]}
            success={successes[DocumentType.OND_CERTIFICATE]}
          />
             <FileUpload
            label="OND Transcript"
            inputId="ond_Transcript"
            file={ond_Transcript}
            setFile={setOnd_Transcript}
            onFileChange={(file) => setOnd_Transcript(file)}
            onBrowseClick={async () => handleBrowseFileClick("ond_Transcript")}
            asterisk
            error={errors[DocumentType.OND_TRANSCRIPT]}
            success={successes[DocumentType.OND_TRANSCRIPT]}
          />
               <FileUpload
            label="HND Certificate"
            inputId="hnd_Certificate"
            file={hnd_Certificate}
            setFile={setHnd_Certificate}
            onFileChange={(file) => setHnd_Certificate(file)}
            onBrowseClick={async () => handleBrowseFileClick("hnd_Cetificate")}
            asterisk
            error={errors[DocumentType.HND_CERTIFICATE]}
            success={successes[DocumentType.HND_CERTIFICATE]}
          />
             <FileUpload
            label="HND Transcript"
            inputId="hnd_Transcript"
            file={hnd_Transcript}
            setFile={setHnd_Transcript}
            onFileChange={(file) => setHnd_Transcript(file)}
            onBrowseClick={async () => handleBrowseFileClick("hnd_Transcript")}
            asterisk
            error={errors[DocumentType.OND_TRANSCRIPT]}
            success={successes[DocumentType.OND_TRANSCRIPT]}
          />
          <FileUpload
            label="WAEC/NECO/IELTS Certificate"
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
            label="WAEC Scratch Card"
            inputId="oldLevelScratchCard"
            file={old_Level_Scratch_Card}
            setFile={setOld_Level_Scratch_Card}
            onFileChange={(file) => setOld_Level_Scratch_Card(file)}
            onBrowseClick={async () => handleBrowseFileClick("oldLevelFile")}
            asterisk
            error={errors[DocumentType.OLD_LEVEL_SCRATCH_CARD]}
            success={successes[DocumentType.OLD_LEVEL_SCRATCH_CARD]}
          />
            <FileUpload
            label="Refrence Letter "
            inputId="refrenceLetterFile"
            file={refLetter}
            setFile={setRefLetter}
            onFileChange={(file) => setRefLetter(file)}
            onBrowseClick={handleBrowseFileClick}
            asterisk
            error={errors[DocumentType.REFLETTER]}
            success={successes[DocumentType.REFLETTER]}
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
          <ApplicationSuccessfull to="/staff/dashboard/application" onClose={handleCloseModal} />
        </Modal>
      )}
    </main>
  );
};

export default PreMasters;