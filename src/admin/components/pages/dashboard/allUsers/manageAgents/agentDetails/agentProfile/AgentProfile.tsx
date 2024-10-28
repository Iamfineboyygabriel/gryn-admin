import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../../../../../../shared/redux/hooks/shared/reduxHooks';
import { findAgentByEmail } from '../../../../../../../../shared/redux/shared/slices/shareApplication.slices';
import user from "../../../../../../../../assets/avatar.png";
import fileImg from "../../../../../../../../assets/svg/File.svg";
import DocumentPreviewModal from '../../../../../../../../shared/modal/DocumentPreviewModal';
import { AiOutlineEye } from 'react-icons/ai';
import { button } from "../../../../../../../../shared/buttons/Button";
import upload from "../../../../../../../../assets/svg/Upload.svg";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { updateRegistrationUploadedDocument } from '../../../../../../../../shared/redux/shared/services/shareApplication.services';

interface Application {
  id: number;
  email: string;
}

interface AgentProfileProps {
  applicationDetails: {
    application: Application[];
  };
  loading: boolean;
  error: string | null;
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 5 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AgentProfile: React.FC<AgentProfileProps> = ({
  applicationDetails,
  loading: initialLoading,
  error,
}) => {
  const dispatch = useAppDispatch();
  const [agentData, setAgentData] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [loading, setLoading] = useState(initialLoading);
  const [updatingDocuments, setUpdatingDocuments] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [selectedFileNames, setSelectedFileNames] = useState<{ [key: string]: string }>({});

  const email = applicationDetails?.application[0]?.email;

  const handleSubmit = async () => {
    if (email) {
      try {
        setLoading(true);
        const response = await dispatch(findAgentByEmail(email) as any);
        if (response?.payload) {
          setAgentData(response.payload);
        }
      } catch (err) {
        console.error('Error fetching agent data', err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  useEffect(() => {
    if (email) {
      handleSubmit();
    }
  }, [email]);
  
  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [documentType]: file }));
      setSelectedFileNames(prev => ({ ...prev, [documentType]: file.name }));
    }
  };

