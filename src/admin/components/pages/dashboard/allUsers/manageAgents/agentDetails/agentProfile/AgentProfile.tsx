import React, { useState, useEffect } from 'react';
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
import { updateAgent, updateUserBankDetails } from '../../../../../../../../shared/redux/admin/slices/application.slices';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../../../../shared/redux/store';
import { Dropdown, DropdownItem } from '../../../../../../../../shared/dropDown/DropDown';
import { useBanks } from '../../../../../../../../shared/redux/hooks/admin/getAdminProfile';
import { getAccountName } from '../../../../../../../../shared/redux/admin/services/application.services';

interface AgentProfileProps {
  email: string;
  loading: boolean;
  error: string | null;
  agentId: string;
}

interface FormData {
  personalDetails: {
    firstName: string;
    lastName: string;
    middleName: string;
    gender: string;
  };
  bankDetails: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName: string;
  };
}

interface AgentDetails {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
}

interface BankDetails {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
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

interface Banks {
  name: string;
  code: string;
}

const AgentProfile: React.FC<AgentProfileProps> = ({
  email,
  loading: initialLoading,
  error,
  agentId,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { allBanks, loading: bankLoading } = useBanks();
  const banks: Banks[] = allBanks || [];
  const [agentData, setAgentData] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [loading, setLoading] = useState(initialLoading);
  const [updatingData, setUpdatingData] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: File }>({});
  const [selectedFileNames, setSelectedFileNames] = useState<{ [key: string]: string }>({});
  const [accountVerificationLoading, setAccountVerificationLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Banks | null>(null);
  const [formData, setFormData] = useState<FormData>({
    personalDetails: {
      firstName: '',
      lastName: '',
      middleName: '',
      gender: '',
    },
    bankDetails: {
      accountNumber: '',
      accountName: '',
      bankCode: '',
      bankName: '',
    },
  });

  const dropdownItems: DropdownItem[] = banks?.map((bank:any) => ({
    name: bank.name,
  }));

  const handleSubmit = async () => {
    if (email) {
      try {
        setLoading(true);
        const response = await dispatch(findAgentByEmail(email) as any);
        if (response?.payload) {
          setAgentData(response.payload);
          setFormData({
            personalDetails: {
              firstName: response?.payload?.profile?.firstName || '',
              lastName: response?.payload?.profile?.lastName || '',
              middleName: response?.payload?.profile?.middleName || '',
              gender: response?.payload?.profile?.gender || '',
            },
            bankDetails: {
              accountNumber: response?.payload?.bankAccounts?.[0]?.accountNumber || '',
              accountName: response?.payload?.bankAccounts?.[0]?.accountName || '',
              bankCode: response?.payload?.bankAccounts?.[0]?.bankCode || '',
              bankName: response?.payload?.bankAccounts?.[0]?.bankName || '',
            },
          });
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

  const handleInputChange = (section: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const getFileTypeFromUrl = (url: string): string => {
    const extension = url?.split('.')?.pop()?.toLowerCase();
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [documentType]: file }));
      setSelectedFileNames(prev => ({ ...prev, [documentType]: file.name }));
    }
  };

  const updateAllDetails = async () => {
    setUpdatingData(true);
    const updates: Promise<any>[] = [];
    const successMessages: string[] = [];
    const errorMessages: string[] = [];

    try {
      if (Object.values(formData.personalDetails).some(value => value !== '')) {
        updates.push(
          dispatch(updateAgent({
            id: agentId,
            details: formData.personalDetails as AgentDetails
          }))
            .then(() => successMessages?.push('Personal details updated successfully'))
            .catch(() => errorMessages?.push('Failed to update personal details'))
        );
      }

      if (Object.values(formData?.bankDetails)?.some(value => value !== '')) {
        updates.push(
          dispatch(updateUserBankDetails({
            id: agentId,
            details: formData.bankDetails as BankDetails
          }))
            .then(() => successMessages?.push('Bank details updated successfully'))
            .catch(() => errorMessages?.push('Failed to update bank details'))
        );
      }

      const documentUpdates = Object?.entries(files)?.map(async ([documentType, file]) => {
        const doc = agentData?.agentRegistrationDoc?.find(
          (d: any) => d?.documentType === documentType
        );
        if (file && doc) {
          const form = new FormData();
          form.append("file", file);
          const endpoint = `/media/registration/upload-doc/${doc?.id}`;
          return updateRegistrationUploadedDocument(endpoint, form)
            .then(response => {
              if (response?.status === 201) {
                successMessages?.push(`Document ${documentType} updated successfully`);
              } else {
                errorMessages?.push(`Failed to update document ${documentType}`);
              }
            })
            .catch(() => errorMessages?.push(`Failed to update document ${documentType}`));
        }
      });

      updates?.push(...documentUpdates);

      await Promise?.all(updates);

      if (successMessages?.length > 0) {
        toast.success(successMessages?.join(', '));
      }
      if (errorMessages?.length > 0) {
        toast.error(errorMessages?.join(', '));
      }

    } catch (error) {
      toast.error('An error occurred while updating details');
    } finally {
      setUpdatingData(false);
      setEditMode(false);
      handleSubmit();
    }
  };

  const discardChanges = () => {
    setFiles({});
    setSelectedFileNames({});
    setFormData({
      personalDetails: {
        firstName: agentData?.profile?.firstName || '',
        lastName: agentData?.profile?.lastName || '',
        middleName: agentData?.profile?.middleName || '',
        gender: agentData?.profile?.gender || '',
      },
      bankDetails: {
        accountNumber: agentData?.bankAccounts?.[0]?.accountNumber || '',
        accountName: agentData?.bankAccounts?.[0]?.accountName || '',
        bankCode: agentData?.bankAccounts?.[0]?.bankCode || '',
        bankName: agentData?.bankAccounts?.[0]?.bankName || '',
      },
    });
    setEditMode(false);
  };

  useEffect(() => {
    if (agentData?.bankAccounts?.[0]) {
      const bankAccount = agentData?.bankAccounts[0];
      setSelectedBank({
        name: bankAccount.bankName,
        code: bankAccount.bankCode
      });
    }
  }, [agentData]);

  useEffect(() => {
    const verifyAccount = async () => {
      if (!selectedBank || !formData.bankDetails.accountNumber || formData.bankDetails.accountNumber.length < 10) return;

      setAccountVerificationLoading(true);

      const endpoint = `/auth/bank/accountInfo?code=${encodeURIComponent(selectedBank.code)}&account_number=${encodeURIComponent(formData.bankDetails.accountNumber)}`;

      try {
        const response: any = await getAccountName(endpoint);
        
        if (response?.status === 200 && response.data.status) {
          setFormData(prev => ({
            ...prev,
            bankDetails: {
              ...prev.bankDetails,
              accountName: response?.data?.data?.account_name,
              bankCode: selectedBank.code,
              bankName: selectedBank.name
            }
          }));
        } else {
          toast.error(response.data.message || "Failed to fetch account details");
        }
      } catch (error) {
        toast.error("Account doesn't exist");
        setFormData(prev => ({
          ...prev,
          bankDetails: {
            ...prev.bankDetails,
            accountName: ''
          }
        }));
      } finally {
        setAccountVerificationLoading(false);
      }
    };

    if (editMode) {
      verifyAccount();
    }
  }, [formData?.bankDetails?.accountNumber, selectedBank, editMode]);


  const handleBankSelect = (item: DropdownItem) => {
    const selected = banks?.find((bank) => bank?.name === item?.name);
    if (selected) {
      setSelectedBank(selected);
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          bankName: selected.name,
          bankCode: selected.code,
          accountName: ''
        }
      }));
    }
  };

  const renderBankDetailsSection = () => (
    <section className="section-personal-details flex flex-col gap-[1.2em]">
      <h2 className="text-xl font-normal text-gray-400">Bank Details</h2>
      <div className="grid grid-cols-1 gap-[1.2em] md:grid-cols-2">
        <div className="w-full">
          <label className="flex-start flex font-medium">Bank Name</label>
          <div className="mt-[1em]">
            <Dropdown
              label=""
              items={dropdownItems}
              selectedItem={selectedBank ? { name: selectedBank.name } : null}
              onSelectItem={handleBankSelect}
              searchVisible
              loading={bankLoading}
              placeholder="Select Bank"
              disabled={!editMode}
            />
          </div>
        </div>
        <div className="w-full">
          <label htmlFor="accountNumber" className="flex-start flex font-medium">
            Account Number
          </label>
          <input
            id="accountNumber"
            name="accountNumber"
            value={formData.bankDetails.accountNumber}
            onChange={(e) => {
              if (editMode) {
                const value = e.target.value?.replace(/\D/g, '').slice(0, 10);
                setFormData(prev => ({
                  ...prev,
                  bankDetails: {
                    ...prev.bankDetails,
                    accountNumber: value,
                    accountName: '' 
                  }
                }));
              }
            }}
            readOnly={!editMode}
            placeholder="Enter account number"
            className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
          />
        </div>
        <div className="w-full col-span-2 md:col-span-1">
          <label htmlFor="accountName" className="flex-start font-medium">
            Account Name
          </label>
          <div className="relative">
            <input
              id="accountName"
              name="accountName"
              value={formData.bankDetails.accountName}
              readOnly
              placeholder="Account name will appear here"
              className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-gray-100 p-3 focus:outline-none"
            />
            {accountVerificationLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <ReactLoading color="#000000" width={20} height={20} type="spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const renderInput = (
    id: string,
    name: string,
    value: string,
    placeholder: string,
    section: keyof FormData
  ) => (
    <input
      id={id}
      name={name}
      value={editMode ? formData[section][name as keyof typeof formData[typeof section]] : value || ''}
      onChange={(e) => editMode && handleInputChange(section, name, e.target.value)}
      readOnly={!editMode}
      placeholder={placeholder}
      className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none placeholder-gray-400"
    />
  );

  if (loading) {
    return (
      <div className="w-full">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 5 })?.map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const hasDocuments = agentData?.agentRegistrationDoc?.length > 0;

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
                {renderInput("firstName", "firstName", agentData?.profile?.firstName, "Not provided", "personalDetails")}
              </div>
              <div className="w-full">
                <label htmlFor="lastName" className="flex-start flex font-medium">
                  Last Name
                </label>
                {renderInput("lastName", "lastName", agentData?.profile?.lastName, "Not provided", "personalDetails")}
              </div>
            </div>
            <div className="mt-[1em] flex flex-row gap-[3em]">
              <div className="w-full">
                <label htmlFor="middleName" className="flex-start font-medium">
                  Other Name <span className="text-gray-500">(Optional)</span>
                </label>
                {renderInput("middleName", "middleName", agentData?.profile?.middleName, "Not provided", "personalDetails")}
              </div>
              <div className="w-full">
                <label htmlFor="email" className="flex-start flex font-medium">
                  Email Address
                </label>
                {renderInput("email", "email", agentData?.email || email, "Not provided", "personalDetails")}
              </div>
            </div>
          </div>
        </section>

        {renderBankDetailsSection()}

        <section className="section-personal-details flex flex-col gap-[1.2em]">
          <h2 className="text-xl font-normal text-gray-400">Uploaded Documents</h2>
          <div className="grid grid-cols-1 gap-[1.2em] md:grid-cols-2">
            {hasDocuments ? (
              agentData?.agentRegistrationDoc?.map((doc: any) => (
                <div key={doc?.id} className="w-full">
                  <div>
                    <label htmlFor={doc?.documentType}>
                      {doc?.documentType}
                    </label>
                  </div>
                  <div className="mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1em] py-4">
                    <label
                      htmlFor={doc?.documentType}
                      className="flex flex-grow flex-col dark:text-white cursor-pointer"
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-5">
                          <div className="flex gap-2">
                            <img src={fileImg} alt="file_img" />
                            <p className="text-lg truncate max-w-[170px] whitespace-nowrap font-light">
                              {selectedFileNames[doc?.documentType] || doc?.name || "No file uploaded"}
                            </p>
                          </div>
                          {doc.publicURL && (
                            <button type="button" onClick={() => handlePreview(doc?.publicURL)} className="mr-4">
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
       </section>

       <div className="mr-auto mt-4 flex flex-col justify-start w-full">
         <button.PrimaryButton
           className="mt-[3em] w-[50%]  gap-2 rounded-full bg-linear-gradient py-[11px] px-[2em] text-center font-medium text-white"
           type="button"
           onClick={editMode ? updateAllDetails : () => setEditMode(true)}
           disabled={updatingData}
         >
           {updatingData ? (
             <ReactLoading
               color="#FFFFFF"
               width={25}
               height={25}
               type="spin"
             />
           ) : editMode ? (
             "Save All Changes"
           ) : (
             "Edit Profile"
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
     </div>

     <DocumentPreviewModal
       isOpen={isPreviewOpen}
       onRequestClose={() => {
         setIsPreviewOpen(false);
         setPreviewUrl(null);
         setPreviewFileType("");
       }}
       previewUrl={previewUrl}
       previewFileType={previewFileType}
     />
   </main>
 );
};

export default AgentProfile;