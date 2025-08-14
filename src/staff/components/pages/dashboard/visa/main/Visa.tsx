import React, { useCallback, useEffect, useState } from "react";
import plus from "../../../../../../assets/svg/plus.svg";
import { Link, useNavigate } from "react-router-dom";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import DocumentPreviewModal from "../../../../../../shared/modal/DocumentPreviewModal";
import { useAllVisa } from "../../../../../../shared/redux/hooks/shared/getUserProfile";

import { FiSearch } from "react-icons/fi";
import CustomPagination from "../../../../../../shared/utils/customPagination";
import eye from "../../../../../../assets/svg/eyeImg.svg";
import { PrivateElement } from "../../../../../../shared/redux/hooks/admin/PrivateElement";
import approved from "../../../../../../assets/svg/Approved.svg";
import rejected from "../../../../../../assets/svg/Rejected.svg";
import pending from "../../../../../../assets/svg/Pending.svg";

interface VisaData {
  lastName?: string;
  firstName?: string;
  schoolName?: string;
  id?: string;
  agent?: {
    profile?: {
      lastName?: string;
      firstName?: string;
    };
  };
  destination?: string;
  issuedDate?: string;
  document?: Array<{
    documentType?: string;
    publicURL?: string;
    remark?: any;
  }>;
}

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 10 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const Visa: React.FC = () => {
  const { visa, loading, currentPage, fetchApplications } = useAllVisa();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const getFileTypeFromUrl = (url: string) => {
    const segments = url?.split("/");
    const fileExtension = segments?.pop()?.split(".")?.pop();
    switch (fileExtension) {
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

  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
    setPreviewFileType("");
  };

  useEffect(() => {
    fetchApplications?.(currentPage, itemsPerPage);
  }, [fetchApplications, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      fetchApplications?.(page, itemsPerPage);
    },
    [fetchApplications, itemsPerPage]
  );

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text?.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts?.map((part, index) =>
      part?.toLowerCase() === query?.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleViewDetails = useCallback(
    (applicationId: any) => {
      navigate("/staff/dashboard/visa/view_visa_application", {
        state: { applicationId: applicationId },
      });
    },
    [navigate]
  );

  const getStatusClassAndIcon = (status?: string) => {
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

  const renderPaymentStatus = (
    documents?: Array<{
      documentType?: string;
      publicURL?: string;
      remark?: any;
    }>,
    type?: string
  ) => {
    const document = documents?.find((doc) => doc?.documentType === type);
    const { class: statusClass, icon } = getStatusClassAndIcon(
      document?.remark
    );

    if (document) {
      return (
        <div className={`flex flex-col items-start text-xs ${statusClass}`}>
          <div className="flex items-center gap-2 text-black">
            <p>Paid</p>
            <button
              onClick={() => {
                setPreviewUrl(document?.publicURL || null);
                setPreviewFileType(
                  getFileTypeFromUrl(document?.publicURL || "")
                );
                setIsPreviewOpen(true);
              }}
              className="flex items-center gap-1 rounded-full bg-purple-white px-3 py-[4px] text-center font-medium text-[#660066]"
            >
              <img src={eye} alt="eye" />
              <span className="mr-3">View</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {icon && <img src={icon} alt="Status Icon" />}
            <p>{document?.remark}</p>
          </div>
        </div>
      );
    }
    return "-";
  };

  return (
    <main className="mt-4 font-outfit">
      <h1 className="text-2xl font-bold">Visa Application</h1>
      <div className="mt-4 h-auto w-full rounded-lg bg-white p-3 pb-[10em] dark:bg-gray-800">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <input
                type="text"
                className="border-border w-full rounded-full border-[1px] bg-gray-100 py-2 pl-2 pr-[3em] text-sm focus:border-grey-primary focus:outline-none dark:bg-gray-700 dark:text-white"
                placeholder="Search..."
                onChange={(e) => setSearchQuery(e.target?.value)}
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
            </div>
          </div>

          <PrivateElement
            feature="VISA_APPLICATION"
            page="New Visa Application"
          >
            <Link to="/staff/dashboard/visa/new_application">
              <button className="mt-4 flex gap-2 rounded-full bg-linear-gradient px-6 py-2 font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
                <img src={plus} alt="cross" />
                New Application
              </button>
            </Link>
          </PrivateElement>
        </div>

        <section className="overflow-auto py-6">
          <table className="w-full border-collapse mt-4">
            <thead className="border-b border-gray-200 text-gray-500">
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
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : visa?.length > 0 ? (
                visa?.map((item: VisaData, index: number) => (
                  <tr
                    key={index}
                    className="text-sm font-medium text-grey-primary font-outfit"
                  >
                    <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                    <td className="whitespace-nowrap gap-2 px-6 py-4">
                      {highlightText(
                        `${item?.lastName || ""} ${item?.firstName || ""}`,
                        searchQuery
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(item?.schoolName || "-", searchQuery)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(
                        `${item?.agent?.profile?.lastName || ""} ${
                          item?.agent?.profile?.firstName || ""
                        }`,
                        searchQuery
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(item?.destination || "-", searchQuery)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderPaymentStatus(item?.document, "SERVICE_CHARGE")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderPaymentStatus(item?.document, "IHS")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderPaymentStatus(item?.document, "VISA_FEE")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {item?.issuedDate
                        ? highlightText(
                            new Date(item?.issuedDate)
                              ?.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                              ?.split("/")
                              ?.join("-"),
                            searchQuery
                          )
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(item?.id)}
                        className="font-medium text-primary-700 dark:text-gray-500"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 text-center text-gray-500"
                    colSpan={10}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={transaction}
                        alt="No applications"
                        className="mb-4"
                      />
                      No Visa Application.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        {!loading && visa?.length > 0 && (
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={visa?.length === itemsPerPage}
            />
          </div>
        )}
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

export default Visa;
