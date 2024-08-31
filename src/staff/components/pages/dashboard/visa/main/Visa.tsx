import React, { useState } from "react";
import { button } from "../../../../../../shared/buttons/Button";
import plus from "../../../../../../assets/svg/plus.svg";
import { Link } from "react-router-dom";
import approved from "../../../../../../assets/svg/Approved.svg";
import rejected from "../../../../../../assets/svg/Rejected.svg";
import pending from "../../../../../../assets/svg/Pending.svg";
import eye from "../../../../../../assets/svg/eyeImg.svg";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import DocumentPreviewModal from "../../../../../../shared/modal/DocumentPreviewModal";
import { useAllVisa } from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import { FiSearch } from "react-icons/fi";

const escapeRegExp = (str: any) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
interface Document {
  id: number;
  name: string;
  publicURL: string;
  documentType: string;
  uploadType: string;
  applicationId: number | null;
  remark: string;
  paymentId: number;
  agentId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  id: number;
  applicationId: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  application: {
    degree: {
      university: string;
      degreeType: string;
      country: string;
      course: string;
    };
  };
  firstName: string;
  lastName: string;
  schoolName: string;
  documents: Document[];
  agent: {
    profile: {
      lastName: string;
      firstName: string;
    };
  };
  destination: string;
  issuedDate: string;
}

const Visa = () => {
  const { visaData } = useAllVisa();
  const [data, setData] = useState<Payment[]>(visaData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const highlightText = React.useMemo(() => {
    return (text: string, query: string) => {
      if (!query) return text;
      const escapedQuery = escapeRegExp(query);
      const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
      return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          part
        )
      );
    };
  }, []);

  const getStatusClassAndIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return { class: "text-green-500", icon: approved };
      case "REJECTED":
        return { class: "text-red-500", icon: rejected };
      case "PENDING":
        return { class: "text-yellow-500", icon: pending };
      default:
        return { class: "text-gray-500", icon: undefined };
    }
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
      case "doc":
        return "application/msword";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      default:
        return "application/octet-stream";
    }
  };

  const renderStatus = (remark: string, publicURL: string) => {
    const { class: statusClass, icon } = getStatusClassAndIcon(remark);
    return (
      <div className={`flex flex-col items-start text-xs ${statusClass}`}>
        <div className="flex items-center gap-2 text-black dark:text-white">
          <p>Paid</p>
          <button
            onClick={() => {
              setPreviewUrl(publicURL);
              setPreviewFileType(getFileTypeFromUrl(publicURL));
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1 rounded-full bg-purple-white px-3 py-[4px] text-center font-medium text-[#660066] dark:bg-gray-600 dark:text-white"
          >
            <img src={eye} alt="eye" />
            <span className="mr-3">View</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {icon && <img src={icon} alt="Status Icon" />}
          <p>{remark || "-"}</p>
        </div>
      </div>
    );
  };

  return (
    <main className="mt- font-outfit">
      <h1 className="text-2xl font-bold">Visa Application</h1>
      <div className="mt-[1em] h-auto w-full  rounded-lg bg-white p-3 pb-[10em] dark:bg-gray-800">
        <div className="flex justify-between">
          <div className="flex items-center gap-[1em]">
            <div className="relative w-full">
              <input
                type="text"
                className="border-border w-full rounded-full border-[1px] bg-gray-100 py-2 pl-2 pr-[3em] text-sm focus:border-grey-primary focus:outline-none dark:bg-gray-700 dark:text-white"
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
            </div>
          </div>
          <Link to="/staff/dashboard/visa/new_application">
            <button.PrimaryButton className="mt-[1em] flex gap-2 rounded-full bg-linear-gradient px-[1.5em] py-[8px] font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="cross" />
              New Application
            </button.PrimaryButton>
          </Link>
        </div>

        <section className="overflow-auto py-6">
          <table className="w-full border-collapse mt-[1em]">
            <thead className="border-b border-gray-200 text-gray-500 dark:text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Full Name
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  School Name
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Assigned Agent
                </th>
                <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                  Destination
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Service Charge
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  IHS Payment
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Visa Fee Payment
                </th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="text-sm font-medium text-grey-primary dark:text-white"
                  >
                    <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                    <td className="whitespace-nowrap gap-2 px-6 py-4">
                      {highlightText(item?.lastName || "-", searchQuery)}
                      {highlightText(item?.firstName || "-", searchQuery)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(item?.schoolName || "-", searchQuery)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(
                        item?.agent.profile.lastName || "-",
                        searchQuery
                      )}
                      {highlightText(
                        item?.agent.profile.firstName || "-",
                        searchQuery
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(item?.destination || "-", searchQuery)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">- </td>
                    <td className="whitespace-nowrap px-6 py-4">- </td>
                    <td className="whitespace-nowrap px-6 py-4">- </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(item?.issuedDate || "-", searchQuery)}
                    </td>
                    {/* <td className="whitespace-nowrap px-6 py-4">
                    {renderStatus(
                      getRemark(item?.documents, "SERVICE_CHARGE"),
                      item.documents.find(
                        (d) => d.documentType === "SERVICE_CHARGE"
                      )?.publicURL || "#"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {renderStatus(
                      item.documents.find(
                        (d) => d.documentType === "APPLICATION_FEE"
                      )?.publicURL || "#"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {renderStatus(
                      item.documents.find(
                        (d) => d.documentType === "TUTION_FEE"
                      )?.publicURL || "#"
                    )}
                  </td> */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        to="#"
                        className="font-medium text-primary-700 underline dark:text-gray-500"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={9}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={transaction}
                        alt="No applications"
                        className="mb-4"
                      />
                      No Payments made
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      <DocumentPreviewModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        previewUrl={previewUrl}
        previewFileType={previewFileType}
      />
    </main>
  );
};

export default Visa;
