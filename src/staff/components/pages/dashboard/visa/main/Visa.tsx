import React, { useCallback, useEffect, useState } from "react";
import plus from "../../../../../../assets/svg/plus.svg";
import { Link } from "react-router-dom";
import approved from "../../../../../../assets/svg/Approved.svg";
import rejected from "../../../../../../assets/svg/Rejected.svg";
import pending from "../../../../../../assets/svg/Pending.svg";
import transaction from "../../../../../../assets/svg/Transaction.svg";
import DocumentPreviewModal from "../../../../../../shared/modal/DocumentPreviewModal";
import { useAllVisa } from "../../../../../../shared/redux/hooks/shared/getUserProfile";
import { FiSearch } from "react-icons/fi";
import CustomPagination from "../../../../../../shared/utils/customPagination";

const escapeRegExp = (str: any) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

interface VisaData {
  lastName: string;
  firstName: string;
  schoolName: string;
  agent: {
    profile: {
      lastName: string;
      firstName: string;
    };
  };
  destination: string;
  issuedDate: string;
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
  const { visa, loading,  totalPages, currentPage, fetchApplications, searchTerm, updateSearchTerm  } = useAllVisa();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;

  const isCurrentPageEmpty = page > totalPages;

  useEffect(() => {
    fetchApplications(currentPage, itemsPerPage);
  }, [fetchApplications, currentPage, itemsPerPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    fetchApplications(value, itemsPerPage);
  };


  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
            </div>
          </div>
          <Link to="/staff/dashboard/visa/new_application">
            <button className="mt-4 flex gap-2 rounded-full bg-linear-gradient px-6 py-2 font-medium text-white transition-colors duration-300 hover:bg-primary-700 hover:text-white">
              <img src={plus} alt="cross" />
              New Application
            </button>
          </Link>
        </div>

        <section className="overflow-auto py-6">
          <table className="w-full border-collapse mt-4">
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
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : visa && visa.length > 0 ? (
                visa.map((item: VisaData, index: number) => (
                  <tr
                    key={index}
                    className="text-sm font-medium text-grey-primary dark:text-white"
                  >
                    <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                    <td className="whitespace-nowrap gap-2 px-6 py-4">
                      {highlightText(
                        `${item.lastName} ${item.firstName}`,
                        searchQuery
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(item.schoolName || "-", searchQuery)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(
                        `${item.agent.profile.lastName} ${item.agent.profile.firstName}`,
                        searchQuery
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(item.destination || "-", searchQuery)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">-</td>
                    <td className="whitespace-nowrap px-6 py-4">-</td>
                    <td className="whitespace-nowrap px-6 py-4">-</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {highlightText(item.issuedDate || "-", searchQuery)}
                    </td>
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
        {!loading && visa && visa.length > 0 && (
          <div className="mt-6 flex justify-center">
          {/* <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={applications.length === itemsPerPage}
          /> */}
          </div>
        )}
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
