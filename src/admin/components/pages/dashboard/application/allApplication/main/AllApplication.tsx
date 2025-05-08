import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { useAllApplication } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-gray-200">
    {Array.from({ length: 9 }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

const AllApplication: React.FC = () => {
  const {
    applications,
    currentPage,
    loading,
    fetchApplications,
    searchTerm,
    updateSearchTerm,
    updateSortTerm,
    updateStatusTerm,
  } = useAllApplication();
  console.log("applications", applications);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const navigate = useNavigate();

  useEffect(() => {
    updateSortTerm("desc");
    fetchApplications(1, itemsPerPage);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications(1, itemsPerPage);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, sortOrder, status, itemsPerPage]);

  const handleSortChange = useCallback(
    (newOrder: "asc" | "desc") => {
      setSortOrder(newOrder);
      updateSortTerm(newOrder);
      fetchApplications(currentPage, itemsPerPage);
    },
    [currentPage, itemsPerPage, updateSortTerm, fetchApplications]
  );

  const handleStatusChange = useCallback(
    (newStatus: string) => {
      setStatus(newStatus);
      updateStatusTerm(newStatus);
      fetchApplications(1, itemsPerPage);
    },
    [updateStatusTerm, fetchApplications, itemsPerPage]
  );

  const handleItemsPerPageChange = useCallback(
    (newItemsPerPage: number) => {
      setItemsPerPage(newItemsPerPage);
      fetchApplications(1, newItemsPerPage);
    },
    [fetchApplications]
  );

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      fetchApplications(newPage, itemsPerPage);
    },
    [fetchApplications, itemsPerPage, sortOrder]
  );

  const handleViewDetails = useCallback(
    (applicationId: number) => {
      navigate(
        "/admin/dashboard/application/all_application/view_application",
        {
          state: { applicationId: applicationId },
        }
      );
    },
    [navigate]
  );

  const formatData = useCallback((data: any) => (data ? data : "-"), []);

  const sanitizeHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  }, []);

  const highlightText = useCallback(
    (text: string) => {
      if (!searchTerm?.trim()) return text;
      const regex = new RegExp(`(${searchTerm})`, "gi");
      return text?.replace(
        regex,
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
      );
    },
    [searchTerm]
  );

  const renderTableBody = useCallback(() => {
    if (loading) {
      return Array?.from({ length: itemsPerPage })?.map((_, index) => (
        <SkeletonRow key={`skeleton-${index}`} />
      ));
    }

    if (!applications?.length) {
      return (
        <tr>
          <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No applications found.
              </p>
            </div>
          </td>
        </tr>
      );
    }

    return applications?.map((item: any, index: number) => (
      <tr
        key={item?.id}
        className="text-sm text-grey-primary font-medium border-b border-gray-200"
      >
        <td className="whitespace-nowrap px-6 py-4">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </td>
        <td
          className="whitespace-nowrap px-6 py-4"
          dangerouslySetInnerHTML={sanitizeHTML(
            highlightText(
              `${formatData(item?.lastName)} ${formatData(
                item?.middleName
              )} ${formatData(item?.firstName)}`
            )
          )}
        />
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.email)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.degree?.university)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.intake)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.degree?.course)}
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          {formatData(item?.applicationStatus)}
        </td>
        <td className="flex items-center whitespace-nowrap px-6 py-4">
          <button
            className={`mr-2 rounded-full px-3 py-2 w-[8em] text-white ${
              item?.status === "SUBMITTED"
                ? "bg-yellow-500"
                : item?.status === "COMPLETED"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {item?.status === "SUBMITTED"
              ? "In Progress"
              : item?.status === "COMPLETED"
              ? "Completed"
              : "Declined"}
          </button>
          <button
            onClick={() => handleViewDetails(item?.id)}
            className="cursor-pointer font-semibold text-primary-700"
          >
            View details
          </button>
        </td>
      </tr>
    ));
  }, [
    loading,
    applications,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    formatData,
    handleViewDetails,
  ]);

  return (
    <main className="mt-[1.3em] font-outfit">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-[1em]">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
              placeholder="Search by name"
              value={searchTerm || ""}
              onChange={(e) => updateSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
          </div>
          <div className="flex gap-2">
            <select
              className="bg-gray-100 px-3 py-2 rounded text-sm cursor-pointer"
              value={sortOrder}
              onChange={(e) =>
                handleSortChange(e.target.value as "asc" | "desc")
              }
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <select
              className="bg-gray-100 px-3 py-2 rounded text-sm cursor-pointer"
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="SUBMITTED">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="DECLINED">Declined</option>
            </select>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm text-gray-500">Items per page:</span>
          <select
            className="bg-gray-100 px-3 py-2 rounded text-sm cursor-pointer"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto mt-[1em]">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-white">
            <tr className="text-gray-700 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Email</th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                University
              </th>
              <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                Intake
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Course
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Application Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      {!loading && (
        <div className="mt-6 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            hasMore={applications?.length === itemsPerPage}
          />
        </div>
      )}
    </main>
  );
};

export default AllApplication;