  const updateDetails = async () => {
    setUpdatingDocuments(true);

    const successfulUploads: string[] = [];
    const failedUploads: string[] = [];

    try {
      await Promise.all(
        Object.entries(files).map(async ([documentType, file]) => {
          const doc = agentData?.agentRegistrationDoc?.find(
            (d: any) => d?.documentType === documentType,
          );
          if (file && doc) {
            try {
              const form = new FormData();
              form.append("file", file);
              const endpoint = `/media/registration/upload-doc/${doc?.id}`;
              const response = await updateRegistrationUploadedDocument(endpoint, form);
              if (response?.status === 201) {
                successfulUploads.push(documentType);
              } else {
                failedUploads.push(documentType);
              }
            } catch (error) {
              failedUploads.push(documentType);
            }
          }
        }),
      );

      if (successfulUploads.length > 0) {
        toast.success(`Successfully uploaded: ${successfulUploads.join(", ")}`);
      }
      if (failedUploads.length > 0) {
        toast.error(`Failed to upload: ${failedUploads.join(", ")}`);
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setUpdatingDocuments(false);
      setEditMode(false);
      handleSubmit(); 
    }
  };

  const discardChanges = () => {
    setFiles({});
    setSelectedFileNames({});
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="w-full">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const hasDocuments = agentData?.agentRegistrationDoc?.length > 0;

  const renderInput = (id: string, name: string, value: string, placeholder: string) => (
    <input
      id={id}
      name={name}
      required
      value={value || ''}
      readOnly
      placeholder={placeholder}
      className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none placeholder-gray-400"
    />
  );

  return (
    <main className='font-outfit'>
      <div className="flex w-[85%] flex-col mt-[2em] gap-[3em]">
        <section className="section-personal-details flex flex-col gap-[1.2em]">
          <h2 className="text-xl font-normal text-gray-400">Personal Details</h2>
          <div>
            <div>
              <img
                src={agentData?.profile?.avatar?.publicURL || user}
                alt="profile"
                className="w-[5em] h-[5em] rounded-full object-cover"
              />
            </div>
            <div className="flex mt-[1.7em] flex-row gap-[3em]">
              <div className="w-full">
                <label htmlFor="firstName" className="flex-start flex font-medium">
                  First Name
                </label>
                {renderInput("firstName", "firstName", agentData?.profile?.firstName, "Not provided")}
              </div>
              <div className="w-full">
                <label htmlFor="lastName" className="flex-start flex font-medium">
                  Last Name
                </label>
                {renderInput("lastName", "lastName", agentData?.profile?.lastName, "Not provided")}
              </div>
            </div>
            <div className="mt-[1em] flex flex-row gap-[3em]">
              <div className="w-full">
                <label htmlFor="middleName" className="flex-start font-medium">
                  Other Name <span className="text-gray-500">(Optional)</span>
                </label>
                {renderInput("middleName", "middleName", agentData?.profile?.middleName, "Not provided")}
              </div>
              <div className="w-full">
                <label htmlFor="email" className="flex-start flex font-medium">
                  Email Address
                </label>
                {renderInput("email", "email", agentData?.email || email, "Not provided")}
              </div>
            </div>
          </div>
        </section>

        <section className="section-personal-details flex flex-col gap-[1.2em]">
          <h2 className="text-xl font-normal text-gray-400">Bank Details</h2>

          <div className="grid grid-cols-1 gap-[1.2em] md:grid-cols-2">
            <div className="w-full">
              <label htmlFor="bankName" className="flex-start flex font-medium">
                Bank Name
              </label>
              {renderInput("bankName", "bankName", agentData?.bankAccounts?.[0]?.bankName, "Not provided")}
            </div>

            <div className="w-full">
              <label htmlFor="accountNumber" className="flex-start flex font-medium">
                Account Number
              </label>
              {renderInput("accountNumber", "accountNumber", agentData?.bankAccounts?.[0]?.accountNumber, "Not provided")}
            </div>

            <div className="w-full col-span-2 md:col-span-1">
              <label htmlFor="accountName" className="flex-start font-medium">
                Account Name
              </label>
              {renderInput("accountName", "accountName", agentData?.bankAccounts?.[0]?.accountName, "Not provided")}
            </div>
          </div>
        </section>
        
        <section className="section-personal-details flex flex-col gap-[1.2em]">
          <h2 className="text-xl font-normal text-gray-400">Uploaded Documents</h2>
          <div className="grid grid-cols-1 gap-[1.2em] md:grid-cols-2">
            {hasDocuments ? (
              agentData.agentRegistrationDoc.map((doc: any) => (
                <div key={doc.id} className="w-full">
                  <div>
                    <label className="dark:text-white" htmlFor={doc.documentType}>
                      {doc.documentType}
                    </label>
                  </div>
                  <div className="mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1em] py-4">
                    <label
                      htmlFor={doc.documentType}
                      className="flex flex-grow flex-col dark:text-white cursor-pointer"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-5">
                          <div className="flex gap-2">
                            <img src={fileImg} alt="file_img" />
                            <p className="text-lg truncate max-w-[170px] whitespace-nowrap font-light">
                              {selectedFileNames[doc.documentType] || doc.name || "No file uploaded"}
                            </p>
                          </div>
                          {doc.publicURL && (
                            <button type="button" onClick={() => handlePreview(doc.publicURL)} className="mr-4">
                              <AiOutlineEye />
                            </button>
                          )}
                        </div>

                        <input
                          type="file"
                          id={doc.documentType}
                          onChange={(e) => handleFileChange(e, doc.documentType)}
                          disabled={!editMode}
                          className="hidden"
                        />
                        <button.PrimaryButton
                          className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary-700 p-[10px] text-white dark:bg-gray-800"
                          onClick={() => document.getElementById(doc.documentType)?.click()}
                          disabled={!editMode}
                        >
                          <img src={upload} alt="upload icon" />
                          Upload
                        </button.PrimaryButton>
                      </div>
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <span className="col-span-2 text-red-500">No documents found.</span>
            )}
          </div>
          {hasDocuments && (
            <div className="mr-auto mt-4 flex flex-col items-center">
              <button.PrimaryButton
                className="m-auto mt-[3em] w-[100%] justify-center gap-2 rounded-full bg-linear-gradient py-[11px] px-[2em] text-center font-medium text-white"
                type="button"
                onClick={editMode ? updateDetails : () => setEditMode(true)}
                disabled={updatingDocuments}
              >
                {updatingDocuments ? (
                  <ReactLoading
                    color="#FFFFFF"
                    width={25}
                    height={25}
                    type="spin"
                  />
                ) : editMode ? (
                  "Save Changes"
                ) : (
                  "Update Application"
                )}
              </button.PrimaryButton>
              {editMode && (
                <span 
                  className="text-red-500 cursor-pointer mt-2" 
                  onClick={discardChanges}
                >
                  Discard Changes
                </span>
              )}
            </div>
          )}
        </section>
      </div>
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={closePreviewModal}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
    </main>
  );
};

export default AgentProfile;