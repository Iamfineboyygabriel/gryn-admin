import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import DOMPurify from "dompurify";
import { useAllApplication } from "../../../../../../../shared/redux/hooks/admin/getAdminProfile";
import CustomPagination from "../../../../../../../shared/utils/customPagination";
import { FiSearch } from "react-icons/fi";
import transaction from "../../../../../../../assets/svg/Transaction.svg";

const SkeletonRow = () => (
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
    totalPages,
    currentPage,
    loading,
    fetchApplications,
    searchTerm,
    updateSearchTerm,
  } = useAllApplication();
  console.log("applications", applications);
  const [sortField, setSortField] = useState("lastName");
  const [sortOrder, setSortOrder] = useState("asc");

  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications(currentPage, itemsPerPage);
  }, [fetchApplications, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      fetchApplications(page, itemsPerPage);
    },
    [fetchApplications, itemsPerPage]
  );

  const filteredAndSortedApplications = useMemo(() => {
    if (!applications || !Array.isArray(applications)) {
      return [];
    }

    const filtered = applications.filter((item: any) =>
      `${item?.lastName || ""} ${item?.firstName || ""} ${
        item?.middleName || ""
      }`
        .toLowerCase()
        .includes((searchTerm || "").toLowerCase())
    );

    return filtered.sort((a: any, b: any) => {
      const aValue = (a[sortField as keyof typeof a] || "").toLowerCase();
      const bValue = (b[sortField as keyof typeof b] || "").toLowerCase();
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [applications, searchTerm, sortField, sortOrder]);

  const handleViewDetails = useCallback(
    (applicationId: string) => {
      navigate(
        `/staff/dashboard/application/manage_application/view_application/${applicationId}`
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
      return text.replace(
        regex,
        (match: string) => `<mark class="bg-yellow-300">${match}</mark>`
      );
    },
    [searchTerm]
  );

  const renderTableBody = useCallback(() => {
    if (loading) {
      return (
        <>
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </>
      );
    }

    if (filteredAndSortedApplications.length > 0) {
      return filteredAndSortedApplications.map((item: any, index: number) => (
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
    } else {
      return (
        <tr>
          <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
            <div className="mt-[2em] flex flex-col items-center justify-center">
              <img src={transaction} alt="No applications" />
              <p className="mt-2 text-sm text-gray-500 dark:text-white">
                No recent applications.
              </p>
            </div>
          </td>
        </tr>
      );
    }
  }, [
    filteredAndSortedApplications,
    currentPage,
    itemsPerPage,
    sanitizeHTML,
    highlightText,
    formatData,
    handleViewDetails,
    loading,
  ]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <main>
      <div className="flex mt-[1.5em]">
        <div className="flex items-center gap-[1em]">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-full bg-gray-100 py-2 pl-2 pr-[3em] text-sm"
              placeholder="Search"
              value={searchTerm || ""}
              onChange={(e) => updateSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-[1em] top-1/2 -translate-y-1/2 transform text-lg text-gray-500" />
          </div>
          <div
            className="flex cursor-pointer items-center bg-gray-100 px-3 py-2"
            onClick={() => handleSort("lastName")}
          >
            <p className="whitespace-nowrap text-sm">
              Sort by Name
              {sortField === "lastName"
                ? sortOrder === "asc"
                  ? " ▲"
                  : " ▼"
                : ""}
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto mt-[1em]">
        <table className="mt-4 w-full table-auto">
          <thead>
            <tr className="text-gray-700  border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-normal">S/N</th>
              <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-normal">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">Email</th>
              <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-normal">
                Degree Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Course
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Documents
              </th>
              <th className="px-6 py-3 text-left whitespace-nowrap text-sm font-normal">
                Assigned Agent
              </th>
              <th className="px-6 py-3 text-left text-sm font-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
      {!loading && applications?.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="mt-6 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              onPageChange={handlePageChange}
              hasMore={applications.length === itemsPerPage}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default AllApplication;
