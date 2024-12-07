import React, { useState, useEffect } from "react";
import { uploadApplication } from "../../../../../../shared/redux/admin/services/application.services";
import { DocumentType } from "../../../../../../data/data";
import { toast } from "react-toastify";
import FileUpload from "../../../../../../shared/fileUpload/FileUpload";
import { button } from "../../../../../../shared/buttons/Button";
import ReactLoading from "react-loading";
import useUserProfile from "../../../../../../shared/redux/hooks/shared/getUserProfile";

const Documents = () => {
  const { userProfile, loading: isLoading } = useUserProfile();
  const [pASSPORT, setPASSPORT] = useState<File | null>(null);
  const [rEfLETTER, setREFLETTER] = useState<File | null>(null);
  const [iDCard, setIDCard] = useState<File | null>(null);
  const [cACDOC, setCACDOC] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, boolean>>({});
  const [changedFiles, setChangedFiles] = useState<Set<DocumentType>>(
    new Set()
  );

  useEffect(() => {
    if (
      userProfile &&
      userProfile.user &&
      userProfile.user.staffRegistrationDoc
    ) {
      userProfile.user.staffRegistrationDoc.forEach((doc: any) => {
        const file = new File([], doc.name, {
          type: "application/octet-stream",
        });
        switch (doc.documentType) {
          case DocumentType.PASSPORT:
            setPASSPORT(file);
            break;
          case DocumentType.REFLETTER:
            setREFLETTER(file);
            break;
          case DocumentType.IDCARD:
            setIDCard(file);
            break;
          case DocumentType.CACDOC:
            setCACDOC(file);
            break;
        }
      });
    }
  }, [userProfile]);

  const handleBrowseFileClick = async (inputId: string): Promise<void> => {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  };

  const submitDocument = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (changedFiles.size === 0) return;

    setLoading(true);
    setErrors({});

    try {
      const endpoint = `/media/admin/registration/upload-doc`;

      const documents = [
        { type: DocumentType.PASSPORT, file: pASSPORT },
        { type: DocumentType.REFLETTER, file: rEfLETTER },
        { type: DocumentType.IDCARD, file: iDCard },
        { type: DocumentType.CACDOC, file: cACDOC },
      ].filter(({ type }) => changedFiles.has(type));

      for (const { type, file } of documents) {
        if (!file) continue;

        try {
          const form = new FormData();
          form.append("file", file);
          form.append("documentType", type);

          const response = await uploadApplication(endpoint, form);
          if (response.status === 201) {
            setSuccesses((prev) => ({ ...prev, [type]: true }));
            toast.success(`${type} uploaded successfully`);
          }
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            [type]: `Failed to upload ${type}. Please try again.`,
          }));
          toast.error(`Failed to upload ${type}`);
        }
      }

      setChangedFiles(new Set());
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-outfit">
      <div className="mt-[1em] flex flex-col gap-3 lg:w-[85%]">
        <header>
          <h1 className="text-xl font-semibold">Upload Documents</h1>
        </header>

        <div className="mt-[1.5em] grid w-full max-w-[%] grid-cols-1 gap-[1.8em] text-grey md:grid-cols-2">
          <FileUpload
            label="Passport Photograph"
            labelClassName="font-medium text-purple-deep"
            inputId="servicePassportPhotograph"
            file={pASSPORT}
            setFile={setPASSPORT}
            onFileChange={(file) => {
              setPASSPORT(file);
              if (file) {
                setChangedFiles((prev) =>
                  new Set(prev).add(DocumentType.PASSPORT)
                );
              }
            }}
            onBrowseClick={handleBrowseFileClick}
            enablePreview={false}
            asterisk
            error={errors[DocumentType.PASSPORT]}
            success={successes[DocumentType.PASSPORT]}
          />
          <FileUpload
            label="Reference Letter"
            labelClassName="font-medium text-purple-deep"
            inputId="referenceLetter"
            file={rEfLETTER}
            setFile={setREFLETTER}
            onFileChange={(file) => {
              setREFLETTER(file);
              if (file) {
                setChangedFiles((prev) =>
                  new Set(prev).add(DocumentType.REFLETTER)
                );
              }
            }}
            onBrowseClick={handleBrowseFileClick}
            enablePreview={false}
            asterisk
            error={errors[DocumentType.REFLETTER]}
            success={successes[DocumentType.REFLETTER]}
          />
          <FileUpload
            label="Valid ID Card"
            labelClassName="font-medium text-purple-deep"
            inputId="validIdCard"
            file={iDCard}
            setFile={setIDCard}
            onFileChange={(file) => {
              setIDCard(file);
              if (file) {
                setChangedFiles((prev) =>
                  new Set(prev).add(DocumentType.IDCARD)
                );
              }
            }}
            onBrowseClick={handleBrowseFileClick}
            enablePreview={false}
            asterisk
            error={errors[DocumentType.IDCARD]}
            success={successes[DocumentType.IDCARD]}
          />
          <FileUpload
            label="CAC (mandatory for registered business)"
            labelClassName="font-medium text-purple-deep"
            inputId="cac"
            file={cACDOC}
            setFile={setCACDOC}
            onFileChange={(file) => {
              setCACDOC(file);
              if (file) {
                setChangedFiles((prev) =>
                  new Set(prev).add(DocumentType.CACDOC)
                );
              }
            }}
            onBrowseClick={handleBrowseFileClick}
            enablePreview={false}
            asterisk
            error={errors[DocumentType.CACDOC]}
            success={successes[DocumentType.CACDOC]}
          />
        </div>

        <div className="mt-[9px] flex w-full justify-between">
          <button.PrimaryButton
            onClick={submitDocument}
            disabled={loading || changedFiles.size === 0}
            className="mt-[2.5em] w-[40%] lg:w-[30%] rounded-full bg-linear-gradient py-[13px] text-lg font-semibold text-white"
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
              "Update Documents"
            )}
          </button.PrimaryButton>
        </div>
      </div>
    </main>
  );
};

export default Documents;
