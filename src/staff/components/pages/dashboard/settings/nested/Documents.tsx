import { useState } from "react";
import { uploadApplication } from "../../../../../../shared/redux/admin/services/application.services";
import { DocumentType } from "../../../../../../data/data";
import { toast } from "react-toastify";
import FileUpload from "../../../../../../shared/fileUpload/FileUpload";
import {button} from "../../../../../../shared/buttons/Button"
import ReactLoading from "react-loading";

const Documents = () => {
  const [pASSPORT, setPASSPORT] = useState<File | null>(null);
  const [rEfLETTER, setREFLETTER] = useState<File | null>(null);
  const [iDCard, setIDCard] = useState<File | null>(null);
  const [cACDOC, setCACDOC] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);


  const handleBrowseFileClick = async (inputId: string): Promise<void> => {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
    }
  };

  const areAllFilesUploaded = () => {
    return pASSPORT && rEfLETTER && iDCard && cACDOC;
  };

  const submitDocument = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const endpoint = `/media/admin/registration/upload-doc`;

      const uploadDocument = async (
        file: File | null,
        documentType: string,
      ) => {
        if (file) {
          const form = new FormData();
          form.append("file", file);
          form.append("documentType", documentType);
          const response = await uploadApplication(endpoint, form);
          return response;
        }
        return null;
      };

      const responses = await Promise.all([
        pASSPORT ? uploadDocument(pASSPORT, DocumentType.PASSPORT) : null,
        rEfLETTER ? uploadDocument(rEfLETTER, DocumentType.REFLETTER) : null,
        iDCard ? uploadDocument(iDCard, DocumentType.IDCARD) : null,
        cACDOC ? uploadDocument(cACDOC, DocumentType.CACDOC) : null,
      ]);

      const allSuccessful = responses.every(
        (response) => response?.status === 201,
      );

      if (allSuccessful) {
        toast.success("documents uploaded successfully")
      } else {
        responses.forEach((response, index) => {
          if (response?.status !== 201) {
            const type = [
              DocumentType.PASSPORT,
              DocumentType.REFLETTER,
              DocumentType.IDCARD,
              DocumentType.CACDOC,
            ][index];
            toast.error(`Failed to upload ${type}. Please try again.`);
          }
        });
      }
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
          onFileChange={(file) => setPASSPORT(file)}
          onBrowseClick={handleBrowseFileClick}
          asterisk
        />
        <FileUpload
          label="Reference Letter"
          labelClassName="font-medium text-purple-deep"
          inputId="referenceLetter"
          file={rEfLETTER}
          setFile={setREFLETTER}
          onFileChange={(file) => setREFLETTER(file)}
          onBrowseClick={handleBrowseFileClick}
          asterisk
        />
        <FileUpload
          label="Valid ID Card"
          labelClassName="font-medium text-purple-deep"
          inputId="validIdCard"
          file={iDCard}
          setFile={setIDCard}
          onFileChange={(file) => setIDCard(file)}
          onBrowseClick={handleBrowseFileClick}
          asterisk
        />
        <FileUpload
          label="CAC (mandatory for registered business)"
          labelClassName="font-medium text-purple-deep"
          inputId="cac"
          file={cACDOC}
          setFile={setCACDOC}
          onFileChange={(file) => setCACDOC(file)}
          onBrowseClick={handleBrowseFileClick}
          asterisk
        />
      </div>
  
      <div className="mt-[9px] flex w-full justify-between">
        <button.PrimaryButton
        onClick={submitDocument}
          disabled={loading || !areAllFilesUploaded()}
          className="mt-[2.5em] w-[30%] rounded-full bg-linear-gradient py-[13px] text-lg font-semibold text-white"
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
  
  )
}

export default Documents