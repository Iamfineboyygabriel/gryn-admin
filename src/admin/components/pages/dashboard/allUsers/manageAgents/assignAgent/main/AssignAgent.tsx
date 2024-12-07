import { useState } from "react";
import { button } from "../../../../../../../../shared/buttons/Button";
import { useLocation, useNavigate } from "react-router";
import DocumentPreviewModal from "../../../../../../../../shared/modal/DocumentPreviewModal";
import fileImg from "../../../../../../../../assets/svg/File.svg";
import eye from "../../../../../../../../assets/svg/eyeImg.svg";
import user from "../../../../../../../../assets/avatar.png";
import Modal from "../../../../../../../../shared/modal/Modal";
import FindStaffByEmail from "../../../../../../../../shared/modal/FindStaffByEmail";

interface AgentData {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  middleName: string;
  id: string;
  bankAccounts: Array<{
    bankCode: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
  }>;
  profile: {
    firstName: string;
    lastName: string;
    userId: string;
    [key: string]: any;
  };
  agentRegistrationDoc: Array<{
    name: string;
    publicURL: string;
    documentType: string;
  }>;
  avatar: {
    publicURL: string;
  };
}

const AssignAgent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const agentData: AgentData = location.state?.agentData;
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase();
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

  return (
    <main className="font-outfit">
      <h1 className="text-2xl font-bold dark:text-white">Application</h1>
      <div className="mt-[1em] h-auto w-full overflow-auto rounded-lg bg-white px-[2em] py-3 pb-[10em] dark:bg-gray-800">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-medium dark:text-gray-700">
                Manage Student /
                <span className="ml-1 font-medium text-primary-700 dark:text-white">
                  Agent Details
                </span>
              </h1>
            </div>
            <button.PrimaryButton className="btn-2" onClick={handleBackClick}>
              Back
            </button.PrimaryButton>
          </div>
        </header>
        <div className="flex w-[85%] flex-col mt-[2em] gap-[3em]">
          <section className="section-personal-details flex flex-col gap-[1.2em]">
            <h2 className="text-xl font-normal text-gray-400">
              Personal Details
            </h2>
            <div>
              <div>
                <img
                  src={agentData?.profile.avatar?.publicURL || user}
                  alt="profile"
                  className="w-[5em] h-[5em] rounded-full object-cover"
                />
              </div>
              <div className="flex mt-[1.7em] flex-col lg:flex-row gap-[3em]">
                <div className="w-full">
                  <label
                    htmlFor="firstName"
                    className="flex-start flex font-medium"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    value={agentData?.profile?.firstName}
                    className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="lastName"
                    className="flex-start flex font-medium"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={agentData?.profile?.lastName}
                    className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-[1em] flex flex-col lg:flex-row gap-[3em]">
                <div className="w-full">
                  <label
                    htmlFor="middleName"
                    className="flex-start font-medium"
                  >
                    Other Name <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    id="otherName"
                    name="otherName"
                    value={agentData?.profile?.middleName}
                    className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:text-white"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="flex-start flex font-medium"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={agentData?.email}
                    readOnly
                    className="border-border cursor-not-allowed focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="section-personal-details flex flex-col gap-[1.2em]">
            <h2 className="text-xl font-normal text-gray-400">Bank Details</h2>

            <div className="grid grid-cols-1 gap-[1.2em] md:grid-cols-1">
              <div className="w-full">
                <label
                  htmlFor="bankName"
                  className="flex-start flex font-medium"
                >
                  Bank Name
                </label>
                <input
                  id="bankName"
                  name="bankName"
                  required
                  value={agentData?.bankAccounts[0]?.bankName}
                  className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="accountName"
                  className="flex-start flex font-medium"
                >
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  required
                  value={agentData?.bankAccounts[0]?.accountNumber}
                  className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none"
                />
              </div>

              <div className="w-full col-span-2 md:col-span-1">
                <label htmlFor="middleName" className="flex-start font-medium">
                  Account Name
                </label>
                <input
                  id="accountName"
                  name="accountName"
                  value={agentData?.bankAccounts[0]?.accountName}
                  className="border-border focus:border-border mt-[1em] w-full rounded-lg border-[1px] bg-inherit p-3 focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </section>

          <section className="section-personal-details flex flex-col gap-[1.2em]">
            <h2 className="text-xl font-normal text-gray-400">
              Uploaded Documents
            </h2>
            <div className="grid grid-cols-1 gap-[1.2em] md:grid-cols-2">
              {agentData?.agentRegistrationDoc?.map((doc: any) => (
                <div key={doc.id} className="w-full">
                  <div>
                    <label
                      className="dark:text-white"
                      htmlFor={doc.documentType}
                    >
                      {doc?.documentType}
                    </label>
                  </div>
                  <div className="mt-2 flex items-center justify-between rounded-lg border-[1px] border-gray-300 px-[1em] py-5">
                    <label
                      htmlFor={doc?.documentType}
                      className="flex flex-grow flex-col dark:text-white cursor-pointer"
                    >
                      <div className="flex items-center gap-5">
                        <div className="flex gap-2">
                          <img src={fileImg} alt="file_img" />
                          <p className="text-lg whitespace-nowrap font-light">
                            {doc?.name}
                          </p>
                        </div>
                      </div>
                    </label>
                    <div className="flex gap-[2px]">
                      <button
                        onClick={() => handlePreview(doc.publicURL)}
                        className="flex items-center gap-1 rounded-full bg-purple-white px-3 py-[5px] text-center font-medium text-[#660066]"
                      >
                        <img src={eye} alt="eye" />
                        <span className="mr-3">View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <button.PrimaryButton
            onClick={handleOpenModal}
            className="w-[23%] gap-2 rounded-full bg-linear-gradient py-[12px] text-center text-lg font-medium text-white"
          >
            Assign Staff
          </button.PrimaryButton>
        </div>
      </div>
      <div></div>
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onRequestClose={closePreviewModal}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data-aos="zoom-in"
        >
          <FindStaffByEmail
            redirect="/admin/dashboard/all_users/assign_agent"
            onClose={handleCloseModal}
            agentId={agentData.id}
          />
        </Modal>
      )}
    </main>
  );
};

export default AssignAgent;
